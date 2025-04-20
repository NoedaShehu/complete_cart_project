using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;


[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        try
        {
            using var conn = new MySqlConnection("server=localhost;user=root;password=initial#332211;database=clothing_store;");
            conn.Open();

            var cmd = new MySqlCommand("SELECT * FROM users WHERE email = @Email AND password = @Password", conn);
           cmd.Parameters.AddWithValue("@Email", request.Email);
           cmd.Parameters.AddWithValue("@Password", request.Password);
            using var reader = cmd.ExecuteReader();
            if (reader.Read())
            {
                return Ok(new { success = true, userId = reader["id"] });
            }
            else
            {
                return Unauthorized(new { success = false, message = "Invalid credentials" });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}

