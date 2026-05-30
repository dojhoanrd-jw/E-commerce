using ECommerce.Application.Sellers;
using ECommerce.Application.Sellers.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Seller,Admin")]
public class SellerController : ApiControllerBase
{
    private readonly ISellerService _sellerService;

    public SellerController(ISellerService sellerService)
    {
        _sellerService = sellerService;
    }

    // GET: api/seller/dashboard
    [HttpGet("dashboard")]
    public async Task<ActionResult<SellerDashboardDto>> Dashboard(CancellationToken cancellationToken)
    {
        var dashboard = await _sellerService.GetDashboardAsync(CurrentUserId, cancellationToken);
        return Ok(dashboard);
    }
}
