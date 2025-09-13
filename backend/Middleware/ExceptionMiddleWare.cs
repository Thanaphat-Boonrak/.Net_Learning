using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware;

public class ExceptionMiddleWare(RequestDelegate next,ILogger<ExceptionMiddleWare> logger,IHostEnvironment hostEnvironment)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{message}", ex.Message);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int) HttpStatusCode.InternalServerError; // 500

            var response = hostEnvironment.IsDevelopment()
                ? new ApiException(context.Response.StatusCode, ex.Message, ex.StackTrace?.ToString())
                : new ApiException(context.Response.StatusCode, ex.Message,"Internal Server Error");

            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            var json = JsonSerializer.Serialize(response, options);

            await context.Response.WriteAsync(json);
        }
    }
}