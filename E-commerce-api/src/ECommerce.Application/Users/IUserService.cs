using ECommerce.Application.Users.Dtos;
using ECommerce.Domain.Enums;

namespace ECommerce.Application.Users;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync(CancellationToken cancellationToken = default);

    Task ChangeRoleAsync(int id, UserRole role, CancellationToken cancellationToken = default);

    Task DeleteAsync(int id, int currentUserId, CancellationToken cancellationToken = default);
}
