using ECommerce.Application.Orders.Dtos;

namespace ECommerce.Application.Payments;

public interface IPaymentService
{
    Task<string> CreateCheckoutSessionAsync(int userId, CreateOrderRequest request, CancellationToken cancellationToken = default);

    Task<OrderDto> ConfirmAsync(string sessionId, CancellationToken cancellationToken = default);
}
