using NoShowIQ.Core.Entities;
using NoShowIQ.Application.Interfaces;

namespace NoShowIQ.Application.Services;

public class OverbookingService
{
    private readonly IAppointmentService _appointmentService;

    public OverbookingService(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    public async Task<List<Appointment>> IdentifyOverbookingOpportunities()
    {
        var appointments = await _appointmentService.GetTodayAppointmentsAsync();
        var opportunities = new List<Appointment>();

        foreach (var app in appointments)
        {
            // If risk is high (> 75%), it's a candidate for overbooking
            if (app.NoShowProbability > 0.75)
            {
                app.SuggestedIntervention = "High Risk: Consider Double-Booking or Immediate Reminder";
                opportunities.Add(app);
            }
        }

        return opportunities;
    }

    public double CalculatePreventedLoss(List<Appointment> overbookedSlots, double averageRevenuePerSlot)
    {
        // Simple logic: Saved Revenue = Count(Recovered Slots) * Average Revenue
        return overbookedSlots.Count(a => a.IsConfirmed) * averageRevenuePerSlot;
    }
}
