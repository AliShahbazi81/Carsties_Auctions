using System;
using System.Threading;
using System.Threading.Tasks;
using BiddingService.Enums;
using BiddingService.Models;
using Contracts;
using MassTransit;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using MongoDB.Entities;

namespace BiddingService.Services;

public class CheckAuctionFinished : BackgroundService
{
    // NOTE: Background service uses singleton while the MassTransit uses Scoped.
    // Hence, we cannot use MassTransit and inject it here
    private readonly ILogger<CheckAuctionFinished> _logger;
    private readonly IServiceProvider _services;
    public CheckAuctionFinished(
        ILogger<CheckAuctionFinished> logger,
        IServiceProvider services)
    {
        _logger = logger;
        _services = services;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting check for finished auctions");

        stoppingToken.Register(() => _logger.LogInformation("==> The auction check is stopping"));

        while (!stoppingToken.IsCancellationRequested)
        {
            await CheckAuction(stoppingToken);

            await Task.Delay(5000, stoppingToken);
        }
    }

    // Background service's function to check if the auction is ended.
    private async Task CheckAuction(CancellationToken stoppingToken)
    {
        var finishedAuction = await DB.Find<Auction>()
            .Match(x => x.AuctionEnd < DateTime.UtcNow)
            .Match(x => !x.Finished)
            .ExecuteAsync(stoppingToken);
        
        if(finishedAuction.Count == 0) return;
        
        _logger.LogInformation($"==> Found {finishedAuction.Count} auctions have been completed");
        
        // NOTE: Background service uses singleton while the MassTransit uses Scoped.
        // Hence, we have to specify the Scope inside the function not in the Constructor
        using var scope = _services.CreateScope();
        var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        foreach (var auction in finishedAuction)
        {
            auction.Finished = true;
            await auction.SaveAsync(null, stoppingToken);
            
            // Find the winner of the bid - For the one who has the highest bid and also not BelowBid
            var winnerBid = await DB.Find<Bid>()
                .Match(x => x.AuctionId == auction.ID)
                .Match(b => b.BidStatus == BidStatus.Accepted)
                .Sort(x => x.Descending(x => x.Amount))
                .ExecuteFirstAsync(stoppingToken);
            
            // publish to the service bus
            await endpoint.Publish(new AuctionFinished
            {
                ItemSold = winnerBid != null,
                AuctionId = auction.ID,
                Winner = winnerBid?.Bidder,
                Seller = auction.Seller,
                Amount = winnerBid?.Amount
            }, stoppingToken);
        }


    }
}