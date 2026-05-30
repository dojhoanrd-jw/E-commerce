namespace ECommerce.Infrastructure.Authentication;

public class FirebaseSettings
{
    // Service account JSON (file contents) from Firebase Console → Project Settings → Service accounts.
    // Used to initialize the Admin SDK and verify client ID tokens. Empty disables Firebase sign-in.
    public string CredentialsJson { get; set; } = string.Empty;
}
