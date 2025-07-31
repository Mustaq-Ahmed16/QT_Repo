using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.Models;
using DriverTripScheduleApp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;


namespace DriverTripScheduleAppTest
{
    [TestClass]
    public class DriverServiceTest
    {
        private AppDbContext _context;
        private Mock<ILogger<DriverService>> _loggerMock;
        private DriverService _driverService;

        [TestInitialize]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new AppDbContext(options);
            _loggerMock = new Mock<ILogger<DriverService>>();
            _driverService = new DriverService(_context, _loggerMock.Object);

            SeedTestData();
        }

        private void SeedTestData()
        {
            _context.Users.Add(new User { UserId = 1, Username = "DriverUser",Email="driver@gmail.com",Password="driver123" });
            _context.Drivers.Add(new Driver
            {
                DriverId = 1,
                UserId = 1,
                Name = "Test Driver",
                LicenseNumber = "LIC123"
            });
            _context.SaveChanges();
        }

        [TestMethod]
        public async Task GetAllDriversAsync_WhenDriversExist_ReturnsDrivers()
        {
            var result = await _driverService.GetAllDriversAsync();

            Assert.IsNotNull(result);
            Assert.AreEqual(1, result.Count);
            Assert.AreEqual("Test Driver", result[0].Name);
        }

        [TestMethod]
        public async Task GetAllDriversAsync_WhenNoDriversExist_ReturnsEmptyList()
        {
            _context.Drivers.RemoveRange(_context.Drivers);
            await _context.SaveChangesAsync();

            var result = await _driverService.GetAllDriversAsync();

            Assert.IsNotNull(result);
            Assert.AreEqual(0, result.Count);
        }

        [TestMethod]
        public async Task UpdateDriverDetailsAsync_WithValidDriver_UpdatesDriverAndUser()
        {
            var dto = new DriverDto
            {
                Name = "Updated Driver",
                LicenseNumber = "NEW123"
            };

            var result = await _driverService.UpdateDriverDetailsAsync(dto, 1);

            Assert.IsNotNull(result);
            Assert.AreEqual("Updated Driver", result.Name);

            var updatedUser = await _context.Users.FindAsync(1);
            Assert.AreEqual("Updated Driver", updatedUser.Username);
        }

        [TestMethod]
        public async Task UpdateDriverDetailsAsync_WithInvalidDriver_ReturnsNull()
        {
            var dto = new DriverDto
            {
                Name = "NoDriver",
                LicenseNumber = "X123"
            };

            var result = await _driverService.UpdateDriverDetailsAsync(dto, 999); // non-existent ID

            Assert.IsNull(result);
        }

        [TestMethod]
        public async Task DeleteDriverAsync_WithValidDriver_DeletesDriverAndUser()
        {
            var result = await _driverService.DeleteDriverAsync(1);

            Assert.IsTrue(result);
            Assert.AreEqual(0, _context.Drivers.Count());
            Assert.AreEqual(0, _context.Users.Count());
        }

        [TestMethod]
        public async Task DeleteDriverAsync_WithInvalidDriver_ReturnsFalse()
        {
            var result = await _driverService.DeleteDriverAsync(999); // non-existent ID

            Assert.IsFalse(result);
        }
    }
}