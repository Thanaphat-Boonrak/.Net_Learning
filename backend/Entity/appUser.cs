namespace API.Entity;

public class appUser
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string DisplayName { get; set; }

    public required string Email { get; set; }

}