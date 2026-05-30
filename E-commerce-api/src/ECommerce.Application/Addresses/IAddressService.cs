using ECommerce.Application.Addresses.Dtos;

namespace ECommerce.Application.Addresses;

public interface IAddressService
{
    Task<IEnumerable<AddressDto>> GetMineAsync(int userId, CancellationToken cancellationToken = default);

    Task<AddressDto> CreateAsync(int userId, CreateAddressDto dto, CancellationToken cancellationToken = default);

    Task UpdateAsync(int userId, int id, CreateAddressDto dto, CancellationToken cancellationToken = default);

    Task DeleteAsync(int userId, int id, CancellationToken cancellationToken = default);
}
