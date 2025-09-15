using System.Security.Claims;
using API.Data;
using API.Dtos;
using API.Entity;
using API.Extensions;
using API.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(MemberRepository memberRepository) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMember()
        {
            return Ok(await memberRepository.GetMembersAsync());
        }
        

        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMemberById(string id)
        {
            var members = await memberRepository.GetMemberByIdAsync(id);
            if (members == null) {
                return NotFound();
            }
            return members;
        }
        
        
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhoto(string id)
        {
            return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.getMemberId();
            
            if(memberId == null) return BadRequest("Not found Token");
            
            var member = await memberRepository.GetMemberByIdAsync(memberId);
            
            if(member == null) return BadRequest("Can not get member");
            
            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;
            
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;
            if(await memberRepository.SaveAllAsync()) return NoContent();
            
            return BadRequest("Failed to update member");

        }
    }
}
