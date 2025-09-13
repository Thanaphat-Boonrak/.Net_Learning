using System;
using API.Entity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
        public DbSet<appUser> Users { get; set; }
        
        public DbSet<Member> Members { get; set; }
        
        public DbSet<Photo> Photos { get; set; }
}
