namespace ECommerce.Application.Orders.Dtos;

public class ResolveReturnRequest
{
    // true  -> approve the return (refund the buyer)
    // false -> reject the return
    public bool Approve { get; set; }
}
