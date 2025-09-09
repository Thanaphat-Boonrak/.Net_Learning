using API.Entity;

namespace API.Service;

public interface JwtService
{
    string CreateToken(appUser user);
}