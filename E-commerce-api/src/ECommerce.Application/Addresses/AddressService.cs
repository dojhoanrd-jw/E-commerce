using ECommerce.Application.Addresses.Dtos;
using ECommerce.Application.Common.Exceptions;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Addresses;

public class AddressService : IAddressService
{
    private readonly IAppDbContext _context;

    public AddressService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<AddressDto>> GetMineAsync(int userId, CancellationToken cancellationToken = default)
    {
        var addresses = await _context.Addresses
            .Where(a => a.UserId == userId)
            .OrderBy(a => a.Id)
            .ToListAsync(cancellationToken);

        return addresses.Select(MapToDto).ToList();
    }

    public async Task<AddressDto> CreateAsync(int userId, CreateAddressDto dto, CancellationToken cancellationToken = default)
    {
        var address = new Address
        {
            UserId = userId,
            Label = dto.Label,
            Recipient = dto.Recipient,
            Line1 = dto.Line1,
            City = dto.City,
            State = dto.State,
            Zip = dto.Zip,
            Country = dto.Country,
            Phone = dto.Phone
        };

        _context.Addresses.Add(address);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(address);
    }

    public async Task UpdateAsync(int userId, int id, CreateAddressDto dto, CancellationToken cancellationToken = default)
    {
        var address = await FindOwnedAsync(userId, id, cancellationToken);

        address.Label = dto.Label;
        address.Recipient = dto.Recipient;
        address.Line1 = dto.Line1;
        address.City = dto.City;
        address.State = dto.State;
        address.Zip = dto.Zip;
        address.Country = dto.Country;
        address.Phone = dto.Phone;

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int userId, int id, CancellationToken cancellationToken = default)
    {
        var address = await FindOwnedAsync(userId, id, cancellationToken);
        _context.Addresses.Remove(address);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<Address> FindOwnedAsync(int userId, int id, CancellationToken cancellationToken)
    {
        return await _context.Addresses.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId, cancellationToken)
            ?? throw new NotFoundException(nameof(Address), id);
    }

    private static AddressDto MapToDto(Address a) => new()
    {
        Id = a.Id,
        Label = a.Label,
        Recipient = a.Recipient,
        Line1 = a.Line1,
        City = a.City,
        State = a.State,
        Zip = a.Zip,
        Country = a.Country,
        Phone = a.Phone
    };
}
