namespace ECommerce.Application.Orders;

public interface IInvoiceService
{
    // Generates a PDF invoice for the order. Throws if the order does not belong to the user (unless admin).
    Task<byte[]> GenerateAsync(int orderId, int userId, bool isAdmin, CancellationToken cancellationToken = default);
}
