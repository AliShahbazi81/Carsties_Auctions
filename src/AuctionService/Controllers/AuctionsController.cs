using AuctionService.Data;
using Microsoft.AspNetCore.Mvc;

namespace AuctionService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuctionsController : ControllerBase
{
    private readonly AuctionDbContext _context;

    public AuctionsController(AuctionDbContext context)
    {
        _context = context;
    }
}