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
                return new OrderDto
                {
                    Id = existing.Id,
                    UserId = existing.UserId,
                    UserName = string.Empty,
                    CreatedAt = existing.CreatedAt,
                    Total = existing.Total,
                    Status = existing.Status,
                    Items = existing.Items
                        .Select(i => new OrderItemDto
                        {
                            ProductId = i.ProductId,
                            ProductName = i.ProductName,
                            UnitPrice = i.UnitPrice,
                            Quantity = i.Quantity
                        })
                        .ToList()
                };
            }
        }

        var requested = request.Items
            .GroupBy(i => i.ProductId)
            .ToDictionary(g => g.Key, g => g.Sum(x => x.Quantity));

        var productIds = requested.Keys.ToList();
        var products = await _context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(cancellationToken);

        var order = new Order
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            Status = "Pending",
            StripeSessionId = stripeSessionId
        };

        foreach (var (productId, quantity) in requested)
        {
            var product = products.FirstOrDefault(p => p.Id == productId)
                ?? throw new NotFoundException(nameof(Product), productId);

            if (product.Stock < quantity)
            {
                throw new ConflictException(
                    $"Not enough stock for \"{product.Name}\" (available: {product.Stock}).");
            }

            product.Stock -= quantity;

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                ProductName = product.Name,
                UnitPrice = product.SalePrice ?? product.Price,
                Quantity = quantity
            });
        }

        order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            UserName = string.Empty,
            CreatedAt = order.CreatedAt,
            Total = order.Total,
            Status = order.Status,
            Items = order.Items
                .Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    UnitPrice = i.UnitPrice,
                    Quantity = i.Quantity
                })
                .ToList()
        };
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
                Items = o.Items
                    .Select(i => new OrderItemDto
                    {
                        ProductId = i.ProductId,
                        ProductName = i.ProductName,
                        UnitPrice = i.UnitPrice,
                        Quantity = i.Quantity
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
