using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.Models;

namespace DriverTripScheduleApp.IRepositories
{
    public interface ITripService
    {
        Task<Trip> AssignTripAsync(TripDto tripDto,int userId);

        Task<List<Trip>> GetAssignedTripsListAsync(int userId);

        Task<Trip> EditTripAsync(TripDto tripDto,int id);
        Task<bool> DeleteTripAsync(int id);

        Task<List<Trip>> GetAllTripsAsync();

        Task<Trip> GetTripByIdAsync(int id);

        Task<List<Trip>> SearchTripsAsync(string keyword);

    }
}
