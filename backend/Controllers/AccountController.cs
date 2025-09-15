using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.Dtos;
using API.Entity;
using API.Extensions;
using API.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(AppDbContext context,JwtService jwtService): BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<userDto>> Register(registerDto register)
    {
        
        if(await EmailExists(register.Email)) return BadRequest("Email already exists");
        var hmac = new HMACSHA512();
        var user = new appUser()
        {
            Email = register.Email,
            DisplayName = register.DisplayName,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(register.Password)),
            PasswordSalt = hmac.Key
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user.ToDto(jwtService);
    }

    [HttpPost("login")]
    public async Task<ActionResult<userDto>> login(loginDto login)
    {
        var user = await context.Users.SingleOrDefaultAsync(user => user.Email == login.Email);
        
        if(user == null) return Unauthorized("Invalid email or password");
        
        using var hmac = new HMACSHA512(user.PasswordSalt);
        
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(login.Password));

        if (!computedHash.SequenceEqual(user.PasswordHash))
            return Unauthorized();

        return user.ToDto(jwtService);
    }

    private async Task<bool> EmailExists(string email)
    {
        return await context.Users.AnyAsync(e => e.Email == email);
    }
}