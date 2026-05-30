using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.Orders.Dtos;

public class RequestReturnRequest
{
    [Required]
    [MaxLength(1000)]
    public string Reason { get; set; } = null!;
}
