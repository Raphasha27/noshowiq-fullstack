# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files first to cache dependencies
COPY ["NoShowIQ.API/NoShowIQ.API.csproj", "NoShowIQ.API/"]
COPY ["NoShowIQ.Application/NoShowIQ.Application.csproj", "NoShowIQ.Application/"]
COPY ["NoShowIQ.Infrastructure/NoShowIQ.Infrastructure.csproj", "NoShowIQ.Infrastructure/"]
COPY ["NoShowIQ.Core/NoShowIQ.Core.csproj", "NoShowIQ.Core/"]

RUN dotnet restore "NoShowIQ.API/NoShowIQ.API.csproj"

# Copy the rest of the code
COPY . .
WORKDIR "/src/NoShowIQ.API"
RUN dotnet build "NoShowIQ.API.csproj" -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish "NoShowIQ.API.csproj" -c Release -o /app/publish

# Final Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
ENTRYPOINT ["dotnet", "NoShowIQ.API.dll"]
