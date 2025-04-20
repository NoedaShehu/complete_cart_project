namespace aspnet_backend.Models
{
public class CartItem
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public string Name { get; set; }      // Add this if not present
    public decimal Price { get; set; }    // 🔥 Required for controller
    public string ImageUrl { get; set; }  // 🔥 Required for controller
    public int Quantity { get; set; }
    public int UserId { get; set; }

}

}
