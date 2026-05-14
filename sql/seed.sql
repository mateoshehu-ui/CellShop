-- ============================================================
-- CellShop — Seed data (SQL Server / T-SQL)
-- Run this AFTER schema.sql if you want to populate manually.
-- (The EF Core seeder does the equivalent automatically on startup.)
-- ============================================================

USE CellShop;
GO

INSERT INTO dbo.Products (Name, Brand, Price, ShortDescription, LongDescription, ImageUrl, StockQuantity, Screen, Storage, Camera, Battery) VALUES
('iPhone 13',              'Apple',   549.00, N'Ekran Super Retina XDR, çip A15 Bionic, kamerë me cilësi profesionale.', N'iPhone 13 sjell një ekran Super Retina XDR 6.1 inç, çipin e fuqishëm A15 Bionic, sistem me dy kamera dhe autonomi të zgjatur baterie.', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=800&q=80', 12, '6.1" OLED',           '128 GB', '12 MP Dual',     '3240 mAh'),
('iPhone 14 Pro',          'Apple',   899.00, N'Dynamic Island, Always-On display, kamerë 48 MP.',                       N'iPhone 14 Pro me Dynamic Island, ekran Always-On, kamerë 48 MP dhe çipin A16 Bionic.',                                                  'https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=800&q=80', 8,  '6.1" OLED ProMotion', '256 GB', '48 MP Pro',      '3200 mAh'),
('iPhone 15',              'Apple',   999.00, N'USB-C, Dynamic Island për të gjithë, kamerë 48 MP.',                      N'iPhone 15 vjen me portin USB-C, Dynamic Island për të gjithë modelet, kamerë kryesore 48 MP.',                                          'https://images.unsplash.com/photo-1696446702183-cbd13a4d6e7f?w=800&q=80', 15, '6.1" OLED',           '128 GB', '48 MP',          '3349 mAh'),
('iPhone 15 Pro Max',      'Apple',  1399.00, N'Titan, çipi A17 Pro, zoom 5x optik.',                                    N'iPhone 15 Pro Max — trupi prej titani, çipi A17 Pro me arkitekturë 3nm, zoom optik 5x.',                                              'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', 5,  '6.7" OLED ProMotion', '256 GB', '48 MP + 5x zoom','4422 mAh'),
('Samsung Galaxy S22',     'Samsung', 599.00, N'Ekran Dynamic AMOLED 2X, 120 Hz, kamerë 50 MP.',                          N'Galaxy S22 me ekran 6.1 inç Dynamic AMOLED 2X 120 Hz, Snapdragon 8 Gen 1, kamerë 50 MP.',                                              'https://images.unsplash.com/photo-1610792516775-01de03eae630?w=800&q=80', 10, '6.1" AMOLED 120Hz',   '128 GB', '50 MP Triple',   '3700 mAh'),
('Samsung Galaxy S23 Ultra','Samsung',1199.00, N'Kamerë 200 MP, S Pen i integruar, zoom 10x.',                            N'Galaxy S23 Ultra — kamerë kryesore 200 MP, S Pen i integruar, zoom 10x optik.',                                                         'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80', 7,  '6.8" AMOLED 120Hz',   '256 GB', '200 MP + S Pen', '5000 mAh'),
('Samsung Galaxy A54',     'Samsung', 379.00, N'Mid-range me ekran Super AMOLED dhe baterë e madhe.',                     N'Galaxy A54 ofron ekran 6.4 inç Super AMOLED 120 Hz, kamerë 50 MP dhe baterë 5000 mAh.',                                                'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800&q=80', 20, '6.4" AMOLED 120Hz',   '128 GB', '50 MP',          '5000 mAh'),
('Xiaomi 13 Pro',          'Xiaomi',  749.00, N'Optika Leica, Snapdragon 8 Gen 2, ngarkim 120W.',                         N'Xiaomi 13 Pro me kamera Leica, sensor 1 inç, Snapdragon 8 Gen 2 dhe ngarkim me kabllo 120W.',                                          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', 9,  '6.73" AMOLED 120Hz',  '256 GB', '50 MP Leica',    '4820 mAh');
GO

-- Verify
SELECT COUNT(*) AS ProductCount FROM dbo.Products;
GO

-- iPhone 16 Plus (added)
INSERT INTO dbo.Products (Name, Brand, Price, ShortDescription, LongDescription, ImageUrl, StockQuantity, Screen, Storage, Camera, Battery) VALUES
('iPhone 16 Plus', 'Apple', 1199.00, N'Çipi A18, Action Button, kamerë Fusion 48 MP, baterë rekord.', N'iPhone 16 Plus — çipi A18, butoni i ri Action Button i personalizueshëm, kamerë Fusion 48 MP me mundësi filmimi 4K/120fps dhe bateria me jetëgjatësinë më të lartë ndonjëherë.', '/assets/images/iphone-16-plus.jpg', 10, '6.7" OLED 60Hz', '128 GB', '48 MP Fusion', '4674 mAh');
GO
