namespace ECommerce.Application.Orders.Dtos;

public class OrderDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string UserName { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public decimal Total { get; set; }

    public string Status { get; set; } = null!;

    public string ReturnStatus { get; set; } = "None";

    public string? ReturnReason { get; set; }

    public List<OrderItemDto> Items { get; set; } = new();
}

public class OrderItemDto
{
    public int ProductId { get; set; }

    public string ProductName { get; set; } = null!;

    public string? VariantLabel { get; set; }

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }
}
