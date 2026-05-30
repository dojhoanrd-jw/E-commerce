using ECommerce.Application.Reviews;
using ECommerce.Application.Reviews.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ApiControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    // GET: api/review/product/5  (public)
    [HttpGet("product/{productId:int}")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetByProduct(int productId, CancellationToken cancellationToken)
    {
        var reviews = await _reviewService.GetByProductAsync(productId, cancellationToken);
        return Ok(reviews);
    }

    // POST: api/review/product/5  (authenticated)
    [Authorize]
    [HttpPost("product/{productId:int}")]
    public async Task<ActionResult<ReviewDto>> Create(int productId, CreateReviewDto dto, CancellationToken cancellationToken)
    {
        var review = await _reviewService.CreateAsync(productId, CurrentUserId, dto, cancellationToken);
        return Ok(review);
    }
}
