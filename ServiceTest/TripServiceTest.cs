using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

[TestClass]
public class TripServiceTests
{
    private AppDbContext _context;
    private Mock<ILogger<TripService>> _loggerMock;
    private TripService _tripService;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);
        _loggerMock = new Mock<ILogger<TripService>>();
        _tripService = new TripService(_context, _loggerMock.Object);

        SeedTestData();
    }

    private void SeedTestData()
    {
        _context.FleetManagers.Add(new FleetManager { FleetManagerId = 1, UserId = 10, Name = "FM1" });
        _context.Drivers.Add(new Driver { DriverId = 1, UserId = 20, Name = "Driver1" });
        _context.Vehicles.Add(new Vehicle { VehicleId = 1, VehicleNumber = "ABC123", Capacity = 4, Model = "Toyota" });
        _context.SaveChanges();
    }

    [TestMethod]
    public async Task AssignTripAsync_ValidTrip_ReturnsTrip()
    {
        var tripDto = new TripDto
        {
            DriverId = 1,
            VehicleId = 1,
            TripStartTime = DateTime.UtcNow.AddHours(1),
            TripEndTime = DateTime.UtcNow.AddHours(2),
            Origin = "A",
            Destination = "B"
        };

        var result = await _tripService.AssignTripAsync(tripDto, 10);

        Assert.IsNotNull(result);
        Assert.AreEqual("A", result.Origin);
    }

    [TestMethod]
    public async Task AssignTripAsync_InvalidTimes_ReturnsNull()
    {
        var tripDto = new TripDto
        {
            DriverId = 1,
            VehicleId = 1,
            TripStartTime = DateTime.UtcNow.AddHours(2),
            TripEndTime = DateTime.UtcNow.AddHours(1),
            Origin = "A",
            Destination = "B"
        };

        var result = await _tripService.AssignTripAsync(tripDto, 10);

        Assert.IsNull(result);
    }

    [TestMethod]
    public async Task GetAssignedTripsListAsync_DriverExists_ReturnsTrips()
    {
        // Arrange - Create a trip
        var trip = new Trip
        {
            TripId = 1,
            DriverId = 1,
            FleetManagerId = 1,
            VehicleId = 1,
            Origin = "CityA",
            Destination = "CityB",
            TripStartTime = DateTime.UtcNow.AddHours(1),
            TripEndTime = DateTime.UtcNow.AddHours(2),
            SubmissionDate = DateTime.UtcNow
        };
        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        // Act
        var trips = await _tripService.GetAssignedTripsListAsync(20);

        // Assert
        Assert.AreEqual(1, trips.Count);
        Assert.AreEqual("CityA", trips[0].Origin);
    }

    [TestMethod]
    public async Task EditTripAsync_ValidEdit_UpdatesTrip()
    {
        var trip = new Trip
        {
            TripId = 1,
            DriverId = 1,
            FleetManagerId = 1,
            VehicleId = 1,
            Origin = "X",
            Destination = "Y",
            TripStartTime = DateTime.UtcNow,
            TripEndTime = DateTime.UtcNow.AddHours(1),
            SubmissionDate = DateTime.UtcNow
        };
        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        var tripDto = new TripDto
        {
            DriverId = 1,
            VehicleId = 1,
            Origin = "NewOrigin",
            Destination = "NewDestination",
            TripStartTime = DateTime.UtcNow.AddHours(2),
            TripEndTime = DateTime.UtcNow.AddHours(3)
        };

        var result = await _tripService.EditTripAsync(tripDto, 1);

        Assert.AreEqual("NewOrigin", result.Origin);
    }

    [TestMethod]
    public async Task DeleteTripAsync_TripExists_DeletesSuccessfully()
    {
        _context.Trips.Add(new Trip
        {
            TripId = 1,
            DriverId = 1,
            FleetManagerId = 1,
            VehicleId = 1,
            Origin = "Origin",
            Destination = "Dest",
            TripStartTime = DateTime.UtcNow,
            TripEndTime = DateTime.UtcNow.AddHours(1)
        });
        await _context.SaveChangesAsync();

        var result = await _tripService.DeleteTripAsync(1);

        Assert.IsTrue(result);
        Assert.AreEqual(0, _context.Trips.Count());
    }

    [TestMethod]
    public async Task GetTripByIdAsync_ValidId_ReturnsTrip()
    {
        var trip = new Trip
        {
            TripId = 1,
            DriverId = 1,
            FleetManagerId = 1,
            VehicleId = 1,
            Origin = "CityX",
            Destination = "CityY",
            TripStartTime = DateTime.UtcNow,
            TripEndTime = DateTime.UtcNow.AddHours(2)
        };
        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        var result = await _tripService.GetTripByIdAsync(1);

        Assert.IsNotNull(result);
        Assert.AreEqual("CityX", result.Origin);
    }

    [TestMethod]
    public async Task SearchTripsAsync_KeywordMatches_ReturnsResults()
    {
        _context.Trips.Add(new Trip
        {
            TripId = 1,
            DriverId = 1,
            FleetManagerId = 1,
            VehicleId = 1,
            TripStartTime = DateTime.UtcNow,
            TripEndTime = DateTime.UtcNow.AddHours(1),
            Driver = new Driver { DriverId = 1, Name = "TestDriver", UserId = 20 },
            Vehicle = new Vehicle { VehicleId = 1, VehicleNumber = "XYZ123", Model = "Honda" }
        });
        await _context.SaveChangesAsync();

        var results = await _tripService.SearchTripsAsync("testdriver");

        Assert.IsTrue(results.Any());
    }
}
