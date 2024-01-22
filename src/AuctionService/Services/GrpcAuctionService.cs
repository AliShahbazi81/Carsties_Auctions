using AuctionService.Data;
using Grpc.Core;

namespace AuctionService.Services;

public class GrpcAuctionService : GrpcAuction.GrpcAuctionBase
{
    private readonly AuctionDbContext _context;
    public GrpcAuctionService(AuctionDbContext context)
    {
        _context = context;
    }

    // The method down below is being overriden using the same namespace inside the auctions.proto file
    public override async Task<GrpcAuctionResponse> GetAuction(
        GetAuctionRequest request, 
        ServerCallContext context)
    {
        Console.WriteLine("==> Receive Grpc request for auction");

        var auction = await _context.Auctions
            .FindAsync(Guid.Parse(request.Id));

        if (auction is null)
            throw new RpcException(new Status(StatusCode.NotFound, "Not found"));

        var response = new GrpcAuctionResponse
        {
            Auction = new GrpcAuctionModel
            {
                AuctionEnd = auction.AuctionEnd.ToString(),
                Id = auction.Id.ToString(),
                ReservePrice = auction.ReservePrice,
                Seller = auction.Seller
            }
        };

        return response;
    }
}