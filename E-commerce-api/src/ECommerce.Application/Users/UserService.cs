using ECommerce.Application.Common.Exceptions;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Users.Dtos;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Users;

public class UserService : IUserService
{
    private readonly IAppDbContext _context;

    public UserService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .OrderBy(u => u.Id)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            })
            .ToListAsync(cancellationToken);
    }

    public async Task ChangeRoleAsync(int id, UserRole role, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.FindAsync([id], cancellationToken)
            ?? throw new NotFoundException(nameof(User), id);

        user.Role = role;
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, int currentUserId, CancellationToken cancellationToken = default)
    {
        if (id == currentUserId)
        {
            throw new ConflictException("You cannot delete your own account.");
        }

        var user = await _context.Users.FindAsync([id], cancellationToken)
            ?? throw new NotFoundException(nameof(User), id);

        _context.Users.Remove(user);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
