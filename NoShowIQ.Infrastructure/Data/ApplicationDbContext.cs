using Microsoft.EntityFrameworkCore;
using NoShowIQ.Core.Entities;

namespace NoShowIQ.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Appointment> Appointments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Appointment>()
            .Property(a => a.NoShowProbability)
            .HasColumnType("decimal(18,4)");
    }
}
