using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.Models;
using DriverTripScheduleApp.Services;
using Microsoft.EntityFrameworkCore;

namespace DriverTripScheduleAppTest;

[TestClass]
public class TripServiceTest
{
    private AppDbContext _dbContext;
    private TripService _tripService;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(databaseName: "TripTestDb").Options;
        _dbContext = new AppDbContext(options);

        var user1 = new User { UserId = 1, Email = "fleet@gmail.com", Password="fleet123",Role = "FleetManager" };
        var user2 = new User { UserId = 2, Email = "driver1@gmail.com", Password="driver123",Role = "Driver" };
        var user3 = new User { UserId = 3, Email = "driver2@gmail.com", Password = "driver678", Role = "Driver" };
        var fleetManager = new FleetManager { FleetManagerId = 1, UserId = 1, Name = "Fleet Boss" };
        var driver1 = new Driver { DriverId = 1, UserId = 2, Name = "DriverOne", LicenseNumber = "DL74971" };
        var driver2 = new Driver { DriverId = 2, UserId = 3, Name = "Drivertwo", LicenseNumber = "DL87960" };
        var vehicle1 = new Vehicle { VehicleId = 1, VehicleNumber = "KA01AB4567",Model="Hyundai Creta",Capacity=5 };
        var vehicle2 = new Vehicle { VehicleId = 2, VehicleNumber = "AP067S4897", Model = "Thar Roxx", Capacity = 7 };
        _dbContext.Users.AddRange(user1,user2,user3);
        _dbContext.FleetManagers.Add(fleetManager);
        _dbContext.Drivers.AddRange(driver1,driver2);
        _dbContext.Vehicles.AddRange(vehicle1,vehicle2);

        _dbContext.SaveChanges();

