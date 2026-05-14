using CellShop.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CellShop.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Product>(e =>
        {
            e.Property(p => p.Price).HasColumnType("decimal(10,2)");
            e.HasIndex(p => p.Brand);
        });

        b.Entity<Order>(e =>
        {
            e.Property(o => o.TotalAmount).HasColumnType("decimal(12,2)");
            e.HasMany(o => o.Items)
             .WithOne(i => i.Order!)
             .HasForeignKey(i => i.OrderId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        b.Entity<OrderItem>(e =>
        {
            e.Property(i => i.UnitPrice).HasColumnType("decimal(10,2)");
            e.Ignore(i => i.Subtotal);
            e.HasOne(i => i.Product)
             .WithMany()
             .HasForeignKey(i => i.ProductId)
             .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
