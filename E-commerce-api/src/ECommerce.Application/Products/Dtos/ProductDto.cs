namespace ECommerce.Application.Products.Dtos;

public class ProductDto
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int Stock { get; set; }

    public decimal Price { get; set; }

    public decimal? SalePrice { get; set; }

    public string? Imageurl { get; set; }

    public List<string> Images { get; set; } = new();

    public string Category { get; set; } = null!;

    public int? SellerId { get; set; }

    public double AverageRating { get; set; }

    public int ReviewCount { get; set; }

    public int SalesCount { get; set; }

    public List<VariantDto> Variants { get; set; } = new();
}
