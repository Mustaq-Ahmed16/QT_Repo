using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.Models;
using DriverTripScheduleApp.Services;
using Microsoft.EntityFrameworkCore;

namespace DriverTripScheduleAppTest;

[TestClass]
public class VehicleServiceTest
{

    private AppDbContext _appDbContext;
    private VehicleService _vehicleService;

    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(databaseName: "VehicleTestdb").Options;

        _appDbContext = new AppDbContext(options);
        _vehicleService=new VehicleService(_appDbContext);
    }


    [TestMethod]
    public async Task AddVehicleAsync_ShouldAddVehicle()
    {
        var dto = new VehicleDto
        {
            VehicleNumber = "KA01AB9087",
            Model = "Tata Ace",
            Capacity = 1200
        };
        var vehicle = await _vehicleService.AddVehicleAsync(dto);
        Assert.IsNotNull(vehicle);
        Assert.AreEqual("KA01AB9087", vehicle.VehicleNumber);
    }

    [TestMethod]
    public async Task GetVehicleByIdAsync_ShouldReturnVehicle()
    {
        var vehicle = new Vehicle
        {
            VehicleId = 1,
            VehicleNumber = "MH02XY78",
            Model = "Mahindra",
            Capacity = 1500
        };

        _appDbContext.Vehicles.Add(vehicle);
        await _appDbContext.SaveChangesAsync();

        var result = await _vehicleService.GetVehicleByIdAsync(1);
        Assert.IsNotNull(result);
        Assert.AreEqual("MH02XY78", result.VehicleNumber);

    }

    [TestMethod]
    public async Task GetReturnById_ShouldReturnNull_IfNotFound()
    {
        var result = await _vehicleService.GetVehicleByIdAsync(99);
        Assert.IsNull(result);
    }

    [TestMethod]
    public async Task GetAllVehiclesAsync_ShouldReturnAllVehicles()
    {
        _appDbContext.Vehicles.AddRange(new Vehicle { VehicleNumber = "TN10BB111", Model = "Model1", Capacity = 10 },
                                        new Vehicle { VehicleNumber = "TN10AA22", Model = "Model2", Capacity = 12 });
        await _appDbContext.SaveChangesAsync();

        var result = await _vehicleService.GetAllVehiclesAsync();
        Assert.AreEqual(2, result.Count);
    }

    [TestMethod]
    public async Task UpdateVehicleAsync_ShouldUpdateVehicle()
    {
        var vehicle = new Vehicle
        {
            VehicleId = 10,
            VehicleNumber = "OLDVEHICLE",
            Model = "Old Model",
            Capacity = 10,
        };
        _appDbContext.Vehicles.Add(vehicle);
        _appDbContext.SaveChangesAsync();

        var updateDto = new VehicleDto
        {
            VehicleNumber = "NEWVEHICLE",
            Model = "New Model",
            Capacity = 20,
        };

        var updated = await _vehicleService.UpdateVehicleAsync(10, updateDto);
        Assert.IsNotNull(updated);

        Assert.AreEqual("NEWVEHICLE", updated.VehicleNumber);
    }

    [TestMethod]
    public async Task UpdateVehicleAsync_ShouldReturnNull_IfNotFound()
    {
        var updateDto = new VehicleDto
        {
            VehicleNumber = "X123",
            Model = "XModel",
            Capacity = 12
        };
        var result = await _vehicleService.UpdateVehicleAsync(999,updateDto);
        Assert.IsNull(result);
    }

    [TestMethod]
    public async Task DeleteVehicleAsync_ShouldDeleteVehicle()
    {
        var vehicle = new Vehicle
        {
            VehicleId = 50,
            VehicleNumber = "DEL123",
            Model = "Mini Truck",
            Capacity = 800,
        };
        _appDbContext.Vehicles.Add(vehicle);
        await _appDbContext.SaveChangesAsync();

        var result = await _vehicleService.DeleteVehicleAsync(50);
        Assert.IsTrue(result);
    }

    [TestMethod]
    public async Task DeleteVehicleAsync_ShouldReturnFalse_IfNotFound()
    {
        var result = await _vehicleService.DeleteVehicleAsync(404);
        Assert.IsFalse(result);
    }

    [TestMethod]
    public async Task DeleteVehicleAsync_ShouldReturnTrue_IfExists()
    {
        _appDbContext.Vehicles.Add(new Vehicle { VehicleNumber = "XX123", Model = "Test", Capacity = 500 });
        await _appDbContext.SaveChangesAsync();
        var exists = await _vehicleService.IsVehicleExistsAsync("XX123");
        Assert.IsTrue(exists);

    }
    [TestMethod]
    public async Task DeleteVehicleAsync_ShouldReturnFalse_IfNotExists()
    {
        var exists = await _vehicleService.IsVehicleExistsAsync("ZZ999");
        Assert.IsFalse(exists);
    }
    
}
