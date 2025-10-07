using API.Data;
using API.Entity;
using API.Helps;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class ImplLikeRepository(AppDbContext context) : LikeRepository
{
    public async Task<MemberLike?> GetMemberLikeAlready(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(MemberLikeParam memberParam)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;
        switch (memberParam.Predicate)
        {
            case "liked":
                result = query.Where(x => x.SourceMemberId == memberParam.CurrenMemberId).Select(x => x.TargetMember);
                break;
            case "likedBy":
                result = query.Where(x => x.TargetMemberId == memberParam.CurrenMemberId)
                    .Select(x => x.SourceMember);
                break;

            default:
                var likesId = await GetCurrentMemberUserLikeIds(memberParam.CurrenMemberId);
                result = query
                    .Where(x => x.TargetMemberId == memberParam.CurrenMemberId && likesId.Contains(x.SourceMemberId))
                    .Select(x => x.SourceMember);
                break;
        }

        ;
        return await PaginationHelp.CreateAsync(result, memberParam.PageNumber, memberParam.PageSize);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberUserLikeIds(string memberId)
    {
        return await context.Likes.Where(x => x.SourceMemberId == memberId).Select(x => x.TargetMemberId).ToListAsync();
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public async Task<bool> SaveAllChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}