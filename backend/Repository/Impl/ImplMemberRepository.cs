using API.Data;
using API.Entity;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class ImplMemberRepository(AppDbContext context): MemberRepository
{
    public void Update(Member member)
    {
         context.Entry(member).State = EntityState.Modified;
    }

    public async Task<Member> GetMemberForUpdateAsync(string memberId)
    {
        return await context.Members.Include(m => m.User).SingleOrDefaultAsync(m => m.Id == memberId);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<IReadOnlyList<Member>> GetMembersAsync()
    {
        return await context.Members.Include(p => p.photos).ToListAsync();

    }

    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        return await context.Members.Where(m => m.Id == memberId).SelectMany(m => m.photos).ToListAsync();
    }
}