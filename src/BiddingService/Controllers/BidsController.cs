using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BiddingService.DTOs;
using BiddingService.Enums;
using BiddingService.Models;
using BiddingService.Services;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BiddingService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidsController : ControllerBase
{
    private readonly IPublishEndpoint _endpoint;
    private readonly GrpcAuctionClient _grpcClient;
    public BidsController(
        IPublishEndpoint endpoint, 
        GrpcAuctionClient grpcClient)
    {
        _endpoint = endpoint;
        _grpcClient = grpcClient;
    }
    [HttpPost]
    public async Task<ActionResult<BidDto>> PlaceBid(string auctionId, int amount)
    {
        var auction = await DB.Find<Auction>().OneAsync(auctionId);

        if (auction == null)
        {
            auction = _grpcClient.GetAuction(auctionId);

            if (auction is null)
                return BadRequest("Cannot accept bids on this auction at this time");
        }

        if (auction.Seller == User.Identity.Name)
        {
            return BadRequest("You cannot bid on your own auction");
        }

        var bid = new Bid
        {
            Amount = amount,
            AuctionId = auctionId,
            Bidder = User.Identity.Name
        };

        // Check to see if the auction has been finished
        if (auction.AuctionEnd < DateTime.UtcNow)
        {
            bid.BidStatus = BidStatus.Finished;
        }
        // Check if the auction is finished
        else
        {
            // Get the current highest bid
            // The reason to sort: We are about to find the highest bid for the car. In this case, we sort them in descending so that the very first
            // data inside the table will be the highest bid
            var highBid = await DB.Find<Bid>()
                .Match(a => a.AuctionId == auctionId)
                .Sort(b => b.Descending(x => x.Amount))
                .ExecuteFirstAsync();

            // If the suggested bid is higher than Highest Bid
            if (highBid != null && amount > highBid.Amount || highBid == null)
            {
                bid.BidStatus = amount > auction.ReservePrice ? BidStatus.Accepted : BidStatus.AcceptedBelowReserve;
            }

            // If the bid is lower than the highest Bid
            if (highBid != null && bid.Amount <= highBid.Amount)
            {
                bid.BidStatus = BidStatus.TooLow;
            }
        }

        await DB.SaveAsync(bid);
        
        // Publishing the bid
        await _endpoint.Publish(new BidPlaced
        {
            Id = bid.ID,
            AuctionId = bid.AuctionId,
            Bidder = bid.Bidder,
            BidTime = bid.BidTime,
            Amount = bid.Amount,
            BidStatus = bid.BidStatus.ToString()
        });

        return Ok(new BidDto 
        (
            bid.ID,
            bid.AuctionId,
            bid.Bidder,
            bid.BidTime,
            bid.Amount,
            bid.BidStatus.ToString()
        ));
    }

    [HttpGet("{auctionId}")]
    public async Task<ActionResult<List<BidDto>>> GetBidsAuction(string auctionId)
    {
        var bids = await DB.Find<Bid>()
            .Match(a => a.AuctionId == auctionId)
            .Sort(b => b.Descending(a => a.BidTime))
            .ExecuteAsync();

        return bids.Select(x => new BidDto
        (
            x.ID,
            x.AuctionId,
            x.Bidder,
            x.BidTime,
            x.Amount,
            x.BidStatus.ToString()
        )).ToList();
    }
}