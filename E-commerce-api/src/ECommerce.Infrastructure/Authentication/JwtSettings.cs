namespace ECommerce.Infrastructure.Authentication;

public class JwtSettings
{
    public string Key { get; set; } = string.Empty;

    public string Issuer { get; set; } = "ECommerce.Api";

    public string Audience { get; set; } = "ECommerce.Client";

    public int ExpiryMinutes { get; set; } = 60;
}
