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
                Imageurl = p.Imageurl
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<ProductDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await _context.Products.FindAsync([id], cancellationToken);
        return product is null ? null : MapToDto(product);
    }

    public async Task<ProductDto> CreateAsync(CreateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = new Product
        {
            Name = dto.Name,
            Description = dto.Description,
            Stock = dto.Stock,
            Price = dto.Price,
            Imageurl = dto.Imageurl
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToDto(product);
    }

    public async Task<bool> UpdateAsync(int id, UpdateProductDto dto, CancellationToken cancellationToken = default)
    {
        var product = await _context.Products.FindAsync([id], cancellationToken);
        if (product is null)
        {
            return false;
        }

        product.Name = dto.Name;
        product.Description = dto.Description;
        product.Stock = dto.Stock;
        product.Price = dto.Price;
        product.Imageurl = dto.Imageurl;

        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var product = await _context.Products.FindAsync([id], cancellationToken);
        if (product is null)
        {
            return false;
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ProductDto MapToDto(Product p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        Stock = p.Stock,
        Price = p.Price,
        Imageurl = p.Imageurl
    };
}
