using ECommerce.Application.Orders.Dtos;
using ECommerce.Application.Payments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ApiControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    public class CheckoutResponse
    {
        public string Url { get; set; } = null!;
    }

    public class ConfirmRequest
    {
        public string SessionId { get; set; } = null!;
    }

    // POST: api/payment/checkout  -> returns the Stripe Checkout URL
    [HttpPost("checkout")]
    public async Task<ActionResult<CheckoutResponse>> Checkout(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var url = await _paymentService.CreateCheckoutSessionAsync(CurrentUserId, request, cancellationToken);
        return Ok(new CheckoutResponse { Url = url });
    }

    // POST: api/payment/confirm  -> verifies payment and creates the order
    [HttpPost("confirm")]
    public async Task<ActionResult<OrderDto>> Confirm(ConfirmRequest request, CancellationToken cancellationToken)
    {
        var order = await _paymentService.ConfirmAsync(request.SessionId, cancellationToken);
        return Ok(order);
    }
}
