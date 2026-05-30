namespace ECommerce.Application.Common.Interfaces;

public interface IGoogleTokenValidator
{
    Task<GoogleUserInfo?> ValidateAsync(string credential, CancellationToken cancellationToken = default);
}

public record GoogleUserInfo(string Email, string? Name);
