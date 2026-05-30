using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Product> Products { get; }

    DbSet<ProductVariant> ProductVariants { get; }

    DbSet<User> Users { get; }

    DbSet<Order> Orders { get; }

    DbSet<OrderItem> OrderItems { get; }

    DbSet<Review> Reviews { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
