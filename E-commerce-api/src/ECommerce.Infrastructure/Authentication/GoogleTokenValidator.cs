using ECommerce.Application.Common.Interfaces;
using Google.Apis.Auth;

namespace ECommerce.Infrastructure.Authentication;

public class GoogleTokenValidator : IGoogleTokenValidator
{
    private readonly GoogleSettings _settings;

    public GoogleTokenValidator(GoogleSettings settings)
    {
        _settings = settings;
    }

    public async Task<GoogleUserInfo?> ValidateAsync(string credential, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_settings.ClientId))
        {
            // Google sign-in is not configured on this environment.
            return null;
        }

        try
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _settings.ClientId }
            };

            var payload = await GoogleJsonWebSignature.ValidateAsync(credential, settings);

            if (payload is null || string.IsNullOrWhiteSpace(payload.Email) || payload.EmailVerified != true)
            {
                return null;
            }

            return new GoogleUserInfo(payload.Email, payload.Name);
        }
        catch (InvalidJwtException)
        {
            return null;
        }
    }
}
