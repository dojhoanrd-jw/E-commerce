using ECommerce.Application.Products.Dtos;

namespace ECommerce.Application.Products;

public interface IProductService
{
    Task<IEnumerable<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task<ProductDto> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<IEnumerable<ProductDto>> GetBySellerAsync(int sellerId, CancellationToken cancellationToken = default);

    Task<ProductDto> CreateAsync(CreateProductDto dto, int sellerId, CancellationToken cancellationToken = default);

    Task UpdateAsync(int id, UpdateProductDto dto, int userId, bool isAdmin, CancellationToken cancellationToken = default);

    Task DeleteAsync(int id, int userId, bool isAdmin, CancellationToken cancellationToken = default);
}
