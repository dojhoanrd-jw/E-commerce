using ECommerce.Application.Common.Interfaces;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Persistence;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.ToTable("product");
            entity.HasKey(e => e.Id).HasName("product_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(255).HasColumnName("name");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Stock).HasDefaultValue(0).HasColumnName("stock");
            entity.Property(e => e.Price).HasPrecision(10, 2).HasColumnName("price");
            entity.Property(e => e.Imageurl).HasColumnName("imageurl");
        });

        base.OnModelCreating(modelBuilder);
    }
}
