FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app
EXPOSE 80

# Copy the csproj file and restore as a distinct layer
COPY src/GatewayService/GatewayService.csproj src/GatewayService/GatewayService.csproj

# Restore package dependencies
RUN dotnet restore src/GatewayService/GatewayService.csproj

# Copy the app folder over
COPY src/GatewayService src/GatewayService

# Set the work directory and publish the app
WORKDIR /app/src/GatewayService
RUN dotnet publish -c Release -o /app/src/out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT ["dotnet", "GatewayService.dll"]