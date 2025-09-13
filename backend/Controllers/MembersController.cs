using API.Data;
using API.Entity;
using API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(MemberRepository member) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMember()
        {
            return Ok(await member.GetMembersAsync());
        }
        

        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMemberById(string id)
        {
            var members = await member.GetMemberByIdAsync(id);
            if (members == null) {
                return NotFound();
            }
            return members;
        }
        
        
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhoto(string id)
        {
            return Ok(await member.GetPhotosForMemberAsync(id));
        }
    }
}
