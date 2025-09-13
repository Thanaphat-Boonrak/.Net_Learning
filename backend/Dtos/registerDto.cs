using System.ComponentModel.DataAnnotations;

namespace API.Dtos;

public class registerDto
{
    [Required] public string DisplayName { get; set; } = "";

    [Required] [MinLength(4)] public string Password { get; set; } = "";

    [Required] [EmailAddress] public string Email { get; set; } = "";
}