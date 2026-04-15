using NoShowIQ.Application.Interfaces;

namespace NoShowIQ.Infrastructure.Services;

public class MockNotificationService : INotificationService
{
    private static readonly List<NotificationLog> _logs = new();

    public async Task<bool> SendSmsAsync(string phoneNumber, string message)
    {
        // Simulate network delay
        await Task.Delay(500);

        var log = new NotificationLog
        {
            Type = "SMS",
            Recipient = phoneNumber,
            Message = message,
            Status = "Delivered"
        };

        _logs.Add(log);
        Console.WriteLine($"[SMS] To: {phoneNumber} | Message: {message}");
        return true;
    }

    public async Task<bool> SendWhatsAppAsync(string phoneNumber, string templateId, object parameters)
    {
        await Task.Delay(800);

        var message = $"Template: {templateId} | Params: {System.Text.Json.JsonSerializer.Serialize(parameters)}";

        var log = new NotificationLog
        {
            Type = "WhatsApp",
            Recipient = phoneNumber,
            Message = message,
            Status = "Read"
        };

        _logs.Add(log);
        Console.WriteLine($"[WhatsApp] To: {phoneNumber} | {message}");
        return true;
    }

    public Task<IEnumerable<NotificationLog>> GetLogsAsync()
    {
        return Task.FromResult<IEnumerable<NotificationLog>>(_logs.OrderByDescending(l => l.Timestamp));
    }
}
