FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app
EXPOSE 80

# Copy the csproj file and restore as a disctint layer
COPY src/BiddingService/BiddingService.csproj src/BiddingService/BiddingService.csproj
COPY src/Contracts/Contracts.csproj src/Contracts/Contracts.csproj

# Restore package dependencies
RUN dotnet restore src/BiddingService/BiddingService.csproj

# Copy the app folders over
COPY src/BiddingService src/BiddingService
COPY src/Contracts src/Contracts

# Set the working directory and publish the app
WORKDIR /app/src/BiddingService
RUN dotnet publish -c Release -o /app/src/out

#Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT ["dotnet", "BiddingService.dll"]
