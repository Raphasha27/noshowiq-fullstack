using NoShowIQ.Infrastructure.Data;
using NoShowIQ.Application.Interfaces;
using NoShowIQ.Application.Services;
using Microsoft.EntityFrameworkCore;
using NoShowIQ.API.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Core Services
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("NoShowIQDb")); // For demo purposes

// ML Engine Client
builder.Services.AddHttpClient("MLEngine", client =>
{
    client.BaseAddress = new Uri("http://localhost:8001");
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy => 
    policy.WithOrigins("http://localhost:3000")
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials());

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHub<NotificationHub>("/notifications");

app.Run();
