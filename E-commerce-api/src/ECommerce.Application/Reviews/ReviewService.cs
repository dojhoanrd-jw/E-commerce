using ECommerce.Application.Common.Exceptions;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Reviews.Dtos;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Reviews;

public class ReviewService : IReviewService
{
    private readonly IAppDbContext _context;

    public ReviewService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ReviewDto>> GetByProductAsync(int productId, CancellationToken cancellationToken = default)
    {
        return await _context.Reviews
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                UserName = r.UserName,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<ReviewDto> CreateAsync(int productId, int userId, CreateReviewDto dto, CancellationToken cancellationToken = default)
    {
        var productExists = await _context.Products.AnyAsync(p => p.Id == productId, cancellationToken);
        if (!productExists)
        {
            throw new NotFoundException("Product", productId);
        }

        // One review per (product, user): update if it already exists.
        var review = await _context.Reviews
            .FirstOrDefaultAsync(r => r.ProductId == productId && r.UserId == userId, cancellationToken);

        if (review is null)
        {
            var userName = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => u.Name)
                .FirstOrDefaultAsync(cancellationToken) ?? "Usuario";

            review = new Review
            {
                ProductId = productId,
                UserId = userId,
                UserName = userName,
                Rating = dto.Rating,
                Comment = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };
            _context.Reviews.Add(review);
        }
        else
        {
            review.Rating = dto.Rating;
            review.Comment = dto.Comment;
            review.CreatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new ReviewDto
        {
            Id = review.Id,
            UserName = review.UserName,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt
        };
    }
}
