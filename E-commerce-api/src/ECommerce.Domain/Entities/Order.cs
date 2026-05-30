namespace ECommerce.Domain.Entities;

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public DateTime CreatedAt { get; set; }

    public decimal Total { get; set; }

    public string Status { get; set; } = "Pending";

    public string? StripeSessionId { get; set; }

    // Return / refund workflow: None | Requested | Refunded | Rejected
    public string ReturnStatus { get; set; } = "None";

    public string? ReturnReason { get; set; }

    public DateTime? ReturnRequestedAt { get; set; }

    public List<OrderItem> Items { get; set; } = new();
}
