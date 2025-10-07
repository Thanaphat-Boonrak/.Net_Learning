using API.Entity;
using API.Extensions;
using API.Helps;
using API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikesController(LikeRepository likeRepository) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.getMemberId();
        if (sourceMemberId == targetMemberId) return BadRequest("You Can not Like Your Self");
        var existingLike = await likeRepository.GetMemberLikeAlready(sourceMemberId, targetMemberId);

        if (existingLike == null)
        {
            var like = new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            };
            likeRepository.AddLike(like);
        }
        else
        {
            likeRepository.DeleteLike(existingLike);
        }

        if (await likeRepository.SaveAllChanges()) return Ok();
        return BadRequest("Failed To Liked");
    }

    [HttpGet("list")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetLikes()
    {
        var sourceMemberId = User.getMemberId();
        return Ok(await likeRepository.GetCurrentMemberUserLikeIds(sourceMemberId));
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Member>>> GetMembers([FromQuery]MemberLikeParam memberLikeParam)
    {
        memberLikeParam.CurrenMemberId = User.getMemberId();
        var members = await likeRepository.GetMemberLikes(memberLikeParam);
        return Ok(members);
    }
}