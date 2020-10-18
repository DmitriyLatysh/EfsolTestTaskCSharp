using EfsolTestTaskCSharp.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EfsolTestTaskCSharp.Data
{
    public class BdContext : DbContext
    {
        public DbSet<Question> Questions { get; set; }
        public DbSet<PossibleInputAnswer> PossibleInputAnswes { get; set; }
        public DbSet<Answer> Answers { get; set; }

        public BdContext(DbContextOptions<BdContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Question>().ToTable("Questions");
            modelBuilder.Entity<PossibleInputAnswer>().ToTable("PossibleInputAnswers");
            modelBuilder.Entity<Answer>().ToTable("UsersAnswers");
        }
    }
}