using DriverTripScheduleApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DriverTripScheduleApp.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Trip> Trips { get; set; }

        public DbSet<Driver> Drivers { get; set; }
        public DbSet<FleetManager> FleetManagers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasOne(u => u.Driver)
                .WithOne(d => d.User)
                .HasForeignKey<Driver>(d => d.UserId);

            modelBuilder.Entity<User>()
                .HasOne(u=>u.FleetManager)
                .WithOne(fm=>fm.User)
                .HasForeignKey<FleetManager>(fm=>fm.UserId);

            modelBuilder.Entity<Trip>()
                .HasOne(t=>t.Driver)
                .WithMany(d=>d.Trips)
                .HasForeignKey(t=>t.DriverId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Trip>()
                .HasOne(t=>t.FleetManager)
                .WithMany(fm=>fm.Trips)
                .HasForeignKey(t=>t.FleetManagerId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
