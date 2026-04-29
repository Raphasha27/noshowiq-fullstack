using NoShowIQ.Core.Entities;

namespace NoShowIQ.Infrastructure.Data;

public static class ApplicationDbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        if (context.Appointments.Any())
        {
            return;
        }

        var baseDay = DateTime.Today;

        context.Appointments.AddRange(
            new Appointment
            {
                Id = Guid.NewGuid(),
                PatientName = "Sarah Jenkins",
                AppointmentTime = baseDay.AddHours(9),
                NoShowProbability = 0.18,
                Risk = RiskLevel.Low,
                IsConfirmed = true,
                SuggestedIntervention = "Email",
            },
            new Appointment
            {
                Id = Guid.NewGuid(),
                PatientName = "Robert Blake",
                AppointmentTime = baseDay.AddHours(11),
                NoShowProbability = 0.72,
                Risk = RiskLevel.High,
                IsConfirmed = false,
                SuggestedIntervention = "Phone Call",
            },
            new Appointment
            {
                Id = Guid.NewGuid(),
                PatientName = "Elena Rodriguez",
                AppointmentTime = baseDay.AddHours(13),
                NoShowProbability = 0.43,
                Risk = RiskLevel.Medium,
                IsConfirmed = false,
                SuggestedIntervention = "SMS",
            });

        await context.SaveChangesAsync();
    }
}
