using API.Data;
using API.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(AppDbContext appDb) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<appUser>>> GetMember()
        {
            var member = await appDb.Users.ToListAsync();
            return member;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<appUser>> GetMemberById(string id)
        {
            var member = await appDb.Users.FindAsync(id);
            if (member == null) {
                return NotFound();
            }
            return member;
        }
    }
}
