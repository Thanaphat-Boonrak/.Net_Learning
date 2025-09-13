using API.Entity;

namespace API.Repository;

public interface MemberRepository
{
    void Update(Member member);

    Task<bool> SaveAllAsync();

    Task<IReadOnlyList<Member>> GetMembersAsync();

    Task<Member?> GetMemberByIdAsync(string id);

    Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId);
}
