using ECommerce.Application.Common.Exceptions;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Orders.Dtos;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Orders;

public class OrderService : IOrderService
{
    private readonly IAppDbContext _context;

    public OrderService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<OrderDto> CreateAsync(int userId, CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        // Merge duplicate product ids into a single quantity.
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
            Status = "Paid"
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
                UnitPrice = product.Price,
                Quantity = quantity
            });
        }

        order.Total = order.Items.Sum(i => i.UnitPrice * i.Quantity);

        _context.Orders.Add(order);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(order);
    }

    public async Task<IEnumerable<OrderDto>> GetMyOrdersAsync(int userId, CancellationToken cancellationToken = default)
    {
        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);

        return orders.Select(MapToDto).ToList();
    }

    private static OrderDto MapToDto(Order order) => new()
    {
        Id = order.Id,
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
