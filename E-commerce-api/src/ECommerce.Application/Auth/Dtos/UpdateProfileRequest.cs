using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.Auth.Dtos;

public class UpdateProfileRequest
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = null!;
}

public class ChangePasswordRequest
{
    [Required]
    public string CurrentPassword { get; set; } = null!;

    [Required]
    [MinLength(6)]
    public string NewPassword { get; set; } = null!;
}
