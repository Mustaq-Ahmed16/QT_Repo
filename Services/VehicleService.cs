using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.IRepositories;
using DriverTripScheduleApp.Models;

namespace DriverTripScheduleApp.Services
{
    public class VehicleService:IVehicleService
    {
        private readonly AppDbContext _appDbContext;
        private readonly ILogger<VehicleService> _logger;
        public VehicleService(AppDbContext appDbContext, ILogger<VehicleService> logger)
        {
            _appDbContext = appDbContext;
            _logger = logger;
        }

        public async Task<Vehicle> AddVehicleAsync(VehicleDto vehicledto)
        {
            _logger.LogInformation("Attempting to add Vehicle");
            var vehicle = new Vehicle
            {
                VehicleNumber = vehicledto.VehicleNumber,
                Model = vehicledto.Model,
                Capacity = vehicledto.Capacity
            };
            _appDbContext.Vehicles.Add(vehicle);
            await _appDbContext.SaveChangesAsync();
            _logger.LogInformation($"Vehicle added Succesfully. VehicleNumber: {vehicle.VehicleNumber}");
            return vehicle;
        }

        public async Task<Vehicle> GetVehicleByIdAsync(int id)
        {
            _logger.LogInformation($"Attempting to get a vehicle by vehicleid {id}");
            var vehicle = await _appDbContext.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                _logger.LogWarning($"Vehicle not found of VehicleId:{id}");
                return null;
            }
            _logger.LogInformation("Get Vehicle by Id success ");
            return vehicle;
        }

        public async Task<List<Vehicle>> GetAllVehiclesAsync()
        {
            _logger.LogInformation("Attempting to get all Vehicle List");
            var vehicles = _appDbContext.Vehicles.ToList();
            if(vehicles==null)
            {
                _logger.LogWarning("Vehicle List is Empty");
                return null;
            }
            _logger.LogInformation("Getting List of Vehicles");
            return vehicles;
        }

        public async Task<Vehicle> UpdateVehicleAsync(int id, VehicleDto vehicledto)
        {
            var vehicle = await _appDbContext.Vehicles.FindAsync(id);
            _logger.LogInformation($"Attempting to update Vehicle Info of Vehicle id:{id}");
            if (vehicle == null)
            {
                _logger.LogWarning($"Vehicle not found with vehicleId:{id}");
                return null;
            }
            vehicle.VehicleNumber = vehicledto.VehicleNumber;
            vehicle.Model = vehicledto.Model;
            vehicle.Capacity = vehicledto.Capacity;

            await _appDbContext.SaveChangesAsync();
            _logger.LogInformation($"Vehicle Updated Successfully of VehicleNumber:{vehicle.VehicleNumber}");
            return vehicle;
        }

        public async Task<bool> DeleteVehicleAsync(int id)
        {
            _logger.LogInformation($"Attempting to Delete a Vehicle of VehicleId:{id}");
            var vehicle = await _appDbContext.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                _logger.LogWarning($"Vehicle Not found of Id:{id}");
                return false;
            }

            _appDbContext.Vehicles.Remove(vehicle);
            await _appDbContext.SaveChangesAsync();
            _logger.LogInformation($"Vehicle Deleted Successfully of VehicleNumber:{vehicle.VehicleNumber}");
            return true;
        }

        public async Task<bool> IsVehicleExistsAsync(string vehicleNumber)
        {
            return _appDbContext.Vehicles.Any(v => v.VehicleNumber == vehicleNumber);
        }
    }
}
