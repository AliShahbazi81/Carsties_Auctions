FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app
EXPOSE 80

# Copy all .csproj files and restore as distinct layers. Use of the same COPY command
# for every dockerfile in the project to take advantage of docker caching
COPY Carsties.sln Carsties.sln
COPY src/AuctionService/AuctionService.csproj src/AuctionService/AuctionService.csproj
COPY src/SearchService/SearchService.csproj src/SearchService/SearchService.csproj
COPY src/GatewayService/GatewayService.csproj src/GatewayService/GatewayService.csproj
COPY src/Contracts/Contracts.csproj src/Contracts/Contracts.csproj
COPY src/IdentityService/IdentityService.csproj src/IdentityService/IdentityService.csproj

# Restore package deps
RUN dotnet restore Carsties.sln

# Copy the app folders over
# Since AuctionService has dependency to Contracts, we specify the Contract over here as well
COPY src/AuctionService src/AuctionService
COPY src/Contracts src/Contracts
WORKDIR /app/src/AuctionService
RUN dotnet publish -c Release -o /app/src/out

# Build runtime image
# Much more smaller runtime rather than sdk:7.0
FROM mcr.microsoft.com/dotnet/aspnet:7.0
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT ["dotnet", "AuctionService.dll"]