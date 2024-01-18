using MongoDB.Entities;
using SearchService.Entities;

namespace SearchService.Services;

public class AuctionSvcHttpClient
{
    // For communication between Auction and Search services
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;

    public AuctionSvcHttpClient(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _config = config;
    }

    public async Task<List<Item>> GetItemsForSearchDbAsync()
    {
        // It gives a list of items which have updated most recently
        var lastUpdated = await DB.Find<Item, string>()
            .Sort(x => x.Descending(x => x.UpdatedAt))
            .Project(x => x.UpdatedAt.ToString())
            .ExecuteFirstAsync();

        // GetFromJsonAsync => Gets the list after calling the auction service, automatically deserialize it into list of items. 
        return await _httpClient.GetFromJsonAsync<List<Item>>(_config["AuctionServiceUrl"] + "/api/auctions?date=" + lastUpdated);
    }
}