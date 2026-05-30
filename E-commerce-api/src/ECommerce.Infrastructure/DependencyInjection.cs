using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Payments;
using ECommerce.Infrastructure.Authentication;
using ECommerce.Infrastructure.Payments;
using ECommerce.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string? connectionString,
        JwtSettings jwtSettings,
        StripeSettings stripeSettings,
        GoogleSettings googleSettings)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

        services.AddSingleton(jwtSettings);
        services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        services.AddSingleton(googleSettings);
        services.AddScoped<IGoogleTokenValidator, GoogleTokenValidator>();

        services.AddSingleton(stripeSettings);
        services.AddScoped<IPaymentService, StripePaymentService>();

        return services;
    }
}
