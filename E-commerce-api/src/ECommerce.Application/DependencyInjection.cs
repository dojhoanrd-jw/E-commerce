using ECommerce.Application.Addresses;
using ECommerce.Application.Auth;
using ECommerce.Application.Orders;
using ECommerce.Application.Products;
using ECommerce.Application.Reviews;
using ECommerce.Application.Sellers;
using ECommerce.Application.Users;
using Microsoft.Extensions.DependencyInjection;

namespace ECommerce.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<ISellerService, SellerService>();
        services.AddScoped<IAddressService, AddressService>();
        return services;
    }
}
