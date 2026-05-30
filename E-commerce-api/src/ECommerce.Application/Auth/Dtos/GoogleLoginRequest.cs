using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.Auth.Dtos;

public class GoogleLoginRequest
{
    // The ID token (JWT credential) returned by Google Identity Services on the client.
    [Required]
    public string Credential { get; set; } = null!;
}
