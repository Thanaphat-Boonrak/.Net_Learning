using API.Entity;
using API.Helps;

namespace API.Repository;

public interface LikeRepository
{
    Task<MemberLike?> GetMemberLikeAlready(string sourceMemberId, string targetMemberId);
    Task<PaginatedResult<Member>> GetMemberLikes(MemberLikeParam memberLikeParam);
    Task<IReadOnlyList<string>> GetCurrentMemberUserLikeIds(string memberId);
    void DeleteLike(MemberLike like);
    void AddLike(MemberLike like);
    Task<bool> SaveAllChanges();
}