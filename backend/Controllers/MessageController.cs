using API.Dtos;
using API.Entity;
using API.Extensions;
using API.Helps;
using API.Repository;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessageController(MemberRepository memberRepository, MessageRepository messageRepository)
    : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<MessageDto>> AddMessage(CreateMessageDto createMessageDto)
    {
        var sender = await memberRepository.GetMemberByIdAsync(User.getMemberId());
        var recipent = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipent == null || sender == null || sender.Id == createMessageDto.RecipientId)
            return BadRequest("Cannot Send This Message");

        var message = new Message()
        {
            SenderId = sender.Id,
            RecipientId = recipent.Id,
            Content = createMessageDto.Content,
        };
        messageRepository.AddMessage(message);
        if (await messageRepository.SaveAllAsync()) return message.ToDto();

        return BadRequest("Cannot Send This Message");
    }

    [HttpGet]
    public async Task<ActionResult<PaginatedResult<MessageDto>>> GetMessageByContainer(
        [FromQuery] MessageParam messageParam)
    {
        messageParam.MemberId = User.getMemberId();
        return await messageRepository.GetMessagesForMember(messageParam);
    }

    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<IReadOnlyList<MessageDto>>> GetMessageByRecipient(string recipientId)
    {
        return  Ok(await messageRepository.GetMessageThread(User.getMemberId(), recipientId));
    }
}