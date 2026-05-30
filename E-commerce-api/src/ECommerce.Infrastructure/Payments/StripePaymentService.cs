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
        var grouped = request.Items
            .GroupBy(i => new { i.ProductId, i.VariantId })
            .Select(g => new { g.Key.ProductId, g.Key.VariantId, Quantity = g.Sum(x => x.Quantity) })
            .ToList();

        var productIds = grouped.Select(g => g.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Include(p => p.Variants)
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        var lineItems = new List<SessionLineItemOptions>();

        foreach (var item in grouped)
        {
            var product = products.FirstOrDefault(p => p.Id == item.ProductId)
                ?? throw new NotFoundException("Product", item.ProductId);

            var name = product.Name;

            if (item.VariantId.HasValue)
            {
                var variant = product.Variants.FirstOrDefault(v => v.Id == item.VariantId.Value)
                    ?? throw new NotFoundException("ProductVariant", item.VariantId.Value);

                if (variant.Stock < item.Quantity)
                {
                    throw new ConflictException(
                        $"Not enough stock for \"{product.Name}\" (available: {variant.Stock}).");
                }

                var label = VariantLabel(variant);
                if (label.Length > 0)
                {
                    name = $"{product.Name} ({label})";
                }
            }
            else if (product.Stock < item.Quantity)
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
                        Name = name
                    }
                },
                Quantity = item.Quantity
            });
        }

        var itemsForMetadata = grouped
            .Select(g => new CreateOrderItemDto { ProductId = g.ProductId, Quantity = g.Quantity, VariantId = g.VariantId })
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

    private static string VariantLabel(ProductVariant v)
    {
        var parts = new List<string>();
        if (!string.IsNullOrWhiteSpace(v.Size))
        {
            parts.Add(v.Size);
        }
        if (!string.IsNullOrWhiteSpace(v.Color))
        {
            parts.Add(v.Color);
        }
        return string.Join(" · ", parts);
    }
}
