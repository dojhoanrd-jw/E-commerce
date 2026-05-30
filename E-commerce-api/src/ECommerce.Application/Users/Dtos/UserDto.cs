using ECommerce.Domain.Enums;

namespace ECommerce.Application.Users.Dtos;

public class UserDto
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public UserRole Role { get; set; }
}
