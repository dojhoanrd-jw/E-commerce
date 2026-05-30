using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.Reviews.Dtos;

public class CreateReviewDto
{
    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(1000)]
    public string? Comment { get; set; }
}
