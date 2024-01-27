using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    private readonly IHubContext<NotificationHub> _hubContext;
    public AuctionCreatedConsumer(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("==> Auction Created message received");
        
        // Since we are not using identity service to check who is logged in, we will send the 
        // broadcast message whoever is connected to the application
        await _hubContext.Clients.All.SendAsync("AuctionCreated", context.Message);
    }
}