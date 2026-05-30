namespace ECommerce.Application.Products.Dtos;

public class ProductSuggestionDto
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Imageurl { get; set; }

    public string Category { get; set; } = null!;

    public decimal Price { get; set; }

    public decimal? SalePrice { get; set; }
}
