using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Sellers.Dtos;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Sellers;

public class SellerService : ISellerService
{
    private readonly IAppDbContext _context;

    public SellerService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<SellerDashboardDto> GetDashboardAsync(int sellerId, CancellationToken cancellationToken = default)
    {
        var productsCount = await _context.Products.CountAsync(p => p.SellerId == sellerId, cancellationToken);

        var items = await (
            from oi in _context.OrderItems
            join p in _context.Products on oi.ProductId equals p.Id
            join o in _context.Orders on oi.OrderId equals o.Id
            where p.SellerId == sellerId
            select new
            {
                oi.Quantity,
                oi.UnitPrice,
                oi.ProductName,
                o.CreatedAt
            }
        ).ToListAsync(cancellationToken);

        var salesByMonth = items
            .GroupBy(i => i.CreatedAt.ToString("yyyy-MM"))
            .OrderBy(g => g.Key)
            .Select(g => new MonthlySalesDto
            {
                Month = g.Key,
                Revenue = g.Sum(x => x.UnitPrice * x.Quantity)
            })
            .ToList();

        var topProducts = items
            .GroupBy(i => i.ProductName)
            .Select(g => new TopProductDto
            {
                Name = g.Key,
                UnitsSold = g.Sum(x => x.Quantity)
            })
            .OrderByDescending(t => t.UnitsSold)
            .Take(5)
            .ToList();

        return new SellerDashboardDto
        {
            ProductsCount = productsCount,
            UnitsSold = items.Sum(i => i.Quantity),
            Revenue = items.Sum(i => i.UnitPrice * i.Quantity),
            SalesByMonth = salesByMonth,
            TopProducts = topProducts
        };
    }
}
