namespace ECommerce.Application.Common.Interfaces;

public interface IFirebaseTokenValidator
{
    Task<FirebaseUserInfo?> ValidateAsync(string idToken, CancellationToken cancellationToken = default);
}

public record FirebaseUserInfo(string Email, string? Name);
