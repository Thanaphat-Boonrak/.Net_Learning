namespace API.Helps;

public class MemberLikeParam : PagingParam
{
    public string Predicate { get; set; } = "liked";
    public string? CurrenMemberId { get; set; }
}