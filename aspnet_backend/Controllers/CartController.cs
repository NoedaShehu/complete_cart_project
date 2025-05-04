using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;

[ApiController]
[Route("api/[controller]")]
public class CartController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public CartController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private MySqlConnection GetConnection()
    {
        return new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
    }

     [HttpGet("{userId}")]
public IActionResult GetCart(int userId)
{
    var items = new List<object>(); // Declaring the items list to hold cart items
    using var conn = new MySqlConnection(_configuration.GetConnectionString("DefaultConnection"));
    conn.Open();
    var query = @"
        SELECT p.Id, p.Name, p.Price, p.ImageUrl, c.Quantity
        FROM cart c
        JOIN products p ON c.ProductId = p.Id
        WHERE c.UserId = @UserId";

    using var cmd = new MySqlCommand(query, conn);
    cmd.Parameters.AddWithValue("@UserId", userId);
    using var reader = cmd.ExecuteReader();
    while (reader.Read())
    {
        items.Add(new {
            Id = reader.GetInt32("Id"),
            Name = reader.GetString("Name"),
            Price = reader.GetDecimal("Price"),
            ImageUrl = reader.GetString("ImageUrl"),
            Quantity = reader.GetInt32("Quantity")
        });
    }
    return Ok(items); // Return the list of cart items
}
[HttpPost]
public IActionResult AddToCart([FromBody] CartItem item)
{
   Console.WriteLine($"Received: userId={item.UserId}, productId={item.ProductId}, quantity={item.Quantity}");

    using var conn = GetConnection();
    conn.Open();

    var cmd = new MySqlCommand(@"
        INSERT INTO cart (UserId, ProductId, Quantity)
        VALUES (@UserId, @ProductId, @Quantity)
        ON DUPLICATE KEY UPDATE Quantity = Quantity + @Quantity", conn);

    cmd.Parameters.AddWithValue("@UserId", item.UserId);
    cmd.Parameters.AddWithValue("@ProductId", item.ProductId);
    cmd.Parameters.AddWithValue("@Quantity", item.Quantity);

    cmd.ExecuteNonQuery();

    return Ok(new { message = "Item added to cart" });
}


    [HttpPut("{userId}")]
public IActionResult UpdateQuantity(int userId, [FromBody] CartUpdateRequest request)
{
    using var conn = GetConnection();
    conn.Open();

    if (request.Quantity <= 0)
    {
        var delCmd = new MySqlCommand("DELETE FROM cart WHERE UserId = @UserId AND ProductId = @ProductId", conn);
        delCmd.Parameters.AddWithValue("@UserId", userId);
        delCmd.Parameters.AddWithValue("@ProductId", request.ProductId);
        delCmd.ExecuteNonQuery();
        return Ok(new { message = "Item removed" });
    }
    else
    {
        var updateCmd = new MySqlCommand("UPDATE cart SET Quantity = @Quantity WHERE UserId = @UserId AND ProductId = @ProductId", conn);
        updateCmd.Parameters.AddWithValue("@Quantity", request.Quantity);
        updateCmd.Parameters.AddWithValue("@UserId", userId);
        updateCmd.Parameters.AddWithValue("@ProductId", request.ProductId);
        updateCmd.ExecuteNonQuery();
        return Ok(new { message = "Quantity updated" });
    }
}



    [HttpDelete("{userId}/{productId}")]
    public IActionResult Delete(int userId, int productId)
    {
        using var conn = GetConnection();
        conn.Open();
        var cmd = new MySqlCommand("DELETE FROM cart WHERE UserId = @UserId AND ProductId = @ProductId", conn);
        cmd.Parameters.AddWithValue("@UserId", userId);
        cmd.Parameters.AddWithValue("@ProductId", productId);
        cmd.ExecuteNonQuery();
        return Ok(new { message = "Item deleted" });
    }

    
}
