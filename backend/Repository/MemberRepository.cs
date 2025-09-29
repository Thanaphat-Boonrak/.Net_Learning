using API.Entity;
using API.Helps;

namespace API.Repository;

public interface MemberRepository
{
    void Update(Member member);

    Task<bool> SaveAllAsync();

    Task<PaginatedResult<Member>> GetMembersAsync(MemberParam memberParam);

    Task<Member?> GetMemberByIdAsync(string id);

    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);

    Task<Member> GetMemberForUpdateAsync(string memberId);
}