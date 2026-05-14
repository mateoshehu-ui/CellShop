using System.ComponentModel.DataAnnotations;

namespace CellShop.Api.Models;

public class Product
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(60)]
    public string Brand { get; set; } = string.Empty;

    [Range(0, 100000)]
    public decimal Price { get; set; }

    [MaxLength(400)]
    public string ShortDescription { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string LongDescription { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public int StockQuantity { get; set; }

    // Spec fields kept simple/flat for a learning project
    [MaxLength(50)] public string Screen { get; set; } = string.Empty;
    [MaxLength(50)] public string Storage { get; set; } = string.Empty;
    [MaxLength(50)] public string Camera { get; set; } = string.Empty;
    [MaxLength(50)] public string Battery { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
