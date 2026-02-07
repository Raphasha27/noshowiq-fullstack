using Microsoft.AspNetCore.Mvc;
using HealthBridge.Core.Entities;
using HealthBridge.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;

namespace HealthBridge.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ClinicsController : ControllerBase
{
    private static readonly List<Clinic> _clinics = DemoDataSeeder.GetDemoClinics();
    private static readonly List<ResourcePrediction> _predictions = DemoDataSeeder.GetDemoResourcePredictions(_clinics);

    [HttpGet]
    public ActionResult<IEnumerable<Clinic>> GetAllClinics([FromQuery] string? province = null, [FromQuery] string? type = null)
    {
        var query = _clinics.AsQueryable();

        if (!string.IsNullOrEmpty(province))
            query = query.Where(c => c.Province.Equals(province, StringComparison.OrdinalIgnoreCase));

        if (!string.IsNullOrEmpty(type))
            query = query.Where(c => c.Type.ToString().Equals(type, StringComparison.OrdinalIgnoreCase));

        return Ok(query.ToList());
    }

    [HttpGet("{id}")]
    public ActionResult<Clinic> GetClinicById(Guid id)
    {
        var clinic = _clinics.FirstOrDefault(c => c.Id == id);
        if (clinic == null)
            return NotFound(new { message = $"Clinic with ID {id} not found" });

        return Ok(clinic);
    }

    [HttpGet("{id}/predictions")]
    public ActionResult<IEnumerable<ResourcePrediction>> GetClinicPredictions(Guid id)
    {
        var clinic = _clinics.FirstOrDefault(c => c.Id == id);
        if (clinic == null)
            return NotFound(new { message = $"Clinic with ID {id} not found" });

        var predictions = _predictions.Where(p => p.ClinicId == id).ToList();
        return Ok(predictions);
    }

    [HttpGet("provinces")]
    public ActionResult<IEnumerable<string>> GetProvinces()
    {
        var provinces = _clinics.Select(c => c.Province).Distinct().OrderBy(p => p).ToList();
        return Ok(provinces);
    }

    [HttpGet("statistics")]
    public ActionResult GetStatistics()
    {
        var totalClinics = _clinics.Count;
        var totalCapacity = _clinics.Sum(c => c.Capacity);
        var totalStaff = _clinics.Sum(c => c.CurrentStaffCount);
        var criticalClinics = _clinics.Count(c => c.CurrentStaffing == StaffingLevel.Critical);

        var stats = new
        {
            total_clinics = totalClinics,
            total_capacity = totalCapacity,
            total_staff = totalStaff,
            critical_staffing_count = criticalClinics,
            provinces = _clinics.Select(c => c.Province).Distinct().Count(),
            active_clinics = _clinics.Count(c => c.IsActive)
        };

        return Ok(stats);
    }

    [HttpPost]
    public ActionResult<Clinic> CreateClinic([FromBody] Clinic clinic)
    {
        clinic.Id = Guid.NewGuid();
        clinic.CreatedAt = DateTime.UtcNow;
        _clinics.Add(clinic);

        return CreatedAtAction(nameof(GetClinicById), new { id = clinic.Id }, clinic);
    }

    [HttpPut("{id}")]
    public ActionResult UpdateClinic(Guid id, [FromBody] Clinic updatedClinic)
    {
        var clinic = _clinics.FirstOrDefault(c => c.Id == id);
        if (clinic == null)
            return NotFound();

        clinic.Name = updatedClinic.Name;
        clinic.Province = updatedClinic.Province;
        clinic.Municipality = updatedClinic.Municipality;
        clinic.Latitude = updatedClinic.Latitude;
        clinic.Longitude = updatedClinic.Longitude;
        clinic.Type = updatedClinic.Type;
        clinic.Capacity = updatedClinic.Capacity;
        clinic.ServicesOffered = updatedClinic.ServicesOffered;
        clinic.CurrentStaffing = updatedClinic.CurrentStaffing;
        clinic.CurrentStaffCount = updatedClinic.CurrentStaffCount;
        clinic.RequiredStaffCount = updatedClinic.RequiredStaffCount;
        clinic.IsActive = updatedClinic.IsActive;

        return Ok(clinic);
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteClinic(Guid id)
    {
        var clinic = _clinics.FirstOrDefault(c => c.Id == id);
        if (clinic == null)
            return NotFound();

        _clinics.Remove(clinic);
        return NoContent();
    }
}
