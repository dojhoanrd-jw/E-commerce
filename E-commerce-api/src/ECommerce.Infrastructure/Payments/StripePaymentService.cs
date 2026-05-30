using System.Text.Json;
using ECommerce.Application.Common.Exceptions;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Orders;
using ECommerce.Application.Orders.Dtos;
using ECommerce.Application.Payments;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Stripe;
using Stripe.Checkout;

namespace ECommerce.Infrastructure.Payments;

public class StripePaymentService : IPaymentService
{
    private readonly IAppDbContext _context;
    private readonly IOrderService _orderService;
    private readonly StripeSettings _settings;

    public StripePaymentService(IAppDbContext context, IOrderService orderService, StripeSettings settings)
    {
        _context = context;
        _orderService = orderService;
        _settings = settings;
        StripeConfiguration.ApiKey = settings.SecretKey;
    }

    public async Task<string> CreateCheckoutSessionAsync(int userId, CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        var requested = request.Items
            .GroupBy(i => i.ProductId)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.Quantity));

        var productIds = requested.Keys.ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        var lineItems = new List<SessionLineItemOptions>();

        foreach (var (productId, quantity) in requested)
        {
            var product = products.FirstOrDefault(p => p.Id == productId)
                ?? throw new NotFoundException("Product", productId);

            if (product.Stock < quantity)
            {
                throw new ConflictException(
                    $"Not enough stock for \"{product.Name}\" (available: {product.Stock}).");
            }

            lineItems.Add(new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = _settings.Currency,
                    UnitAmount = (long)((product.SalePrice ?? product.Price) * 100),
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = product.Name
                    }
                },
                Quantity = quantity
            });
        }

        var itemsForMetadata = requested
            .Select(kv => new CreateOrderItemDto { ProductId = kv.Key, Quantity = kv.Value })
            .ToList();

        var options = new SessionCreateOptions
        {
            Mode = "payment",
            LineItems = lineItems,
            AllowPromotionCodes = true,
            ShippingAddressCollection = new SessionShippingAddressCollectionOptions
            {
                AllowedCountries = new List<string> { "US", "MX", "CO", "AR", "ES", "CL", "PE", "EC" }
            },
            SuccessUrl = _settings.SuccessUrl + "?session_id={CHECKOUT_SESSION_ID}",
            CancelUrl = _settings.CancelUrl,
            Metadata = new Dictionary<string, string>
            {
                ["userId"] = userId.ToString(),
                ["items"] = JsonSerializer.Serialize(itemsForMetadata)
            }
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options, cancellationToken: cancellationToken);
        return session.Url;
    }

    public async Task<OrderDto> ConfirmAsync(string sessionId, CancellationToken cancellationToken = default)
    {
        var service = new SessionService();
        var session = await service.GetAsync(sessionId, cancellationToken: cancellationToken);

        if (session.PaymentStatus != "paid")
        {
            throw new ConflictException("Payment was not completed.");
        }

        var userId = int.Parse(session.Metadata["userId"]);
        var items = JsonSerializer.Deserialize<List<CreateOrderItemDto>>(session.Metadata["items"])
            ?? new List<CreateOrderItemDto>();

        var request = new CreateOrderRequest { Items = items };

        return await _orderService.CreateAsync(userId, request, sessionId, cancellationToken);
    }
}
