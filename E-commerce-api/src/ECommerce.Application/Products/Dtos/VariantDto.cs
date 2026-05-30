namespace ECommerce.Application.Products.Dtos;

public class VariantDto
{
    public int Id { get; set; }

    public string? Size { get; set; }

    public string? Color { get; set; }

    public int Stock { get; set; }
}

public class CreateVariantDto
{
    public string? Size { get; set; }

    public string? Color { get; set; }

    public int Stock { get; set; }
}
