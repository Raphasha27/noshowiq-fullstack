using Microsoft.AspNetCore.Mvc;
using NoShowIQ.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace HealthBridge.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpPost("send-sms")]
    public async Task<IActionResult> SendSms([FromBody] SmsRequest request)
    {
        var result = await _notificationService.SendSmsAsync(request.PhoneNumber, request.Message);
        return Ok(new { success = result, message = "SMS queued for delivery" });
    }

    [HttpPost("send-whatsapp")]
    public async Task<IActionResult> SendWhatsApp([FromBody] WhatsAppRequest request)
    {
        var result = await _notificationService.SendWhatsAppAsync(request.PhoneNumber, request.TemplateId, request.Parameters);
        return Ok(new { success = result, message = "WhatsApp message queued" });
    }

    [HttpGet("logs")]
    public async Task<IActionResult> GetLogs()
    {
        var logs = await _notificationService.GetLogsAsync();
        return Ok(logs);
    }
}

public class SmsRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}

public class WhatsAppRequest
{
    public string PhoneNumber { get; set; } = string.Empty;
    public string TemplateId { get; set; } = string.Empty;
    public object Parameters { get; set; } = new { };
}
