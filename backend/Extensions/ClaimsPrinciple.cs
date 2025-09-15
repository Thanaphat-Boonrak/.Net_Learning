using System.Security.Claims;

namespace API.Extensions;

public static class ClaimsPrinciple
{
    public static string getMemberId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Cannot get member id from claims");
    }
}