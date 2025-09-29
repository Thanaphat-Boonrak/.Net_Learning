using API.Data;
using API.Entity;
using API.Helps;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class ImplMemberRepository(AppDbContext context) : MemberRepository
{
    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }

    public async Task<Member> GetMemberForUpdateAsync(string memberId)
    {
        return await context.Members.Include(m => m.User).Include(p => p.photos)
            .SingleOrDefaultAsync(m => m.Id == memberId);
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<PaginatedResult<Member>> GetMembersAsync(MemberParam memberParam)
    {
        var query = context.Members.AsQueryable();

        query = query.Where(u => u.Id != memberParam.CurrentMemberId);
        if (memberParam.Gender != null)
        {
            query = query.Where(u => u.Gender == memberParam.Gender);
        }

        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParam.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParam.MinAge));

        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = memberParam.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };

        return await PaginationHelp.CreateAsync(query, memberParam.PageNumber, memberParam.PageSize);
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