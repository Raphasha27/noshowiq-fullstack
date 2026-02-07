using NoShowIQ.Application.Interfaces;
using NoShowIQ.Core.Entities;
using NoShowIQ.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

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
            .Where(a => a.AppointmentTime.Date == DateTime.Today)
            .OrderBy(a => a.AppointmentTime)
            .ToListAsync();
    }

    public async Task<Appointment> PredictRiskAsync(Guid appointmentId)
    {
        var app = await _context.Appointments.FindAsync(appointmentId);
        if (app == null) return null;

        // Call Python ML Engine
        var mlRequest = new 
        {
            patient_id = app.Id.ToString(), // Temporary mockup
            appointment_id = app.Id.ToString(),
            history_no_show_count = 5, // Logic to fetch this from DB
            days_since_booking = 14,   // Logic
            age = 45,                  // Logic
            hour_of_day = app.AppointmentTime.Hour
        };
        
        var response = await _httpClient.PostAsJsonAsync("/predict", mlRequest);
        
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadFromJsonAsync<MLResponse>();
            app.NoShowProbability = result.no_show_probability;
            app.Risk = Enum.Parse<RiskLevel>(result.risk_level, true);
            app.SuggestedIntervention = result.intervention_type;
            
            await _context.SaveChangesAsync();
        }

        return app;
    }

    private class MLResponse
    {
        public double no_show_probability { get; set; }
        public string risk_level { get; set; }
        public string intervention_type { get; set; }
    }

    public Task<bool> TriggerInterventionAsync(Guid appointmentId) => throw new NotImplementedException();
    
    public Task<IEnumerable<Appointment>> GetRecommendedOverbookingsAsync() => throw new NotImplementedException();
}
