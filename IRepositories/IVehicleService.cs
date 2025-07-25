using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.Models;

namespace DriverTripScheduleApp.IRepositories
{
    public interface IVehicleService
    {
        Task<Vehicle> AddVehicleAsync(VehicleDto vehicleDto);

        Task<Vehicle> GetVehicleByIdAsync(int id);

        Task<List<Vehicle>> GetAllVehiclesAsync();

        Task<Vehicle> UpdateVehicleAsync(int  id, VehicleDto vehicleDto);

        Task<bool> DeleteVehicleAsync(int id);

        Task<bool> IsVehicleExistsAsync(string vehicleNumber);
    }
}
