using ECommerce.Application.Orders;
using ECommerce.Application.Orders.Dtos;
using ECommerce.Application.Payments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrderController : ApiControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IPaymentService _paymentService;
    private readonly IInvoiceService _invoiceService;

    public OrderController(
        IOrderService orderService,
        IPaymentService paymentService,
        IInvoiceService invoiceService)
    {
        _orderService = orderService;
        _paymentService = paymentService;
        _invoiceService = invoiceService;
    }

    // POST: api/order  (any authenticated user)
    [HttpPost]
    public async Task<ActionResult<OrderDto>> Create(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var order = await _orderService.CreateAsync(CurrentUserId, request, cancellationToken: cancellationToken);
        return Ok(order);
    }

    // GET: api/order/mine  (the caller's own orders)
    [HttpGet("mine")]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetMine(CancellationToken cancellationToken)
    {
        var orders = await _orderService.GetMyOrdersAsync(CurrentUserId, cancellationToken);
        return Ok(orders);
    }

    // GET: api/order/5  (owner or admin)
    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var order = await _orderService.GetByIdAsync(id, CurrentUserId, IsAdmin, cancellationToken);
        return Ok(order);
    }

    // GET: api/order  (Admin only) — all orders
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetAll(CancellationToken cancellationToken)
    {
        var orders = await _orderService.GetAllAsync(cancellationToken);
        return Ok(orders);
    }

    // PUT: api/order/5/status  (Admin only)
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, UpdateOrderStatusRequest request, CancellationToken cancellationToken)
    {
        await _orderService.ChangeStatusAsync(id, request.Status, cancellationToken);
        return NoContent();
    }

    // POST: api/order/5/return  (owner) — request a return/refund
    [HttpPost("{id:int}/return")]
    public async Task<IActionResult> RequestReturn(int id, RequestReturnRequest request, CancellationToken cancellationToken)
    {
        await _orderService.RequestReturnAsync(id, CurrentUserId, request.Reason, cancellationToken);
        return NoContent();
    }

    // PUT: api/order/5/return  (Admin only) — approve (refund) or reject a return
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/return")]
    public async Task<IActionResult> ResolveReturn(int id, ResolveReturnRequest request, CancellationToken cancellationToken)
    {
        if (request.Approve)
        {
            await _paymentService.RefundAsync(id, cancellationToken);
        }

        await _orderService.ResolveReturnAsync(id, request.Approve, cancellationToken);
        return NoContent();
    }

    // GET: api/order/5/invoice  (owner or admin) — download a PDF invoice
    [HttpGet("{id:int}/invoice")]
    public async Task<IActionResult> GetInvoice(int id, CancellationToken cancellationToken)
    {
        var pdf = await _invoiceService.GenerateAsync(id, CurrentUserId, IsAdmin, cancellationToken);
        return File(pdf, "application/pdf", $"factura-{id:D6}.pdf");
    }
}
