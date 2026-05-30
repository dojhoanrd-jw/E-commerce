namespace ECommerce.Domain.Entities;

public class Address
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? Label { get; set; }

    public string Recipient { get; set; } = null!;

    public string Line1 { get; set; } = null!;

    public string City { get; set; } = null!;

    public string? State { get; set; }

    public string? Zip { get; set; }

    public string Country { get; set; } = null!;

    public string? Phone { get; set; }
}
