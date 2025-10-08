using API.Data;
using API.Dtos;
using API.Entity;
using API.Extensions;
using API.Helps;
using Microsoft.EntityFrameworkCore;

namespace API.Repository;

public class ImplMessageRespository(AppDbContext context) : MessageRepository
{
    public void AddMessage(Message message)
    {
        context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        context.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }


    public async Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParam messageParam)
    {
        var query = context.Messages.OrderByDescending(x => x.MessageSent).AsQueryable();
        query = messageParam.Container switch
        {
            "Outbox" => query.Where(x => x.SenderId == messageParam.MemberId),
            _ => query.Where(x => x.RecipientId == messageParam.MemberId)
        };

        var messageQuery = query.Select(Extensions.MessageExtensions.ToDtoProjection());
        return await PaginationHelp.CreateAsync(messageQuery, messageParam.PageNumber, messageParam.PageSize);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId)
    {
        await context.Messages.Where(x =>
                x.RecipientId == currentMemberId && x.SenderId == recipientId && x.DateRead == null)
            .ExecuteUpdateAsync(setter => setter.SetProperty(x => x.DateRead, DateTime.UtcNow));

        return await context.Messages
            .Where(x => (x.RecipientId == currentMemberId && x.SenderId == recipientId) || (x.SenderId == currentMemberId && x.RecipientId == recipientId))
            .OrderBy(x => x.MessageSent).Select(Extensions.MessageExtensions.ToDtoProjection()).ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }
}