using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.Orders.Dtos;

public class CreateOrderRequest
{
    [Required]
    [MinLength(1, ErrorMessage = "The order must contain at least one item.")]
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class CreateOrderItemDto
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}
