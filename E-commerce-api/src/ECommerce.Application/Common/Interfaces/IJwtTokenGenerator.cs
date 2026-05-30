using ECommerce.Domain.Entities;

namespace ECommerce.Application.Common.Interfaces;

public interface IJwtTokenGenerator
{
    string GenerateToken(User user);
}