        _tripService=new TripService(_dbContext);


    }


    [TestMethod]
    public async Task AssignTripAsync_ShouldAssignTripSuccessful()
    {
        var tripDto = new TripDto
        {
            DriverId = 1,
            VehicleId = 1,
            Origin = "Bengaluru",
            Destination = "Hyderabad",
            TripStartTime = DateTime.Now.AddHours(6),
            TripEndTime = DateTime.Now.AddHours(8),
        };
        var trip =await _tripService.AssignTripAsync(tripDto,userId:1);

        Assert.IsNotNull(trip);
        Assert.AreEqual("Hyderabad",trip.Destination);
    }

    [TestMethod]
    public async Task AssignTripAsync_ShouldFail_WhenOverlapExists()
    {
        //assign
        var existingTrip = new Trip
        {
            DriverId = 1,
            VehicleId = 1,
            TripStartTime = DateTime.Now.AddHours(6),
            TripEndTime = DateTime.Now.AddHours(8),
            FleetManagerId = 1,
            Destination = "Pune",
            Origin = "Nagpur",
            SubmissionDate = DateTime.Now
        };
        _dbContext.Trips.Add(existingTrip);
        _dbContext.SaveChanges();

        // assigning overlap trip
        var tripDto = new TripDto
        {
            DriverId = 1,
            VehicleId = 1,
            Destination = "Mumbai",
            Origin = "Delhi",
            TripStartTime = DateTime.Now.AddHours(7),
            TripEndTime = DateTime.Now.AddHours(8),
        };

        var result = await _tripService.AssignTripAsync(tripDto,userId:1);
        Assert.IsNull(result);
    }
    [TestMethod]
    public async Task AssignTripAsync_ShouldFail_WhenSameDriverDiffVehicleSameTime()
    {
        //assign
        var existingTrip = new Trip
        {
            DriverId = 1,
            VehicleId = 1,
            TripStartTime = DateTime.Now.AddHours(6),
            TripEndTime = DateTime.Now.AddHours(8),
            FleetManagerId = 1,
            Destination = "Pune",
            Origin = "Nagpur",
            SubmissionDate = DateTime.Now
        };
        _dbContext.Trips.Add(existingTrip);
        _dbContext.SaveChanges();

        // assigning overlap trip
        var tripDto = new TripDto
        {
            DriverId = 1,
            VehicleId = 2,
            Destination = "Mumbai",
            Origin = "Delhi",
            TripStartTime = DateTime.Now.AddHours(6),
            TripEndTime = DateTime.Now.AddHours(8),
        };

        var result = await _tripService.AssignTripAsync(tripDto, userId: 1);
        Assert.IsNull(result);
    }
    [TestMethod]
    public async Task AssignTripAsync_ShouldFail_WhenDiffDriverSameVehicleSameTime()
    {
        //assign
        var existingTrip = new Trip
        {
            DriverId = 1,
            VehicleId = 1,
            TripStartTime = DateTime.Now.AddHours(6),
            TripEndTime = DateTime.Now.AddHours(8),
            FleetManagerId = 1,
            Destination = "Pune",
            Origin = "Nagpur",
            SubmissionDate = DateTime.Now
        };
        _dbContext.Trips.Add(existingTrip);
        _dbContext.SaveChanges();

        // assigning overlap trip
        var tripDto = new TripDto
        {
            DriverId = 2,
            VehicleId = 1,
            Destination = "Mumbai",
            Origin = "Delhi",
            TripStartTime = DateTime.Now.AddHours(6),
            TripEndTime = DateTime.Now.AddHours(8),
        };

        var result = await _tripService.AssignTripAsync(tripDto, userId: 1);
        Assert.IsNull(result);
    }
    [TestMethod]
    public async Task AssignTripAsync_ShouldPass_WhenDiffDriverDiffVehicleSameTime()
    {
        //assign
        var existingTrip = new Trip
        {
            DriverId = 1,
            VehicleId = 1,
            TripStartTime = DateTime.Now.AddHours(6),
            TripEndTime = DateTime.Now.AddHours(8),
            FleetManagerId = 1,
            Destination = "Pune",
            Origin = "Nagpur",
            SubmissionDate = DateTime.Now
        };
        _dbContext.Trips.Add(existingTrip);
        _dbContext.SaveChanges();

        // assigning overlap trip
        var tripDto = new TripDto
        {
            DriverId = 2,
            VehicleId = 2,
            Destination = "Mumbai",
            Origin = "Delhi",
            TripStartTime = DateTime.Now.AddHours(6),
            TripEndTime = DateTime.Now.AddHours(8),
        };

        var result = await _tripService.AssignTripAsync(tripDto, userId: 1);
        Assert.IsNotNull(result);
    }
    [TestMethod]
    public async Task EditTripAsync_ShouldUpdateTripDetails()
    {
        var trip = new Trip
        {
            TripId = 101,
            DriverId = 1,
            VehicleId = 1,
            Origin = "A",
            Destination = "B",
            TripStartTime = DateTime.Now.AddHours(1),
            TripEndTime = DateTime.Now.AddHours(3),
            FleetManagerId = 1
        };
        _dbContext.Trips.Add(trip);
        _dbContext.SaveChanges();

        var dto = new TripDto
        {
            DriverId = 2,
            VehicleId = 2,
            Origin = "C",
            Destination = "D",
            TripStartTime = DateTime.Now.AddHours(2),
            TripEndTime = DateTime.Now.AddHours(4),

        };

        var result = await _tripService.EditTripAsync(dto, 101);
        Assert.IsNotNull(result);
        Assert.AreEqual("C", result.Origin);
        Assert.AreEqual("D", result.Destination);
    }

    [TestMethod]
    public async Task DeleteTripAsync_ShouldDeleteTrip()
    {
        var trip = new Trip
        {
            TripId = 501,
            DriverId = 1,
            VehicleId = 1,
            Origin = "A",
            Destination = "B",
            TripStartTime = DateTime.Now,
            TripEndTime = DateTime.Now.AddHours(1),
            FleetManagerId = 1,
        };
        _dbContext.Trips.Add(trip);
        _dbContext.SaveChanges();
        var result = await _tripService.DeleteTripAsync(501);
        Assert.IsTrue(result);
    }

    [TestMethod]
    public async Task GetTripByIdAsync_ShouldReturnCorrectTrip()
    {
        var trip = new Trip
        {
            TripId = 999,
            DriverId = 1,
            VehicleId = 1,
            Origin = "TestOrigin",
            Destination = "TestDestiny",
            TripStartTime = DateTime.Now,
            TripEndTime = DateTime.Now.AddHours(1),
            FleetManagerId = 1,


        };
        _dbContext.Trips.Add(trip);
        _dbContext.SaveChanges();
        var result = await _tripService.GetTripByIdAsync(999);

        Assert.IsNotNull(result);
        Assert.AreEqual("TestDestiny", result.Destination);
    }

    [TestMethod]
    public async Task GetAssignedTripsListAsync_ShouldReturnDriverTrips()
    {
        var trip = new Trip
        {
            DriverId = 1,
            VehicleId = 1,
            FleetManagerId = 1,
            TripStartTime = DateTime.Now,
            TripEndTime = DateTime.Now.AddHours(1),
            Origin = "Hyd",
            Destination = "Bnglr"

        };
        _dbContext.Trips.Add(trip);
        _dbContext.SaveChanges();

        var trips = await _tripService.GetAssignedTripsListAsync(2); // userid of driver

        Assert.IsNotNull(trips);
        Assert.AreEqual(1, trips.Count);
    }

    [TestMethod]
    public async Task SearchTripsAsync_ShouldReturnMatchingTrips()
    {
        var trip = new Trip
        {
            DriverId = 1,
            VehicleId = 1,
            FleetManagerId = 1,
            TripStartTime = DateTime.Now,
            TripEndTime = DateTime.Now.AddHours(1),
            Origin = "Chennai",
            Destination = "Kolkata"
        };
        _dbContext.Trips.Add(trip);
        _dbContext.SaveChanges();

        var result = await _tripService.SearchTripsAsync("ka");
        Assert.IsNotNull(result);
        Assert.AreEqual(1, result.Count); // matches vehicle number
    }

    [TestMethod]
    public async Task GetAllTripsAsync_ShouldReturnAllTrips()
    {
        _dbContext.Trips.Add(new Trip
        {
            DriverId = 1,
            VehicleId = 1,
            FleetManagerId = 1,
            TripStartTime = DateTime.Now,
            TripEndTime = DateTime.Now.AddHours(7),
            Destination = "Coimbatore",
            Origin = "Hyd"
        });
        _dbContext.SaveChanges();

        var result = await _tripService.GetAllTripsAsync();
        Assert.IsNotNull(result);
        Assert.IsTrue(result.Count>0);
    }

}
