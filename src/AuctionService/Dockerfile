﻿FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app
EXPOSE 80

# Copy the csproj file and restore as a distinct layer
COPY src/AuctionService/AuctionService.csproj src/AuctionService/AuctionService.csproj
COPY src/Contracts/Contracts.csproj src/Contracts/Contracts.csproj

# Restore the app folders over
RUN dotnet restore src/AuctionService/AuctionService.csproj

# Copy the app folders over
COPY src/AuctionService src/AuctionService
COPY src/Contracts src/Contracts

# Set the working directory and publish the app
WORKDIR /app/src/AuctionService
RUN dotnet publish -c Release -o /app/src/out

#Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT ["dotnet", "AuctionService.dll"]