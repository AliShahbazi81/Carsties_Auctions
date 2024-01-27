using Contracts;
using MassTransit;
using NotificationService.Hubs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddMassTransit(x =>
{
    x.AddConsumersFromNamespaceContaining<AuctionCreated>();
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter("nt", false));

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMqHost"], "/", host =>
        {
            cfg.Host(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            cfg.Host(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });

        cfg.ConfigureEndpoints(context);
    });
});

// SignalR Configs
builder.Services.AddSignalR();

var app = builder.Build();

// Inform the app where the hub is
app.MapHub<NotificationHub>("/notifications");

app.Run();