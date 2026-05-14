using CellShop.Api.Data;
using CellShop.Api.Dtos;
using CellShop.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CellShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<OrdersController> _log;

    public OrdersController(AppDbContext db, ILogger<OrdersController> log)
    {
        _db = db;
        _log = log;
    }

    /// <summary>
    /// Creates an order from the cart. Validates stock & recomputes totals server-side
    /// (NEVER trust prices coming from the client).
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<OrderResponse>> Create([FromBody] CreateOrderRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        // Deduplicate productIds in request (defensive — client could send the same id twice)
        var consolidated = req.Items
            .GroupBy(i => i.ProductId)
            .Select(g => new { ProductId = g.Key, Quantity = g.Sum(x => x.Quantity) })
            .ToList();

        var productIds = consolidated.Select(c => c.ProductId).ToList();
        var products = await _db.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync();

        if (products.Count != productIds.Count)
            return BadRequest(new { message = "Një ose më shumë produkte nuk ekzistojnë." });

        // Stock validation
        foreach (var item in consolidated)
        {
            var p = products.First(x => x.Id == item.ProductId);
            if (p.StockQuantity < item.Quantity)
                return BadRequest(new
                {
                    message = $"Stoku i pamjaftueshëm për '{p.Name}'. " +
                              $"Disponibël: {p.StockQuantity}, kërkuar: {item.Quantity}."
                });
        }

        var order = new Order
        {
            CustomerName = req.CustomerName.Trim(),
            CustomerEmail = req.CustomerEmail.Trim(),
            CustomerPhone = req.CustomerPhone?.Trim() ?? string.Empty,
            ShippingAddress = req.ShippingAddress.Trim(),
            Status = "Pending"
        };

        decimal total = 0m;
        foreach (var item in consolidated)
        {
            var p = products.First(x => x.Id == item.ProductId);
            order.Items.Add(new OrderItem
            {
                ProductId = p.Id,
                ProductName = p.Name,
                UnitPrice = p.Price,   // snapshot from DB, ignore client price
                Quantity = item.Quantity
            });
            total += p.Price * item.Quantity;
            p.StockQuantity -= item.Quantity;
        }
        order.TotalAmount = total;

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        _log.LogInformation("Order {OrderId} created for {Email}, total {Total}",
            order.Id, order.CustomerEmail, order.TotalAmount);

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, ToResponse(order));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderResponse>> GetById(int id)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound();
        return Ok(ToResponse(order));
    }

    private static OrderResponse ToResponse(Order o) => new()
    {
        Id = o.Id,
        CustomerName = o.CustomerName,
        CustomerEmail = o.CustomerEmail,
        TotalAmount = o.TotalAmount,
        Status = o.Status,
        CreatedAt = o.CreatedAt,
        Items = o.Items.Select(i => new OrderItemResponse
        {
            ProductId = i.ProductId,
            ProductName = i.ProductName,
            UnitPrice = i.UnitPrice,
            Quantity = i.Quantity,
            Subtotal = i.UnitPrice * i.Quantity
        }).ToList()
    };
}
