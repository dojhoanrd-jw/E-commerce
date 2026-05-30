namespace ECommerce.Infrastructure.Authentication;

public class GoogleSettings
{
    // OAuth 2.0 Web Client ID from Google Cloud Console; used as the expected token audience.
    public string ClientId { get; set; } = string.Empty;
}
