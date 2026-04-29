using Microsoft.EntityFrameworkCore;
using NoShowIQ.API.Hubs;
using NoShowIQ.Application.Interfaces;
using NoShowIQ.Application.Services;
using NoShowIQ.Infrastructure.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors();

builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("NoShowIQDb"));

var mlEngineUrl = builder.Configuration["ML_ENGINE_URL"] ?? "http://localhost:8001";
builder.Services.AddHttpClient("MLEngine", client =>
{
    client.BaseAddress = new Uri(mlEngineUrl);
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var frontendOrigin = builder.Configuration["FRONTEND_ORIGIN"] ?? "http://localhost:3000";
app.UseCors(policy =>
    policy.WithOrigins(frontendOrigin)
          .WithMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
          .AllowAnyHeader()
          .AllowCredentials());

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHub<NotificationHub>("/notifications");

app.Run();

