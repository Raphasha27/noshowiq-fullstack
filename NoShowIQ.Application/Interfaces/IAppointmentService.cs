using NoShowIQ.Core.Entities;

namespace NoShowIQ.Application.Interfaces;

public interface IAppointmentService
{
    Task<IEnumerable<Appointment>> GetTodayAppointmentsAsync();
    Task<Appointment> PredictRiskAsync(Guid appointmentId);
    Task<bool> TriggerInterventionAsync(Guid appointmentId);
    Task<IEnumerable<Appointment>> GetRecommendedOverbookingsAsync();
}
