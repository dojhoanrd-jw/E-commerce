namespace ECommerce.Application.Sellers.Dtos;

public class SellerDashboardDto
{
    public int ProductsCount { get; set; }

    public int UnitsSold { get; set; }

    public decimal Revenue { get; set; }

    public List<MonthlySalesDto> SalesByMonth { get; set; } = new();

    public List<TopProductDto> TopProducts { get; set; } = new();
}

public class MonthlySalesDto
{
    public string Month { get; set; } = null!;

    public decimal Revenue { get; set; }
}

public class TopProductDto
{
    public string Name { get; set; } = null!;

    public int UnitsSold { get; set; }
}
