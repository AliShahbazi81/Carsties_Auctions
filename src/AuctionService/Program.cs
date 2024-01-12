using AuctionService.Consumers;
using AuctionService.Data;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
    
    x.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();
    
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("auction", false));
    
    x.UsingRabbitMq((context, cfg) =>
    {
        // In order to use docker as the container, we have to specify the host for the rabbitMq
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });
        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Tells the server who the token was issued by
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        // Since our server is running on HTTP, this has to be false, otherwise -> true
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters.ValidateAudience = false;
        // Make sure the string all lower case
        options.TokenValidationParameters.NameClaimType = "username";
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
// Without UseAuthentication, almost all of our endpoints will return 401
app.UseAuthentication();
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
