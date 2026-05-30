# Build context is the repository root (Render: Root Directory empty, Dockerfile Path ./E-commerce-api/Dockerfile)

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files first and restore (better layer caching)
COPY ["E-commerce-api/src/ECommerce.Domain/ECommerce.Domain.csproj", "E-commerce-api/src/ECommerce.Domain/"]
COPY ["E-commerce-api/src/ECommerce.Application/ECommerce.Application.csproj", "E-commerce-api/src/ECommerce.Application/"]
COPY ["E-commerce-api/src/ECommerce.Infrastructure/ECommerce.Infrastructure.csproj", "E-commerce-api/src/ECommerce.Infrastructure/"]
COPY ["E-commerce-api/src/ECommerce.Api/ECommerce.Api.csproj", "E-commerce-api/src/ECommerce.Api/"]
RUN dotnet restore "E-commerce-api/src/ECommerce.Api/ECommerce.Api.csproj"

# Copy the rest of the source and publish
COPY . .
RUN dotnet publish "E-commerce-api/src/ECommerce.Api/ECommerce.Api.csproj" \
    -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ECommerce.Api.dll"]
