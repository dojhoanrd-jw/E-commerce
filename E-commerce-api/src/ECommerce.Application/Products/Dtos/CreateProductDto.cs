using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.Products.Dtos;

public class CreateProductDto
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    public string? Imageurl { get; set; }

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = null!;
}
