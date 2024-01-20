using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Entities;

namespace SearchService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine("--> Consuming auction created: " + context.Message.Id);

        var item = new Item
        {
            ID = context.Message.Id.ToString(),
            AuctionEnd = context.Message.AuctionEnd,
            Color = context.Message.Color,
            CreatedAt = context.Message.CreatedAt,
            CurrentHighBid = context.Message.CurrentHighBid,
            ImageUrl = context.Message.ImageUrl,
            Make = context.Message.Make,
            Mileage = context.Message.Mileage,
            Model = context.Message.Model,
            ReservePrice = context.Message.ReservePrice
        };

        await item.SaveAsync();
    }
}