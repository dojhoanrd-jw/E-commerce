using System.Security.Claims;
using ECommerce.Application.Orders;
using ECommerce.Application.Orders.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    // POST: api/order
    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var order = await _orderService.CreateAsync(CurrentUserId, request, cancellationToken);
        return Ok(order);
    }

    // GET: api/order/mine
    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetMine(CancellationToken cancellationToken)
    {
        var orders = await _orderService.GetMyOrdersAsync(CurrentUserId, cancellationToken);
        return Ok(orders);
    }

    private int CurrentUserId =>
        int.Parse(
            User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub")
            ?? throw new InvalidOperationException("Missing user id claim."));
}
