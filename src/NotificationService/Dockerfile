FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app
EXPOSE 80

# Copy the csproj file and restore a distinct layer
COPY src/NotificationService/NotificationService.csproj src/NotificationService/NotificationService.csproj
COPY src/Contracts/Contracts.csproj src/Contracts/Contracts.csproj

# Restore the app folders over
RUN dotnet restore src/NotificationService/NotificationService.csproj

# Copy the app folders over
COPY src/NotificationService src/NotificationService
COPY src/Contracts src/Contracts

# Set the working directory and publish the app
WORKDIR /app/src/NotificationService
RUN dotnet publish -c Release -o /app/src/out

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/src/out .
ENTRYPOINT ["dotnet", "NotificationService.dll"]