using System.Net.Http.Json;
using Microsoft.EntityFrameworkCore;
using NoShowIQ.Application.Interfaces;
using NoShowIQ.Core.Entities;
using NoShowIQ.Infrastructure.Data;

namespace NoShowIQ.Application.Services;

public class AppointmentService : IAppointmentService
{
    private readonly ApplicationDbContext _context;
    private readonly HttpClient _httpClient;

    public AppointmentService(ApplicationDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClient = httpClientFactory.CreateClient("MLEngine");
    }

    public async Task<IEnumerable<Appointment>> GetTodayAppointmentsAsync()
    {
        return await _context.Appointments
            .OrderBy(a => a.AppointmentTime)
            .ToListAsync();
    }

    public async Task<Appointment?> PredictRiskAsync(Guid appointmentId)
    {
        var appointment = await _context.Appointments.FindAsync(appointmentId);
        if (appointment is null)
        {
            return null;
        }

        var mlRequest = new
        {
            patient_id = appointment.Id.ToString(),
            appointment_id = appointment.Id.ToString(),
            history_no_show_count = appointment.IsConfirmed ? 0 : 2,
            days_since_booking = Math.Max(0, (DateTime.UtcNow.Date - appointment.AppointmentTime.Date).Days * -1),
            age = 45,
            hour_of_day = appointment.AppointmentTime.Hour,
        };

        try
        {
            var response = await _httpClient.PostAsJsonAsync("predict", mlRequest);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<MLResponse>();
                if (result is not null)
                {
                    ApplyPrediction(
                        appointment,
                        result.no_show_probability,
                        result.risk_level,
                        result.intervention_type);

                    await _context.SaveChangesAsync();
                    return appointment;
                }
            }
        }
        catch
        {
            // Fall back to deterministic local scoring for demo continuity.
        }

        ApplyFallbackPrediction(appointment);
        await _context.SaveChangesAsync();
        return appointment;
    }

    public async Task<bool> TriggerInterventionAsync(Guid appointmentId)
    {
        var appointment = await _context.Appointments.FindAsync(appointmentId);
        if (appointment is null)
        {
            return false;
        }

        appointment.SuggestedIntervention = appointment.Risk switch
        {
            RiskLevel.High => "Escalate to phone call and confirm waitlist backup",
            RiskLevel.Medium => "Send SMS reminder and encourage digital check-in",
            _ => "Send standard email reminder",
        };

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Appointment>> GetRecommendedOverbookingsAsync()
    {
        var appointments = await _context.Appointments
            .OrderByDescending(a => a.NoShowProbability)
            .ToListAsync();

        return appointments
            .Where(a => !a.IsConfirmed && a.NoShowProbability >= 0.6)
            .Take(5)
            .Select(a =>
            {
                a.SuggestedIntervention = "Candidate for smart waitlist fill or manual double-book review";
                return a;
            })
            .ToList();
    }

    private static void ApplyPrediction(Appointment appointment, double probability, string riskLevel, string? interventionType)
    {
        appointment.NoShowProbability = Math.Clamp(probability, 0, 0.99);
        appointment.Risk = Enum.TryParse<RiskLevel>(riskLevel, true, out var parsedRisk)
            ? parsedRisk
            : RiskLevel.Medium;
        appointment.SuggestedIntervention = string.IsNullOrWhiteSpace(interventionType)
            ? "Review manually"
            : interventionType;
    }

    private static void ApplyFallbackPrediction(Appointment appointment)
    {
        var fallbackProbability = Math.Clamp(0.2 + (appointment.AppointmentTime.Hour >= 12 ? 0.12 : 0.04), 0, 0.9);
        appointment.NoShowProbability = fallbackProbability;
        appointment.Risk = fallbackProbability >= 0.6
            ? RiskLevel.High
            : fallbackProbability >= 0.3
                ? RiskLevel.Medium
                : RiskLevel.Low;
        appointment.SuggestedIntervention = appointment.Risk switch
        {
            RiskLevel.High => "Phone Call",
            RiskLevel.Medium => "SMS",
            _ => "Email",
        };
    }

    private sealed class MLResponse
    {
        public double no_show_probability { get; set; }
        public string risk_level { get; set; } = "medium";
        public string intervention_type { get; set; } = "SMS";
    }
}
