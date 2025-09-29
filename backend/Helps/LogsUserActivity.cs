using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helps;

public class LogsUserActivity : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();

        if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

        var memberId = resultContext.HttpContext.User.getMemberId();
        
        var dbContext = resultContext.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

        await dbContext.Members.Where(user => user.Id == memberId)
            .ExecuteUpdateAsync(setter => setter.SetProperty(x => x.LastActive,DateTime.UtcNow));
    }
}