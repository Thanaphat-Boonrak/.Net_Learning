namespace API.Dtos;

public class userDto
{
    public required string Id {get;set;}
    
    public required string Email {get;set;}
    
    public required string DisplayName {get;set;}
    
    public string? ImageUrl {get;set;}
    public required string Token {get;set;}
}