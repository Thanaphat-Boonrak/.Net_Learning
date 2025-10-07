namespace API.Helps;

public class MessageParam : PagingParam
{
    public string? MemberId {get; set;}

    public string Container { get; set; } = "Inbox";
}