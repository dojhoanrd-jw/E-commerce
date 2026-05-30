using ECommerce.Application.Common.Exceptions;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Orders.Dtos;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Orders;

public class OrderService : IOrderService
{
    private static readonly string[] AllowedStatuses = { "Pending", "Shipped", "Delivered", "Cancelled" };

    private readonly IAppDbContext _context;

    public OrderService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDto> CreateAsync(int userId, CreateOrderRequest request, string? stripeSessionId = null, CancellationToken cancellationToken = default)
    {
        // Idempotency: if this Stripe session already produced an order, return it.
        if (stripeSessionId is not null)
        {
            var existing = await _context.Orders
                .Where(o => o.StripeSessionId == stripeSessionId)
                .Include(o => o.Items)
                .FirstOrDefaultAsync(cancellationToken);

            if (existing is not null)
            {
                return BuildDto(existing);
            }
        }

        var grouped = request.Items
            .GroupBy(i => new { i.ProductId, i.VariantId })
            .Select(g => new { g.Key.ProductId, g.Key.VariantId, Quantity = g.Sum(x => x.Quantity) })
            .ToList();

        var productIds = grouped.Select(g => g.ProductId).Distinct().ToList();
        var products = await _context.Products
            .Include(p => p.Variants)
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        var order = new Order
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            Status = "Pending",
            StripeSessionId = stripeSessionId
        };

        foreach (var item in grouped)
        {
            var product = products.FirstOrDefault(p => p.Id == item.ProductId)
                ?? throw new NotFoundException(nameof(Product), item.ProductId);

            string? variantLabel = null;

            if (item.VariantId.HasValue)
            {
                var variant = product.Variants.FirstOrDefault(v => v.Id == item.VariantId.Value)
                    ?? throw new NotFoundException(nameof(ProductVariant), item.VariantId.Value);

                if (variant.Stock < item.Quantity)
                {
                    throw new ConflictException(
                        $"Not enough stock for \"{product.Name}\" ({Label(variant)}) (available: {variant.Stock}).");
                }

                variant.Stock -= item.Quantity;
                variantLabel = Label(variant);
            }
            else
            {
                if (product.Stock < item.Quantity)
                {
                    throw new ConflictException(
                        $"Not enough stock for \"{product.Name}\" (available: {product.Stock}).");
                }

                product.Stock -= item.Quantity;
            }

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                VariantId = item.VariantId,
                VariantLabel = variantLabel,
                UnitPrice = product.SalePrice ?? product.Price,
                Quantity = item.Quantity
            });
        }

        order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        return BuildDto(order);
    }

    public Task<IEnumerable<OrderDto>> GetMyOrdersAsync(int userId, CancellationToken cancellationToken = default)
    {
        return QueryToDtoAsync(_context.Orders.Where(o => o.UserId == userId), cancellationToken);
    }

    public Task<IEnumerable<OrderDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return QueryToDtoAsync(_context.Orders, cancellationToken);
    }

    public async Task<OrderDto> GetByIdAsync(int orderId, int userId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var orders = await QueryToDtoAsync(_context.Orders.Where(o => o.Id == orderId), cancellationToken);
        var order = orders.FirstOrDefault() ?? throw new NotFoundException(nameof(Order), orderId);

        if (!isAdmin && order.UserId != userId)
        {
            throw new ForbiddenException("You can only view your own orders.");
        }

        return order;
    }

    public async Task ChangeStatusAsync(int orderId, string status, CancellationToken cancellationToken = default)
    {
        if (!AllowedStatuses.Contains(status))
        {
            throw new ConflictException($"Invalid order status \"{status}\".");
        }

        var order = await _context.Orders.FindAsync([orderId], cancellationToken)
            ?? throw new NotFoundException(nameof(Order), orderId);

        order.Status = status;
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task RequestReturnAsync(int orderId, int userId, string reason, CancellationToken cancellationToken = default)
    {
        var order = await _context.Orders.FindAsync([orderId], cancellationToken)
            ?? throw new NotFoundException(nameof(Order), orderId);

        if (order.UserId != userId)
        {
            throw new ForbiddenException("You can only request returns on your own orders.");
        }

        if (order.Status is not ("Shipped" or "Delivered"))
        {
            throw new ConflictException("Only shipped or delivered orders can be returned.");
        }

        if (order.ReturnStatus != "None")
        {
            throw new ConflictException("A return has already been requested for this order.");
        }

        order.ReturnStatus = "Requested";
        order.ReturnReason = reason.Trim();
        order.ReturnRequestedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task ResolveReturnAsync(int orderId, bool approve, CancellationToken cancellationToken = default)
    {
        var order = await _context.Orders.FindAsync([orderId], cancellationToken)
            ?? throw new NotFoundException(nameof(Order), orderId);

        if (order.ReturnStatus != "Requested")
        {
            throw new ConflictException("This order has no pending return request.");
        }

        if (approve)
        {
            order.ReturnStatus = "Refunded";
            order.Status = "Cancelled";
        }
        else
        {
            order.ReturnStatus = "Rejected";
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    private static string Label(ProductVariant v)
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

    private static OrderDto BuildDto(Order order) => new()
    {
        Id = order.Id,
        UserId = order.UserId,
        UserName = string.Empty,
        CreatedAt = order.CreatedAt,
        Total = order.Total,
        Status = order.Status,
        ReturnStatus = order.ReturnStatus,
        ReturnReason = order.ReturnReason,
        Items = order.Items
            .Select(i => new OrderItemDto
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                VariantLabel = i.VariantLabel,
                UnitPrice = i.UnitPrice,
                Quantity = i.Quantity
            })
            .ToList()
    };

    private async Task<IEnumerable<OrderDto>> QueryToDtoAsync(IQueryable<Order> query, CancellationToken cancellationToken)
    {
        return await query
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new OrderDto
            {
                Id = o.Id,
                UserId = o.UserId,
                UserName = _context.Users
                    .Where(u => u.Id == o.UserId)
                    .Select(u => u.Name)
                    .FirstOrDefault() ?? string.Empty,
                CreatedAt = o.CreatedAt,
                Total = o.Total,
                Status = o.Status,
                ReturnStatus = o.ReturnStatus,
                ReturnReason = o.ReturnReason,
                Items = o.Items
                    .Select(i => new OrderItemDto
                    {
                        ProductId = i.ProductId,
                        ProductName = i.ProductName,
                        VariantLabel = i.VariantLabel,
                        UnitPrice = i.UnitPrice,
                        Quantity = i.Quantity
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
