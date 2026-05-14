-- ============================================================
-- CellShop — Schema script (SQL Server / T-SQL)
-- ------------------------------------------------------------
-- This script is provided as a manual alternative to the
-- EF Core auto-creation (EnsureCreated). The running app
-- creates the same schema automatically, so this file is
-- mainly for SQL inspection, reuse, or full SQL Server setup.
-- ============================================================

IF DB_ID('CellShop') IS NULL
    CREATE DATABASE CellShop;
GO

USE CellShop;
GO

-- Drop in dependency order (only if exists)
IF OBJECT_ID('dbo.OrderItems', 'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID('dbo.Orders',     'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID('dbo.Products',   'U') IS NOT NULL DROP TABLE dbo.Products;
GO

CREATE TABLE dbo.Products (
    Id               INT IDENTITY(1,1) PRIMARY KEY,
    Name             NVARCHAR(120)  NOT NULL,
    Brand            NVARCHAR(60)   NOT NULL,
    Price            DECIMAL(10,2)  NOT NULL,
    ShortDescription NVARCHAR(400)  NOT NULL DEFAULT (''),
    LongDescription  NVARCHAR(2000) NOT NULL DEFAULT (''),
    ImageUrl         NVARCHAR(500)  NOT NULL DEFAULT (''),
    StockQuantity    INT            NOT NULL DEFAULT (0),
    Screen           NVARCHAR(50)   NOT NULL DEFAULT (''),
    Storage          NVARCHAR(50)   NOT NULL DEFAULT (''),
    Camera           NVARCHAR(50)   NOT NULL DEFAULT (''),
    Battery          NVARCHAR(50)   NOT NULL DEFAULT (''),
    CreatedAt        DATETIME2      NOT NULL DEFAULT (SYSUTCDATETIME())
);
GO

CREATE INDEX IX_Products_Brand ON dbo.Products(Brand);
GO

CREATE TABLE dbo.Orders (
    Id              INT IDENTITY(1,1) PRIMARY KEY,
    CustomerName    NVARCHAR(120)  NOT NULL,
    CustomerEmail   NVARCHAR(160)  NOT NULL,
    CustomerPhone   NVARCHAR(30)   NOT NULL DEFAULT (''),
    ShippingAddress NVARCHAR(300)  NOT NULL,
    TotalAmount     DECIMAL(12,2)  NOT NULL,
    Status          NVARCHAR(30)   NOT NULL DEFAULT ('Pending'),
    CreatedAt       DATETIME2      NOT NULL DEFAULT (SYSUTCDATETIME())
);
GO

CREATE TABLE dbo.OrderItems (
    Id          INT IDENTITY(1,1) PRIMARY KEY,
    OrderId     INT            NOT NULL,
    ProductId   INT            NOT NULL,
    ProductName NVARCHAR(120)  NOT NULL,
    UnitPrice   DECIMAL(10,2)  NOT NULL,
    Quantity    INT            NOT NULL,

    CONSTRAINT FK_OrderItems_Orders   FOREIGN KEY (OrderId)   REFERENCES dbo.Orders(Id)   ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId) REFERENCES dbo.Products(Id) ON DELETE NO ACTION
);
GO

-- Useful view for reporting
CREATE OR ALTER VIEW dbo.vw_OrderSummary
AS
SELECT
    o.Id              AS OrderId,
    o.CustomerName,
    o.CustomerEmail,
    o.TotalAmount,
    o.Status,
    o.CreatedAt,
    COUNT(oi.Id)      AS ItemCount,
    SUM(oi.Quantity)  AS TotalQuantity
FROM dbo.Orders o
LEFT JOIN dbo.OrderItems oi ON oi.OrderId = o.Id
GROUP BY o.Id, o.CustomerName, o.CustomerEmail, o.TotalAmount, o.Status, o.CreatedAt;
GO
