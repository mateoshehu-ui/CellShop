using CellShop.Api.Data;
using CellShop.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CellShop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProductsController(AppDbContext db) => _db = db;

    /// <summary>
    /// Lists products. Supports optional ?brand= and ?search= filters.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> Get(
        [FromQuery] string? brand,
        [FromQuery] string? search,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice)
    {
        IQueryable<Product> query = _db.Products.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(brand))
            query = query.Where(p => p.Brand == brand);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(p =>
                p.Name.ToLower().Contains(s) ||
                p.Brand.ToLower().Contains(s));
        }

        if (minPrice.HasValue) query = query.Where(p => p.Price >= minPrice.Value);
        if (maxPrice.HasValue) query = query.Where(p => p.Price <= maxPrice.Value);

        var items = await query.OrderBy(p => p.Price).ToListAsync();
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetById(int id)
    {
        var p = await _db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (p == null) return NotFound(new { message = $"Produkti me id={id} nuk u gjet." });
        return Ok(p);
    }

    [HttpGet("brands")]
    public async Task<ActionResult<IEnumerable<string>>> GetBrands()
    {
        var brands = await _db.Products.AsNoTracking()
            .Select(p => p.Brand)
            .Distinct()
            .OrderBy(b => b)
            .ToListAsync();
        return Ok(brands);
    }
}
