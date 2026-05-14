using CellShop.Api.Models;

namespace CellShop.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Products.Any()) return;

        var products = new List<Product>
        {
            new()
            {
                Name = "iPhone 15", Brand = "Apple", Price = 999m,
                ShortDescription = "USB-C, Dynamic Island, kamerë 48 MP.",
                LongDescription = "iPhone 15 vjen me portin USB-C, Dynamic Island dhe kamerë kryesore 48 MP.",
                ImageUrl = "/images/iphone-15.jpg", StockQuantity = 15,
                Screen = "6.1\" OLED", Storage = "128 GB", Camera = "48 MP", Battery = "3349 mAh"
            },
            new()
            {
                Name = "iPhone 16 Plus", Brand = "Apple", Price = 1199m,
                ShortDescription = "Çipi A18, Action Button, kamerë Fusion 48 MP.",
                LongDescription = "iPhone 16 Plus me çipin A18, Action Button të personalizueshëm dhe kamerë Fusion 48 MP.",
                ImageUrl = "/images/iphone-16-plus.jpg", StockQuantity = 10,
                Screen = "6.7\" OLED", Storage = "128 GB", Camera = "48 MP Fusion", Battery = "4674 mAh"
            },
            new()
            {
                Name = "Samsung Galaxy S22", Brand = "Samsung", Price = 549m,
                ShortDescription = "Dynamic AMOLED 2X, 120 Hz, kamerë 50 MP.",
                LongDescription = "Galaxy S22 me ekran 6.1\" Dynamic AMOLED 2X 120Hz, Snapdragon 8 Gen 1 dhe kamerë 50 MP.",
                ImageUrl = "/images/samsung-galaxy-s22.jpg", StockQuantity = 10,
                Screen = "6.1\" AMOLED 120Hz", Storage = "128 GB", Camera = "50 MP Triple", Battery = "3700 mAh"
            },
            new()
            {
                Name = "Samsung Galaxy S23 Ultra", Brand = "Samsung", Price = 1149m,
                ShortDescription = "Kamerë 200 MP, S Pen i integruar, zoom 10x.",
                LongDescription = "Galaxy S23 Ultra me kamerë 200 MP, S Pen të integruar dhe zoom optik 10x.",
                ImageUrl = "/images/samsung-galaxy-s23-ultra.jpg", StockQuantity = 7,
                Screen = "6.8\" AMOLED 120Hz", Storage = "256 GB", Camera = "200 MP + S Pen", Battery = "5000 mAh"
            },
            new()
            {
                Name = "Samsung Galaxy A54", Brand = "Samsung", Price = 349m,
                ShortDescription = "Super AMOLED 120Hz, baterë 5000 mAh, çmim i mirë.",
                LongDescription = "Galaxy A54 me ekran 6.4\" Super AMOLED 120Hz, kamerë 50 MP dhe baterë 5000 mAh.",
                ImageUrl = "/images/samsung-galaxy-a54.jpg", StockQuantity = 20,
                Screen = "6.4\" AMOLED 120Hz", Storage = "128 GB", Camera = "50 MP", Battery = "5000 mAh"
            },
            new()
            {
                Name = "Xiaomi 13", Brand = "Xiaomi", Price = 649m,
                ShortDescription = "Optika Leica, Snapdragon 8 Gen 2, ngarkim 67W.",
                LongDescription = "Xiaomi 13 me kamera Leica, Snapdragon 8 Gen 2 dhe ngarkim të shpejtë 67W.",
                ImageUrl = "/images/xiaomi-13.jpg", StockQuantity = 12,
                Screen = "6.36\" AMOLED 120Hz", Storage = "256 GB", Camera = "54 MP Leica", Battery = "4500 mAh"
            },
            new()
            {
                Name = "Xiaomi 14", Brand = "Xiaomi", Price = 899m,
                ShortDescription = "Leica Summilux, Snapdragon 8 Gen 3, ngarkim 90W.",
                LongDescription = "Xiaomi 14 me optikë Leica Summilux, çipin Snapdragon 8 Gen 3 dhe ngarkim 90W.",
                ImageUrl = "/images/xiaomi-14.jpg", StockQuantity = 8,
                Screen = "6.36\" AMOLED 120Hz", Storage = "256 GB", Camera = "50 MP Leica Summilux", Battery = "4610 mAh"
            },
            new()
            {
                Name = "Huawei P60 Pro", Brand = "Huawei", Price = 799m,
                ShortDescription = "Kamerë Leica variable aperture, dizajn premium.",
                LongDescription = "Huawei P60 Pro me kamerë Leica Variable Aperture, ekran OLED të rrumbullakosur dhe dizajn elegant.",
                ImageUrl = "/images/huawei-p60-pro.jpg", StockQuantity = 6,
                Screen = "6.67\" OLED 120Hz", Storage = "256 GB", Camera = "48 MP Leica Variable", Battery = "4815 mAh"
            },
            new()
            {
                Name = "Redmi Note 13", Brand = "Redmi", Price = 229m,
                ShortDescription = "AMOLED 120Hz, kamerë 108 MP, çmimi më i mirë.",
                LongDescription = "Redmi Note 13 me ekran AMOLED 120Hz, kamerë 108 MP dhe baterë 5000 mAh me ngarkim 33W.",
                ImageUrl = "/images/redmi-note-13.jpg", StockQuantity = 25,
                Screen = "6.67\" AMOLED 120Hz", Storage = "128 GB", Camera = "108 MP", Battery = "5000 mAh"
            },
            new()
            {
                Name = "Redmi 13C", Brand = "Redmi", Price = 149m,
                ShortDescription = "Telefon i lirë me baterë të madhe dhe performancë solide.",
                LongDescription = "Redmi 13C ofron MediaTek Helio G85, baterë 5000 mAh dhe ekran 6.74\" për çmimin më të ulët.",
                ImageUrl = "/images/redmi-13c.jpg", StockQuantity = 30,
                Screen = "6.74\" IPS LCD", Storage = "128 GB", Camera = "50 MP", Battery = "5000 mAh"
            },
        };

        db.Products.AddRange(products);
        db.SaveChanges();
    }
}
