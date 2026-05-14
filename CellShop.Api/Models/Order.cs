using System.ComponentModel.DataAnnotations;

namespace CellShop.Api.Models;

public class Order
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string CustomerName { get; set; } = string.Empty;

    [Required, MaxLength(160), EmailAddress]
    public string CustomerEmail { get; set; } = string.Empty;

    [MaxLength(30)]
    public string CustomerPhone { get; set; } = string.Empty;

    [Required, MaxLength(300)]
    public string ShippingAddress { get; set; } = string.Empty;

    public decimal TotalAmount { get; set; }

    [MaxLength(30)]
    public string Status { get; set; } = "Pending";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<OrderItem> Items { get; set; } = new();
}
