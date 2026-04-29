using Microsoft.AspNetCore.SignalR;

namespace NoShowIQ.API.Hubs;

public class NotificationHub : Hub
{
    public const string DashboardGroup = "dashboard-operators";

    public override async Task OnConnectedAsync()
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, DashboardGroup);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, DashboardGroup);
        await base.OnDisconnectedAsync(exception);
    }

    public Task SubscribeDashboard()
    {
        return Groups.AddToGroupAsync(Context.ConnectionId, DashboardGroup);
    }
}
