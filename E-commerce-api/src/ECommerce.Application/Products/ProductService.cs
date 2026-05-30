using ECommerce.Application.Common.Exceptions;
using ECommerce.Application.Common.Interfaces;
using ECommerce.Application.Products.Dtos;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Products;

public class ProductService : IProductService
{
    private readonly IAppDbContext _context;

    public ProductService(IAppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Stock = p.Stock,
                Price = p.Price,
                Imageurl = p.Imageurl,
                Category = p.Category,
                SellerId = p.SellerId
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<ProductDto> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await FindOrThrowAsync(id, cancellationToken);
        return MapToDto(product);
    }

    public async Task<IEnumerable<ProductDto>> GetBySellerAsync(int sellerId, CancellationToken cancellationToken = default)
    {
        return await _context.Products
            .Where(p => p.SellerId == sellerId)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Stock = p.Stock,
                Price = p.Price,
                Imageurl = p.Imageurl,
                Category = p.Category,
                SellerId = p.SellerId
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto, int sellerId, CancellationToken cancellationToken = default)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Stock = dto.Stock,
            Price = dto.Price,
            Imageurl = dto.Imageurl,
            Category = dto.Category,
            SellerId = sellerId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(product);
    }

    public async Task UpdateAsync(int id, UpdateProductDto dto, int userId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var product = await FindOrThrowAsync(id, cancellationToken);
        EnsureCanManage(product, userId, isAdmin);

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Stock = dto.Stock;
        product.Price = dto.Price;
        product.Imageurl = dto.Imageurl;
        product.Category = dto.Category;

        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(int id, int userId, bool isAdmin, CancellationToken cancellationToken = default)
    {
        var product = await FindOrThrowAsync(id, cancellationToken);
        EnsureCanManage(product, userId, isAdmin);

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);
    }

    private async Task<Product> FindOrThrowAsync(int id, CancellationToken cancellationToken)
    {
        var product = await _context.Products.FindAsync([id], cancellationToken);
        return product ?? throw new NotFoundException(nameof(Product), id);
    }

    private static void EnsureCanManage(Product product, int userId, bool isAdmin)
    {
        if (!isAdmin && product.SellerId != userId)
        {
            throw new ForbiddenException("You can only manage your own products.");
        }
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Stock = p.Stock,
        Price = p.Price,
        Imageurl = p.Imageurl,
        Category = p.Category,
        SellerId = p.SellerId
    };
}
