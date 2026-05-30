using ECommerce.Application.Orders;
using ECommerce.Application.Orders.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ApiControllerBase
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    // POST: api/order  (any authenticated user)
    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var order = await _orderService.CreateAsync(CurrentUserId, request, cancellationToken);
        return Ok(order);
    }

    // GET: api/order/mine  (the caller's own orders)
    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetMine(CancellationToken cancellationToken)
    {
        var orders = await _orderService.GetMyOrdersAsync(CurrentUserId, cancellationToken);
        return Ok(orders);
    }

    // GET: api/order  (Admin only) — all orders
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll(CancellationToken cancellationToken)
    {
        var orders = await _orderService.GetAllAsync(cancellationToken);
        return Ok(orders);
    }
}
