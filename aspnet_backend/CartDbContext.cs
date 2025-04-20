using Microsoft.EntityFrameworkCore;

public class CartDbContext : DbContext
{
    public CartDbContext(DbContextOptions<CartDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<CartItem> Cart { get; set; }
}

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }

    // ✅ Add this:
    public string ImageUrl { get; set; }
}


public class CartItem
{
    public int Id { get; set; }
    public int UserId { get; set; } = 1;
    public int ProductId { get; set; }
    public Product Product { get; set; }
    public int Quantity { get; set; }
}