using ECommerce.Application.Sellers.Dtos;

namespace ECommerce.Application.Sellers;

public interface ISellerService
{
    Task<SellerDashboardDto> GetDashboardAsync(int sellerId, CancellationToken cancellationToken = default);
}
