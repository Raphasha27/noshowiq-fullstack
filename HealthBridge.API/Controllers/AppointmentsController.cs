using Microsoft.AspNetCore.Mvc;
using NoShowIQ.Application.Interfaces;
using NoShowIQ.Core.Entities;
using NoShowIQ.API.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace NoShowIQ.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AppointmentsController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;
    private readonly IHubContext<NotificationHub> _hubContext;

    public AppointmentsController(IAppointmentService appointmentService, IHubContext<NotificationHub> hubContext)
    {
        _appointmentService = appointmentService;
        _hubContext = hubContext;
    }

    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
    {
        var appointments = await _appointmentService.GetTodayAppointmentsAsync();
        return Ok(appointments);
    }

    [HttpPost("{id}/predict")]
    public async Task<IActionResult> PredictRisk(Guid id)
    {
        var result = await _appointmentService.PredictRiskAsync(id);
        
        // Notify frontend in real-time
        if (result.Risk == RiskLevel.High)
        {
            await _hubContext.Clients.All.SendAsync("RiskAlert", 
                $"High Risk Detected for {result.PatientName}", "high");
        }
        
        return Ok(result);
    }

    [HttpPost("overbook")]
    public async Task<IActionResult> GetOverbookingRecommendations()
    {
        var recommendations = await _appointmentService.GetRecommendedOverbookingsAsync();
        return Ok(recommendations);
    }
}
