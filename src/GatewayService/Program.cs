using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

// Gateway configurations
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// Add Authentication configuration. This has to be identical with the one which is in the Program.cs inside the auctionService.
// We have to duplicate the configurations, but this is the way to do it.
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Tells the server who the token was issued by
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        // Since our server is running on HTTP, this has to be false, otherwise -> true
        options.RequireHttpsMetadata = false;
        // We have to disable this because we are using the same token for all services
        options.TokenValidationParameters.ValidateAudience = false;
        options.TokenValidationParameters.NameClaimType = "username";
    });

// Cors policy is just being used for the signalR since the client has to be connected straight away with the signalR
builder.Services.AddCors(option =>
{
    option.AddPolicy("customPolicy", b =>
    {
        b.AllowAnyHeader()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithOrigins(builder.Configuration["ClientApp"]!);
    });
});

var app = builder.Build();

app.UseCors();

app.MapReverseProxy();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
