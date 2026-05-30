using ECommerce.Application.Addresses;
using ECommerce.Application.Addresses.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AddressController : ApiControllerBase
{
    private readonly IAddressService _addressService;

    public AddressController(IAddressService addressService)
    {
        _addressService = addressService;
    }

    // GET: api/address
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AddressDto>>> GetMine(CancellationToken cancellationToken)
    {
        var addresses = await _addressService.GetMineAsync(CurrentUserId, cancellationToken);
        return Ok(addresses);
    }

    // POST: api/address
    [HttpPost]
    public async Task<ActionResult<AddressDto>> Create(CreateAddressDto dto, CancellationToken cancellationToken)
    {
        var address = await _addressService.CreateAsync(CurrentUserId, dto, cancellationToken);
        return Ok(address);
    }

    // PUT: api/address/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, CreateAddressDto dto, CancellationToken cancellationToken)
    {
        await _addressService.UpdateAsync(CurrentUserId, id, dto, cancellationToken);
        return NoContent();
    }

    // DELETE: api/address/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        await _addressService.DeleteAsync(CurrentUserId, id, cancellationToken);
        return NoContent();
    }
}
