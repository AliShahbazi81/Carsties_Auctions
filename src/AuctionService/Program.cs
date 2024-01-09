using AuctionService.Data;
using MassTransit;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AuctionDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddMassTransit(x =>
{
    // When mass transit is down we will face data inconsistency. For avoid that, we have to implement outbox
    // Which will save the message and deliver the message to the consumer service when the mass transit is up again
    x.AddEntityFrameworkOutbox<AuctionDbContext>(options =>
    {
        // If is up do nothing, otherwise, check outbox every 10 seconds to check there are any undelivered messages 
        options.QueryDelay = TimeSpan.FromSeconds(10);
        
        // Mention which database we are using. 
        //! Note, by now, SQL mass transit does not have any method for SQL. Only Postgres and Mongo
        options.UsePostgres();
        options.UseBusOutbox();
    });
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseAuthorization();

app.MapControllers();

try
{
    DbInitializer.InitDb(app);
}
catch (Exception e)
{
    Console.WriteLine(e);
}

app.Run();
