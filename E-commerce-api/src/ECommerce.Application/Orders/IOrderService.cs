using ECommerce.Application.Orders.Dtos;

namespace ECommerce.Application.Orders;

public interface IOrderService
{
    Task<OrderDto> CreateAsync(int userId, CreateOrderRequest request, string? stripeSessionId = null, CancellationToken cancellationToken = default);

    Task<IEnumerable<OrderDto>> GetMyOrdersAsync(int userId, CancellationToken cancellationToken = default);

    Task<IEnumerable<OrderDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task ChangeStatusAsync(int orderId, string status, CancellationToken cancellationToken = default);
}
