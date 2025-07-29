using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.IRepositories;
using DriverTripScheduleApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DriverTripScheduleApp.Services
{
    public class DriverService:IDriverService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<DriverService> _logger;


        public DriverService(AppDbContext context, ILogger<DriverService> logger)
        {
            _logger= logger;
            _context = context;
        }
        public async Task<List<Driver>> GetAllDriversAsync()
        {
            _logger.LogInformation("Fetching all Drivers");

            var drivers = await _context.Drivers.ToListAsync();
            if (drivers == null || !drivers.Any())
            {
                _logger.LogWarning("Driver list is Empty");
                return new List<Driver>();
            }
            _logger.LogInformation("Getting all Drivers");
            return drivers;


        }
        public async Task<Driver> UpdateDriverDetailsAsync(DriverDto driverDto,int driverId)
        {
            var driver = await _context.Drivers.FindAsync(driverId);
            if (driver == null)
            {
                _logger.LogWarning($"Driver with DriverId {driverId} not found.");
                return null;
            }
            var userId = driver.UserId;
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                _logger.LogWarning($"User Driver with UserId {userId} not found.");
                return null;
            }
            driver.LicenseNumber = driverDto.LicenseNumber;
            driver.Name = driverDto.Name;
            user.Username=driverDto.Name;
            await _context.SaveChangesAsync();
            return driver;
  

        }

        public async Task<bool> DeleteDriverAsync(int driverId)
        {
            _logger.LogInformation("Fetching driverId and attempting to delete");
            var driver = await _context.Drivers.FindAsync(driverId);
            if (driver == null)
            {
                _logger.LogWarning($"Driver with DriverId {driverId} not found.");
                return false;
            }
            var userId = driver.UserId;
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                _logger.LogWarning($"User Driver with UserId {userId} not found.");
                return false;
            }
            _context.Drivers.Remove(driver);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

