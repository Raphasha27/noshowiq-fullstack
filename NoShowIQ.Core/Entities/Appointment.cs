namespace NoShowIQ.Core.Entities;

public enum RiskLevel
{
    Low,
    Medium,
    High
}

public class Appointment
{
    public Guid Id { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public DateTime AppointmentTime { get; set; }
    public double NoShowProbability { get; set; }
    public RiskLevel Risk { get; set; }
    public bool IsOverbooked { get; set; }
    public bool IsConfirmed { get; set; }
    public string SuggestedIntervention { get; set; } = string.Empty;
}
