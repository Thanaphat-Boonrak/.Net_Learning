using System.Security.Claims;
using API.Data;
using API.Dtos;
using API.Entity;
using API.Extensions;
using API.Repository;
using API.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(MemberRepository memberRepository,PhotoService photoService) : BaseApiController
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
            if (members == null)
            {
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

            if (memberId == null) return BadRequest("Not found Token");

            var member = await memberRepository.GetMemberForUpdateAsync(memberId);

            if (member == null) return BadRequest("Can not get member");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;
            memberRepository.Update(member);
            if (await memberRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Failed to update member");
        }


        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> addPhoto([FromForm] IFormFile File)
        {
            var member = await memberRepository.GetMemberForUpdateAsync(User.getMemberId());
            
            if(member == null) return BadRequest("Not found Token");

            var result = await photoService.UploadPhotoSync(File);
            
            
            if (result.Error != null) return BadRequest(result.Error);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.getMemberId(),
            };

            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            } 
            
            member.photos.Add(photo);
            
            if (await memberRepository.SaveAllAsync()) return Ok(photo);
            return BadRequest("Failed to add photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> setMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdateAsync(User.getMemberId());
            if(member == null) return BadRequest("Not found Token");
            
            var photo = member.photos.SingleOrDefault(photo => photo.Id == photoId);


            if (member.ImageUrl == photo?.Url || photo == null)
            {
                return BadRequest("Can not set main photo");
            }
            
            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;
            
            if(await memberRepository.SaveAllAsync()) return NoContent();
            
            return BadRequest( "Can not Update this picture to main photo");
            
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> deletePhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdateAsync(User.getMemberId());
            if(member == null) return BadRequest("Not found Token");
            var photo = member.photos.SingleOrDefault(photo => photo.Id == photoId);
            if (photo == null || photo.Url == member.ImageUrl) return BadRequest("Can not delete photo");
            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoSync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            member.photos.Remove(photo);
            if (await memberRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to delete photo");
        }
    }
}