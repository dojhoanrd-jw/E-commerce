using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.Orders.Dtos;

public class UpdateOrderStatusRequest
{
    [Required]
    public string Status { get; set; } = null!;
}
