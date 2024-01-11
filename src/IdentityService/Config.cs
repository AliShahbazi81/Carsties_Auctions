using Duende.IdentityServer.Models;

namespace IdentityService;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            new IdentityResources.OpenId(),
            new IdentityResources.Profile(),
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[]
        {
            new("auctionApp", "Auction app fill access"),
        };

    public static IEnumerable<Client> Clients =>
        new Client[]
        {
            new()
            {
                ClientId = "postman",
                ClientName = "Postman",
                AllowedScopes = {"openid", "profile", "auctionApp"},
                // Using postman, we do not have any redirect link, but it has to be filled. The url down below is just an example
                RedirectUris = {"https://www.getpostman.com/oauth2/callback"},
                ClientSecrets = new[] {new Secret("NotASecret".Sha256())},
                // Authentication flow
                AllowedGrantTypes = {GrantType.ResourceOwnerPassword}
            },
            new()
            {
                ClientId = "nextApp",
                ClientName = "nextApp",
                ClientSecrets = {new Secret("secret".Sha256())},
                // CodeAndClientCredentials allow the client app to establish communication internally and securely without access_token involvement inside the browser
                AllowedGrantTypes = GrantTypes.CodeAndClientCredentials,
                // For developing in mobile app
                RequirePkce = false,
                // Client-side url
                RedirectUris = {"http://localhost:3000/api/auth/callback/id-server"},
                // For allowing to refresh token-access
                AllowOfflineAccess = true,
                AllowedScopes = {"openid", "profile", "auctionApp"},
                // Extend token lifetime - NOTE: This is not a good approach for production application
                AccessTokenLifetime = 3600 * 24 * 30
            }
        };
}
