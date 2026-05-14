using System.ComponentModel.DataAnnotations;

namespace CellShop.Api.Dtos;

public class CreateOrderRequest
{
    [Required, StringLength(120, MinimumLength = 2)]
    public string CustomerName { get; set; } = string.Empty;

    [Required, EmailAddress, StringLength(160)]
    public string CustomerEmail { get; set; } = string.Empty;

    [StringLength(30)]
    public string CustomerPhone { get; set; } = string.Empty;

    [Required, StringLength(300, MinimumLength = 5)]
    public string ShippingAddress { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public List<OrderItemRequest> Items { get; set; } = new();
}

public class OrderItemRequest
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Range(1, 100)]
    public int Quantity { get; set; }
}

public class OrderResponse
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public List<OrderItemResponse> Items { get; set; } = new();
}

public class OrderItemResponse
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public decimal Subtotal { get; set; }
}
