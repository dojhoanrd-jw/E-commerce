using ECommerce.Application.Orders.Dtos;

namespace ECommerce.Application.Orders;

public interface IOrderService
{
    Task<OrderDto> CreateAsync(int userId, CreateOrderRequest request, CancellationToken cancellationToken = default);

    Task<IEnumerable<OrderDto>> GetMyOrdersAsync(int userId, CancellationToken cancellationToken = default);
}
