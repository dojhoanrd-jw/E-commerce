using System;
using System.Collections.Generic;

namespace E_commerce_api.Models;

public partial class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public int Stock { get; set; }

    public decimal Price { get; set; }

    public string? Imageurl { get; set; }
}
