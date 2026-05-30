using ECommerce.Domain.Enums;

namespace ECommerce.Domain.Entities;

public class User
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    // Null for accounts created through an external provider (e.g. Google sign-in).
    public string? PasswordHash { get; set; }

    public UserRole Role { get; set; }
}
