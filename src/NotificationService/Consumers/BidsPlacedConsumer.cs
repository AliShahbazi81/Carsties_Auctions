using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class BidsPlacedConsumer : IConsumer<BidsPlacedConsumer>
{
    private readonly IHubContext<NotificationHub> _hubContext;

    public BidsPlacedConsumer(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    public async Task Consume(ConsumeContext<BidsPlacedConsumer> context)
    {
        Console.WriteLine("==>Bids placed message received");

        await _hubContext.Clients.All.SendAsync("BidsPlaced", context.Message);
    }
}