using System.ComponentModel.DataAnnotations;

namespace ECommerce.Application.Addresses.Dtos;

public class AddressDto
{
    public int Id { get; set; }

    public string? Label { get; set; }

    public string Recipient { get; set; } = null!;

    public string Line1 { get; set; } = null!;

    public string City { get; set; } = null!;

    public string? State { get; set; }

    public string? Zip { get; set; }

    public string Country { get; set; } = null!;

    public string? Phone { get; set; }
}

public class CreateAddressDto
{
    [MaxLength(60)]
    public string? Label { get; set; }

    [Required]
    [MaxLength(255)]
    public string Recipient { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string Line1 { get; set; } = null!;

    [Required]
    [MaxLength(120)]
    public string City { get; set; } = null!;

    [MaxLength(120)]
    public string? State { get; set; }

    [MaxLength(30)]
    public string? Zip { get; set; }

    [Required]
    [MaxLength(80)]
    public string Country { get; set; } = null!;

    [MaxLength(40)]
    public string? Phone { get; set; }
}
