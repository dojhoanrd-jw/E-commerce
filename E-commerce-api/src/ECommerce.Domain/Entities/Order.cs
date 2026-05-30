namespace ECommerce.Domain.Entities;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public decimal Total { get; set; }

    public string Status { get; set; } = "Pending";

    public string? StripeSessionId { get; set; }

    public List<OrderItem> Items { get; set; } = new();
}
