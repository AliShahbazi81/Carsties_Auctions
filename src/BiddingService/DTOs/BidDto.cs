using System;

namespace BiddingService.DTOs;

public record BidDto(
    string Id, 
    string AuctionId,
    string Bidder,
    DateTime BidTime,
    int Amount,
    string BidStatus);
