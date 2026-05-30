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

    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();

    public DbSet<User> Users => Set<User>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    public DbSet<Review> Reviews => Set<Review>();

    public DbSet<Address> Addresses => Set<Address>();

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
            entity.Property(e => e.SalePrice).HasPrecision(10, 2).HasColumnName("sale_price");
            entity.Property(e => e.Imageurl).HasColumnName("imageurl");
            entity.Property(e => e.Images).HasColumnName("images");
            entity.Property(e => e.Category).HasMaxLength(50).HasColumnName("category");
            entity.Property(e => e.SellerId).HasColumnName("seller_id");

            entity.HasMany(e => e.Variants)
                .WithOne()
                .HasForeignKey(v => v.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProductVariant>(entity =>
        {
            entity.ToTable("product_variants");
            entity.HasKey(e => e.Id).HasName("product_variants_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.Size).HasMaxLength(50).HasColumnName("size");
            entity.Property(e => e.Color).HasMaxLength(50).HasColumnName("color");
            entity.Property(e => e.Stock).HasColumnName("stock");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(e => e.Id).HasName("users_pkey");
            entity.HasIndex(e => e.Email).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasMaxLength(255).HasColumnName("name");
            entity.Property(e => e.Email).HasMaxLength(255).HasColumnName("email");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.Role)
                .HasConversion<string>()
                .HasMaxLength(20)
                .HasColumnName("role");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("orders");
            entity.HasKey(e => e.Id).HasName("orders_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.Total).HasPrecision(10, 2).HasColumnName("total");
            entity.Property(e => e.Status).HasMaxLength(20).HasColumnName("status");
            entity.Property(e => e.StripeSessionId).HasMaxLength(255).HasColumnName("stripe_session_id");
            entity.Property(e => e.ReturnStatus).HasMaxLength(20).HasColumnName("return_status");
            entity.Property(e => e.ReturnReason).HasColumnName("return_reason");
            entity.Property(e => e.ReturnRequestedAt).HasColumnName("return_requested_at");

            entity.HasMany(e => e.Items)
                .WithOne()
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.ToTable("order_items");
            entity.HasKey(e => e.Id).HasName("order_items_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.ProductName).HasMaxLength(255).HasColumnName("product_name");
            entity.Property(e => e.UnitPrice).HasPrecision(10, 2).HasColumnName("unit_price");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.VariantId).HasColumnName("variant_id");
            entity.Property(e => e.VariantLabel).HasMaxLength(120).HasColumnName("variant_label");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.ToTable("reviews");
            entity.HasKey(e => e.Id).HasName("reviews_pkey");
            entity.HasIndex(e => new { e.ProductId, e.UserId }).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ProductId).HasColumnName("product_id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.UserName).HasMaxLength(255).HasColumnName("user_name");
            entity.Property(e => e.Rating).HasColumnName("rating");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Address>(entity =>
        {
            entity.ToTable("addresses");
            entity.HasKey(e => e.Id).HasName("addresses_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.Label).HasMaxLength(60).HasColumnName("label");
            entity.Property(e => e.Recipient).HasMaxLength(255).HasColumnName("recipient");
            entity.Property(e => e.Line1).HasMaxLength(255).HasColumnName("line1");
            entity.Property(e => e.City).HasMaxLength(120).HasColumnName("city");
            entity.Property(e => e.State).HasMaxLength(120).HasColumnName("state");
            entity.Property(e => e.Zip).HasMaxLength(30).HasColumnName("zip");
            entity.Property(e => e.Country).HasMaxLength(80).HasColumnName("country");
            entity.Property(e => e.Phone).HasMaxLength(40).HasColumnName("phone");
        });

        base.OnModelCreating(modelBuilder);
    }
}
