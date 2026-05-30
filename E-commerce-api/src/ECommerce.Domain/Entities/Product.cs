namespace ECommerce.Domain.Entities;

public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int Stock { get; set; }

    public decimal Price { get; set; }

    public decimal? SalePrice { get; set; }

    public string? Imageurl { get; set; }

    public List<string> Images { get; set; } = new();

    public string Category { get; set; } = "Otros";

    public int? SellerId { get; set; }

    public List<ProductVariant> Variants { get; set; } = new();
}
