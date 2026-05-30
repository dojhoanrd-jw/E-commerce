namespace ECommerce.Infrastructure.Payments;

public class StripeSettings
{
    public string SecretKey { get; set; } = string.Empty;

    public string Currency { get; set; } = "usd";

    public string SuccessUrl { get; set; } = "http://localhost:4200/checkout/success";

    public string CancelUrl { get; set; } = "http://localhost:4200/cart";
}
