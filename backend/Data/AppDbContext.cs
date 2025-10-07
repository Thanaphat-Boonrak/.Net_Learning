using System;
using API.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<appUser> Users { get; set; }

    public DbSet<Member> Members { get; set; }

    public DbSet<Photo> Photos { get; set; }

    public DbSet<MemberLike> Likes { get; set; }
    
    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<Message>().HasOne(m => m.Recipient).WithMany(m => m.MembersRecive).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<Message>().HasOne(x => x.Sender).WithMany(x => x.MessagesSent).OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<MemberLike>().HasKey(x => new { x.SourceMemberId, x.TargetMemberId });
        modelBuilder.Entity<MemberLike>().HasOne(s => s.SourceMember).WithMany(t => t.LikeMember)
            .HasForeignKey(s => s.SourceMemberId).OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<MemberLike>().HasOne(s => s.TargetMember).WithMany(t => t.LikeByMembers)
            .HasForeignKey(s => s.TargetMemberId).OnDelete(DeleteBehavior.Cascade);
        var dataTimeConverter = new ValueConverter<DateTime, DateTime>(time => time.ToUniversalTime(),
            time => DateTime.SpecifyKind(time, DateTimeKind.Utc));

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dataTimeConverter);
                }
            }
        }
    }
}