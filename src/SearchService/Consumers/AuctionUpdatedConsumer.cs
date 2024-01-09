using AutoMapper;
using AutoMapper.Configuration.Conventions;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Entities;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    private readonly IMapper _mapper;
    public AuctionUpdatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        Console.WriteLine("--> Consuming auction updated: " + context.Message.Id);

        // Item is the entity that we are going to save to the database. We are mapping the context message to the item
        var item = _mapper.Map<Item>(context.Message);
        
        // We are updating the item in the database
        var result  = await DB.Update<Item>()
            // .Match -> To find the item that we want to update
            .Match(a => a.ID == context.Message.Id)
            .ModifyOnly(x => new
            {
                x.Color,
                x.Make,
                x.Model,
                x.Year,
                x.Mileage
            }, item)
            .ExecuteAsync();

        if (!result.IsAcknowledged)
            throw new MessageException(typeof(AuctionUpdated), "Problem updating mongoDb");
    }
}