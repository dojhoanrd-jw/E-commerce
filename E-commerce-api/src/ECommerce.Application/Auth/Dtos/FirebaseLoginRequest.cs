using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.Auth.Dtos;

public class FirebaseLoginRequest
{
    // The Firebase ID token (JWT) obtained on the client after signing in with a provider.
    [Required]
    public string IdToken { get; set; } = null!;
}
