using System.Text;
using ECommerce.Application.Common.Interfaces;
using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

namespace ECommerce.Infrastructure.Authentication;

public class FirebaseTokenValidator : IFirebaseTokenValidator
{
    private readonly FirebaseApp? _app;

    public FirebaseTokenValidator(FirebaseSettings settings)
    {
        if (string.IsNullOrWhiteSpace(settings.CredentialsJson))
        {
            // Firebase sign-in is not configured on this environment.
            return;
        }

        // FirebaseApp is process-wide; reuse the default instance if it already exists.
        using var credentialsStream = new MemoryStream(Encoding.UTF8.GetBytes(settings.CredentialsJson));
        _app = FirebaseApp.DefaultInstance ?? FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.FromStream(credentialsStream)
        });
    }

    public async Task<FirebaseUserInfo?> ValidateAsync(string idToken, CancellationToken cancellationToken = default)
    {
        if (_app is null)
        {
            return null;
        }

        try
        {
            var token = await FirebaseAuth.GetAuth(_app).VerifyIdTokenAsync(idToken, cancellationToken);

            if (!token.Claims.TryGetValue("email", out var emailClaim) || emailClaim is not string email
                || string.IsNullOrWhiteSpace(email))
            {
                return null;
            }

            if (token.Claims.TryGetValue("email_verified", out var verified) && verified is bool { } isVerified
                && !isVerified)
            {
                return null;
            }

            var name = token.Claims.TryGetValue("name", out var nameClaim) ? nameClaim as string : null;

            return new FirebaseUserInfo(email, name);
        }
        catch (FirebaseAuthException)
        {
            return null;
        }
    }
}
