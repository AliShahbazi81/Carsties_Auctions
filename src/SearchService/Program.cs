using System.Net;
using MassTransit;
using Polly;
using Polly.Extensions.Http;
using SearchService.Consumers;
using SearchService.Data;
using SearchService.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient<AuctionSvcHttpClient>().AddPolicyHandler(GetPolicy());
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddMassTransit(x =>
{
    // We have to inform mass transit where to search for the consumer
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();
    
    // To change the naming format of the mass transit queue
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("search", false));
    x.UsingRabbitMq((context, cfg) =>
    {
        // The configs down below are written for docker specifically
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });
        // If auction is created successfully, but Mongo which is our search Db is down, then we will face problem.
        // Hence, we will implement retry policy to avoid that
        cfg.ReceiveEndpoint("search-auction-created", endpoint =>
        {
            endpoint.UseMessageRetry(r => r.Interval(5, 5));
            
            // Which consumer we are implementing for
            endpoint.ConfigureConsumer<AuctionCreatedConsumer>(context);
        });
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseAuthorization();

app.MapControllers();

// Since this application is microservice, we have to remove the dependencies as much as possible
// Lifetime.ApplicationStarted.Register makes sure that the searchService runs even if the AuctionService is not started
// Without using the Lifetime, we will not be able to send requests to the SearchService.
// So, we have to make sure to use Lifetime.ApplicationStarted.
app.Lifetime.ApplicationStarted.Register(async () =>
{
    try
    {
        await DbInitializer.InitDb(app);
    }
    catch (Exception e)
    {
        Console.WriteLine(e);
        throw;
    }
});

app.Run();

static IAsyncPolicy<HttpResponseMessage> GetPolicy()
    => HttpPolicyExtensions
        // When the application faces "refuse connection" error
        .HandleTransientHttpError()
        .OrResult(msg => msg.StatusCode == HttpStatusCode.NotFound)
        .WaitAndRetryForeverAsync(_ => TimeSpan.FromSeconds(3));
