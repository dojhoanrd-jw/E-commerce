using System.ComponentModel.DataAnnotations;
using ECommerce.Domain.Enums;

namespace ECommerce.Application.Users.Dtos;

public class ChangeRoleRequest
{
    [Required]
    public UserRole Role { get; set; }
}
