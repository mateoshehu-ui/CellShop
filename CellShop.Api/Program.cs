using CellShop.Api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Database: switchable provider via appsettings ("Sqlite" | "SqlServer") ---
var provider = builder.Configuration.GetValue<string>("DatabaseProvider") ?? "Sqlite";
var connectionString = builder.Configuration.GetConnectionString(provider)
    ?? throw new InvalidOperationException($"Connection string '{provider}' not found.");

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (provider.Equals("SqlServer", StringComparison.OrdinalIgnoreCase))
    {
        options.UseSqlServer(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS — open in dev so you can also serve the frontend separately if you wish
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// --- Auto-create DB and seed on startup ---
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    DbSeeder.Seed(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();   // serves index.html at "/"
app.UseStaticFiles();    // serves wwwroot/*
app.UseCors();
app.UseRouting();
app.MapControllers();

app.Run();
