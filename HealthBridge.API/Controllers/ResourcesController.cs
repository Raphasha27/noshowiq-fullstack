using Microsoft.AspNetCore.Mvc;
using HealthBridge.Core.Entities;
using HealthBridge.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace HealthBridge.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ResourcesController : ControllerBase
{
    private static readonly List<Clinic> _clinics = DemoDataSeeder.GetDemoClinics();
    private static readonly List<MedicineStock> _medicineStock = DemoDataSeeder.GetDemoMedicineStock(_clinics);
    private static readonly List<ResourcePrediction> _predictions = DemoDataSeeder.GetDemoResourcePredictions(_clinics);

    [HttpGet("predictions")]
    public ActionResult<IEnumerable<ResourcePrediction>> GetAllPredictions(
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] string? riskLevel = null)
    {
        var query = _predictions.AsQueryable();

        if (startDate.HasValue)
            query = query.Where(p => p.PredictionDate >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(p => p.PredictionDate <= endDate.Value);

        if (!string.IsNullOrEmpty(riskLevel))
        {
            if (Enum.TryParse<RiskLevel>(riskLevel, true, out var risk))
                query = query.Where(p => p.ResourceRisk == risk);
        }

        return Ok(query.OrderByDescending(p => p.CreatedAt).ToList());
    }

    [HttpPost("predict/{clinicId}")]
    public ActionResult<ResourcePrediction> TriggerPrediction(Guid clinicId)
    {
        var clinic = _clinics.FirstOrDefault(c => c.Id == clinicId);
        if (clinic == null)
            return NotFound(new { message = $"Clinic with ID {clinicId} not found" });

        var existingPrediction = _predictions.FirstOrDefault(p => p.ClinicId == clinicId);
        if (existingPrediction != null)
            return Ok(existingPrediction);

        // Generate new prediction
        var random = new Random();
        var baseVolume = clinic.Capacity * random.Next(60, 120) / 100;
        var predictedVolume = baseVolume;
        var utilizationRatio = (double)predictedVolume / clinic.Capacity;

        RiskLevel risk = RiskLevel.Low;
        if (utilizationRatio > 1.2) risk = RiskLevel.High;
        else if (utilizationRatio > 0.85) risk = RiskLevel.Medium;

        var newPrediction = new ResourcePrediction
        {
            Id = Guid.NewGuid(),
            ClinicId = clinicId,
            PredictionDate = DateTime.UtcNow.Date,
            PredictedPatientVolume = predictedVolume,
            MedicineRequirements = new Dictionary<string, int>
            {
                { "ARV", predictedVolume * 2 },
                { "TB Meds", predictedVolume / 3 }
            },
            RequiredStaffCount = Math.Max(3, predictedVolume / 50),
            ConfidenceScore = random.Next(75, 96) / 100.0,
            ResourceRisk = risk,
            RecommendedAction = "Prediction generated",
            CreatedAt = DateTime.UtcNow
        };

        _predictions.Add(newPrediction);
        return Ok(newPrediction);
    }

    [HttpGet("medicine-alerts")]
    public ActionResult GetMedicineAlerts([FromQuery] string? riskLevel = null)
    {
        var query = _medicineStock.AsQueryable();

        if (!string.IsNullOrEmpty(riskLevel))
        {
            if (Enum.TryParse<RiskLevel>(riskLevel, true, out var risk))
                query = query.Where(m => m.StockRisk == risk);
        }

        var alerts = query
            .Where(m => m.StockRisk != RiskLevel.Low)
            .OrderBy(m => m.PredictedDaysUntilStockout)
            .Select(m => new
            {
                m.Id,
                m.ClinicId,
                ClinicName = _clinics.FirstOrDefault(c => c.Id == m.ClinicId)?.Name ?? "Unknown",
                m.MedicineName,
                m.MedicineCategory,
                m.CurrentQuantity,
                m.MinimumThreshold,
                m.PredictedDaysUntilStockout,
                m.StockRisk,
                m.LastUpdated
            })
            .ToList();

        return Ok(alerts);
    }

    [HttpGet("staff-allocation")]
    public ActionResult GetStaffAllocationRecommendations()
    {
        var recommendations = _predictions
            .Join(_clinics,
                p => p.ClinicId,
                c => c.Id,
                (p, c) => new
                {
                    ClinicId = c.Id,
                    ClinicName = c.Name,
                    Province = c.Province,
                    PredictedVolume = p.PredictedPatientVolume,
                    Capacity = c.Capacity,
                    CurrentStaff = c.CurrentStaffCount,
                    RequiredStaff = p.RequiredStaffCount,
                    StaffGap = p.RequiredStaffCount - c.CurrentStaffCount,
                    RiskLevel = p.ResourceRisk,
                    Recommendation = p.RecommendedAction
                })
            .Where(r => r.StaffGap > 0)
            .OrderByDescending(r => r.StaffGap)
            .ToList();

        return Ok(recommendations);
    }

    [HttpGet("dashboard-summary")]
    public ActionResult GetDashboardSummary()
    {
        var today = DateTime.UtcNow.Date;
        var todaysPredictions = _predictions.Where(p => p.PredictionDate == today).ToList();

        var summary = new
        {
            total_predicted_patients = todaysPredictions.Sum(p => p.PredictedPatientVolume),
            high_risk_clinics = todaysPredictions.Count(p => p.ResourceRisk == RiskLevel.High),
            medicine_alerts = _medicineStock.Count(m => m.StockRisk != RiskLevel.Low),
            critical_medicine_alerts = _medicineStock.Count(m => m.StockRisk == RiskLevel.High),
            staff_shortages = _clinics.Count(c => c.CurrentStaffing == StaffingLevel.Insufficient || c.CurrentStaffing == StaffingLevel.Critical),
            average_confidence = todaysPredictions.Any() ? todaysPredictions.Average(p => p.ConfidenceScore) : 0
        };

        return Ok(summary);
    }
}
