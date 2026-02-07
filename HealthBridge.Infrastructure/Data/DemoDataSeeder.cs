using HealthBridge.Core.Entities;

namespace HealthBridge.Infrastructure.Data;

public static class DemoDataSeeder
{
    public static List<Clinic> GetDemoClinics()
    {
        return new List<Clinic>
        {
            // Limpopo Province
            new Clinic
            {
                Id = Guid.NewGuid(),
                Name = "Vuwani Community Clinic",
                Province = "Limpopo",
                Municipality = "Thulamela",
                Latitude = -22.9491,
                Longitude = 30.4256,
                Type = ClinicType.PrimaryHealthcare,
                Capacity = 250,
                ServicesOffered = new List<string> { "Primary Care", "HIV/AIDS Treatment", "TB Screening", "Chronic Disease Management" },
                CurrentStaffing = StaffingLevel.Insufficient,
                CurrentStaffCount = 4,
                RequiredStaffCount = 6,
                CreatedAt = DateTime.UtcNow.AddMonths(-6),
                IsActive = true
            },
            new Clinic
            {
                Id = Guid.NewGuid(),
                Name = "Makhado Mobile Unit",
                Province = "Limpopo",
                Municipality = "Makhado",
                Latitude = -23.0494,
                Longitude = 29.9090,
                Type = ClinicType.MobileClinic,
                Capacity = 150,
                ServicesOffered = new List<string> { "Mobile Clinic", "Vaccinations", "Basic Checkups" },
                CurrentStaffing = StaffingLevel.Adequate,
                CurrentStaffCount = 3,
                RequiredStaffCount = 3,
                CreatedAt = DateTime.UtcNow.AddMonths(-3),
                IsActive = true
            },
            new Clinic
            {
                Id = Guid.NewGuid(),
                Name = "Polokwane Central CHC",
                Province = "Limpopo",
                Municipality = "Polokwane",
                Latitude = -23.9045,
                Longitude = 29.4689,
                Type = ClinicType.CommunityHealthCentre,
                Capacity = 400,
                ServicesOffered = new List<string> { "Primary Care", "Maternity", "TB Treatment", "HIV Care", "Surgery" },
                CurrentStaffing = StaffingLevel.Optimal,
                CurrentStaffCount = 15,
                RequiredStaffCount = 14,
                CreatedAt = DateTime.UtcNow.AddYears(-2),
                IsActive = true
            },

            // Eastern Cape Province
            new Clinic
            {
                Id = Guid.NewGuid(),
                Name = "Lusikisiki CHC",
                Province = "Eastern Cape",
                Municipality = "Ingquza Hill",
                Latitude = -31.3636,
                Longitude = 29.5819,
                Type = ClinicType.CommunityHealthCentre,
                Capacity = 200,
                ServicesOffered = new List<string> { "Primary Care", "HIV Testing", "Antenatal Care" },
                CurrentStaffing = StaffingLevel.Adequate,
                CurrentStaffCount = 7,
                RequiredStaffCount = 8,
                CreatedAt = DateTime.UtcNow.AddMonths(-8),
                IsActive = true
            },
            new Clinic
            {
                Id = Guid.NewGuid(),
                Name = "Mthatha District Hospital",
                Province = "Eastern Cape",
                Municipality = "King Sabata Dalindyebo",
                Latitude = -31.5845,
                Longitude = 28.7845,
                Type = ClinicType.DistrictHospital,
                Capacity = 600,
                ServicesOffered = new List<string> { "Emergency Care", "Surgery", "Maternity", "Pediatrics", "HIV/AIDS", "TB Ward" },
                CurrentStaffing = StaffingLevel.Adequate,
                CurrentStaffCount = 45,
                RequiredStaffCount = 50,
                CreatedAt = DateTime.UtcNow.AddYears(-5),
                IsActive = true
            },
            new Clinic
            {
                Id = Guid.NewGuid(),
                Name = "Coffee Bay Mobile Clinic",
                Province = "Eastern Cape",
                Municipality = "Mthatha",
                Latitude = -31.9826,
                Longitude = 29.1584,
                Type = ClinicType.MobileClinic,
                Capacity = 120,
                ServicesOffered = new List<string> { "Mobile Clinic", "Family Planning", "HIV Testing" },
                CurrentStaffing = StaffingLevel.Adequate,
                CurrentStaffCount = 2,
                RequiredStaffCount = 2,
                CreatedAt = DateTime.UtcNow.AddMonths(-4),
                IsActive = true
            },

            // KwaZulu-Natal Province
            new Clinic
            {
                Id = Guid.NewGuid(),
                Name = "Nquthu District Clinic",
                Province = "KwaZulu-Natal",
                Municipality = "Nquthu",
                Latitude = -28.2167,
                Longitude = 30.3167,
                Type = ClinicType.PrimaryHealthcare,
                Capacity = 180,
                ServicesOffered = new List<string> { "Primary Care", "HIV/AIDS Treatment", "TB Screening" },
                CurrentStaffing = StaffingLevel.Insufficient,
                CurrentStaffCount = 3,
                RequiredStaffCount = 5,
                CreatedAt = DateTime.UtcNow.AddMonths(-10),
                IsActive = true
            },
            new Clinic
            {
                Id = Guid.NewGuid(),
                Name = "Ladysmith CHC",
                Province = "KwaZulu-Natal",
                Municipality = "Alfred Duma",
                Latitude = -28.5560,
                Longitude = 29.7812,
                Type = ClinicType.CommunityHealthCentre,
                Capacity = 320,
                ServicesOffered = new List<string> { "Primary Care", "Maternity", "Pediatrics", "TB Treatment", "HIV Care" },
                CurrentStaffing = StaffingLevel.Adequate,
                CurrentStaffCount = 12,
                RequiredStaffCount = 13,
                CreatedAt = DateTime.UtcNow.AddYears(-1),
                IsActive = true
            }
        };
    }

