using API.Dtos;
using API.Entity;
using API.Service;

namespace API.Extensions;

public static class AppUserExtensions
{
    public static userDto ToDto(this appUser user, JwtService tokenService)
    {
        return new userDto
        {
            Id = user.Id,
            DisplayName = user.DisplayName,
            Email = user.Email,
            ImageUrl = user.ImageUrl,
            Token = tokenService.CreateToken(user)
        };
    }
}