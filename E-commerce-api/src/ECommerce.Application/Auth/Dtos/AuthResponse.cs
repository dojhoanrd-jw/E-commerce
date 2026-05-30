using ECommerce.Domain.Enums;

namespace ECommerce.Application.Auth.Dtos;

public class AuthResponse
{
    public string Token { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public UserRole Role { get; set; }
}