    public static List<MedicineStock> GetDemoMedicineStock(List<Clinic> clinics)
    {
        var medicines = new List<MedicineStock>();
        var random = new Random();

        var medicineTypes = new[]
        {
            new { Name = "ARV (HIV Treatment)", Category = "Chronic", BaseStock = 2000 },
            new { Name = "TB Medication", Category = "Chronic", BaseStock = 800 },
            new { Name = "Paracetamol", Category = "Acute", BaseStock = 5000 },
            new { Name = "Amoxicillin", Category = "Acute", BaseStock = 3000 },
            new { Name = "Metformin (Diabetes)", Category = "Chronic", BaseStock = 2500 },
            new { Name = "Blood Pressure Meds", Category = "Chronic", BaseStock = 2200 }
        };

        foreach (var clinic in clinics)
        {
            foreach (var medType in medicineTypes)
            {
                var currentQty = random.Next(50, medType.BaseStock);
                var dailyConsumption = random.Next(30, 150);
                var daysUntilStockout = (double)currentQty / dailyConsumption;

                RiskLevel risk = RiskLevel.Low;
                if (daysUntilStockout < 7) risk = RiskLevel.High;
                else if (daysUntilStockout < 14) risk = RiskLevel.Medium;

                medicines.Add(new MedicineStock
                {
                    Id = Guid.NewGuid(),
                    ClinicId = clinic.Id,
                    MedicineName = medType.Name,
                    MedicineCategory = medType.Category,
                    CurrentQuantity = currentQty,
                    MinimumThreshold = dailyConsumption * 7,
                    OptimalQuantity = dailyConsumption * 30,
                    ExpiryDate = DateTime.UtcNow.AddMonths(random.Next(2, 18)),
                    PredictedDaysUntilStockout = daysUntilStockout,
                    StockRisk = risk,
                    LastUpdated = DateTime.UtcNow
                });
            }
        }

        return medicines;
    }

    public static List<ResourcePrediction> GetDemoResourcePredictions(List<Clinic> clinics)
    {
        var predictions = new List<ResourcePrediction>();
        var random = new Random();

        foreach (var clinic in clinics)
        {
            var baseVolume = clinic.Capacity * random.Next(60, 120) / 100;
            var isPensionWeek = random.Next(0, 4) == 0; // 25% chance

            var predictedVolume = isPensionWeek ? (int)(baseVolume * 1.6) : baseVolume;
            var utilizationRatio = (double)predictedVolume / clinic.Capacity;

            RiskLevel risk = RiskLevel.Low;
            if (utilizationRatio > 1.2) risk = RiskLevel.High;
            else if (utilizationRatio > 0.85) risk = RiskLevel.Medium;

            var medicineReqs = new Dictionary<string, int>
            {
                { "ARV", predictedVolume * 2 },
                { "TB Meds", predictedVolume / 3 },
                { "Paracetamol", predictedVolume * 4 },
                { "Chronic Meds", predictedVolume * 2 }
            };

            predictions.Add(new ResourcePrediction
            {
                Id = Guid.NewGuid(),
                ClinicId = clinic.Id,
                PredictionDate = DateTime.UtcNow.Date,
                PredictedPatientVolume = predictedVolume,
                MedicineRequirements = medicineReqs,
                RequiredStaffCount = Math.Max(3, predictedVolume / 50),
                ConfidenceScore = random.Next(75, 96) / 100.0,
                ResourceRisk = risk,
                RecommendedAction = risk == RiskLevel.High
                    ? $"URGENT: Allocate {predictedVolume / 50 - clinic.CurrentStaffCount} additional staff"
                    : risk == RiskLevel.Medium
                    ? "Prepare for high volume. Consider extending hours."
                    : "Normal operations expected.",
                CreatedAt = DateTime.UtcNow
            });
        }

        return predictions;
    }
}
