using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Orders;
using ECommerce.Application.Payments;
using ECommerce.Infrastructure.Authentication;
using ECommerce.Infrastructure.Invoices;
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
        FirebaseSettings firebaseSettings)
    {
        services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IAppDbContext>(provider => provider.GetRequiredService<AppDbContext>());

        services.AddSingleton(jwtSettings);
        services.AddScoped<IPasswordHasher, BCryptPasswordHasher>();
        services.AddScoped<IJwtTokenGenerator, JwtTokenGenerator>();

        // Singleton: the underlying FirebaseApp is process-wide and must be created only once.
        services.AddSingleton(firebaseSettings);
        services.AddSingleton<IFirebaseTokenValidator, FirebaseTokenValidator>();

        services.AddSingleton(stripeSettings);
        services.AddScoped<IPaymentService, StripePaymentService>();

        services.AddScoped<IInvoiceService, InvoiceService>();

        return services;
    }
}
