using API.Dtos;
using API.Entity;
using API.Helps;

namespace API.Repository;

public interface MessageRepository
{
    void AddMessage(Message message);
    
    void DeleteMessage(Message message);
   
    Task<Message?> GetMessage(string messageId);
    
    Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParam messageParam);
    
    Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId);
    
    Task<bool> SaveAllAsync();
}