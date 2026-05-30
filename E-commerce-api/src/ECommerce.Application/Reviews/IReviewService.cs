using ECommerce.Application.Reviews.Dtos;

namespace ECommerce.Application.Reviews;

public interface IReviewService
{
    Task<IEnumerable<ReviewDto>> GetByProductAsync(int productId, CancellationToken cancellationToken = default);

    Task<ReviewDto> CreateAsync(int productId, int userId, CreateReviewDto dto, CancellationToken cancellationToken = default);
}
