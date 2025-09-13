using System.Text;
using API.Data;
using API.Middleware;
using API.Repository;
using API.Service;
using API.Service.Impl;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddScoped<JwtService, JwtServiceImpl>();
builder.Services.AddScoped<MemberRepository, ImplMemberRepository>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer((opt) =>
{
    var token = builder.Configuration["TokenKey"] ?? throw new ArgumentNullException("TokensKey");
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(token)),
        ValidateIssuer = false,
        ValidateAudience = false
    };
});
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
var app = builder.Build();


app.UseMiddleware<ExceptionMiddleWare>();
app.UseAuthentication();
app.UseAuthorization();
app.UseCors(cors => cors.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:4200"));
app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<AppDbContext>();
    await context.Database.MigrateAsync();     
    await Seed.SeedUsers(context);             
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occured during migration");
}
app.Run();
