namespace NoShowIQ.Application.Interfaces;

public interface INotificationService
{
    Task<bool> SendSmsAsync(string phoneNumber, string message);
    Task<bool> SendWhatsAppAsync(string phoneNumber, string templateId, object parameters);
    Task<IEnumerable<NotificationLog>> GetLogsAsync();
}

public class NotificationLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string Type { get; set; } = string.Empty; // SMS or WhatsApp
    public string Recipient { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "Sent";
}
