namespace CellShop.Api.Models;

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }

    public string ProductName { get; set; } = string.Empty; // snapshot
    public decimal UnitPrice { get; set; }                  // snapshot at purchase time
    public int Quantity { get; set; }

    public decimal Subtotal => UnitPrice * Quantity;
}
