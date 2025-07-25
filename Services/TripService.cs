using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.IRepositories;

using DriverTripScheduleApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace DriverTripScheduleApp.Services
{
    public class TripService:ITripService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TripService> _logger;

        public TripService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Trip> AssignTripAsync(TripDto tripDto,int userId)
        {
            
            var fleetmanager = _context.FleetManagers.FirstOrDefault(fm => fm.UserId == userId);
            _logger.LogInformation($"Attempting to assign a trip by Fleet manager {fleetmanager.Name}");
            if (fleetmanager == null)
            {
                _logger.LogWarning($"Fleet manager with Id{userId} not found.");
                return null;
            }
            if (tripDto.TripEndTime <= tripDto.TripStartTime)
            {
                _logger.LogWarning("Trip is not valid");
                return null;

            }

            bool conflict = await _context.Trips.AnyAsync(t =>
                (t.DriverId == tripDto.DriverId || t.VehicleId == tripDto.VehicleId) &&
                t.TripStartTime < tripDto.TripEndTime && tripDto.TripStartTime < t.TripEndTime);
            if (conflict)
            {
                _logger.LogWarning($"Trips cannot be assign as it is Overlapping");
                return null;
            }
            _logger.LogInformation("Attempting to assign a Trip");
            var trip = new Trip
            {
                FleetManagerId = fleetmanager.FleetManagerId,
                DriverId = tripDto.DriverId,
                VehicleId = tripDto.VehicleId,
                Origin = tripDto.Origin,
                Destination = tripDto.Destination,
                TripStartTime = tripDto.TripStartTime,
                TripEndTime = tripDto.TripEndTime,
                SubmissionDate = DateTime.UtcNow.AddHours(5).AddMinutes(30)
            };


            _context.Trips.Add(trip);
            _context.SaveChanges();
            _logger.LogInformation($"Trip assigned Successfully by Fleet Manager : {fleetmanager.Name}");
            return trip;
        }

        public async Task<List<Trip>> GetAssignedTripsListAsync(int userId)
        {
           
            var driver = _context.Drivers.FirstOrDefault(d => d.UserId == userId);
            _logger.LogInformation($"Attempting to get assigned trips of DriverId {driver.DriverId}");
            if (driver == null)
            {
                _logger.LogWarning("Driver not found");
                return null;
            }

            var trips = _context.Trips.Include(t => t.Vehicle).Where(t => t.DriverId == driver.DriverId).ToList();
           
            return trips;

        }

        public async Task<Trip> EditTripAsync(TripDto tripDto, int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
            {
                _logger.LogWarning("Trip not found");
                return null;
            }

            trip.VehicleId = tripDto.VehicleId;
            trip.DriverId = tripDto.DriverId;

            trip.Origin = tripDto.Origin;
            trip.Destination = tripDto.Destination;
            trip.TripStartTime = tripDto.TripStartTime;
            trip.TripEndTime = tripDto.TripEndTime;

            await _context.SaveChangesAsync();
            _logger.LogInformation($"Trip edited successfully {trip.TripId}");
            return trip;
        }
        public async Task<bool> DeleteTripAsync(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
            {
                _logger.LogWarning("Trip not found");
                return false;
            }

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Trip Deleted Successfully");
            return true;
        }

        public async Task<List<Trip>> GetAllTripsAsync()
        {
            _logger.LogInformation("Attempting to get all Trips");
            var trips = await _context.Trips.Include(t => t.Driver).Include(t => t.Vehicle).Include(t => t.FleetManager).ToListAsync();
            if(trips.Count == 0) _logger.LogInformation("Trip list is Empty");
            _logger.LogInformation($"Getting all trips and Trip list size: {trips.Count}");
            return trips;
        }

        public async Task<Trip> GetTripByIdAsync(int id)
        {
            _logger.LogInformation($"Attempting to get a trip of TripId:{id}");
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.TripId == id);
            if (trip == null) _logger.LogWarning($"Trip with Id:{id} not found");
            _logger.LogInformation($"Trip found with ${id} and return");
            return trip;
        }

        public async Task<List<Trip>> SearchTripsAsync(string keyword)
        {
            
            keyword = keyword.ToLower();
            _logger.LogInformation($"Searching trip with Keyword {keyword}");
            var results = await _context.Trips.Include(t => t.Driver).Include(t => t.Vehicle)
               .Where(t => t.Driver.Name.ToLower().Contains(keyword)
               || t.Vehicle.VehicleNumber.ToLower().Contains(keyword)).ToListAsync();
            if (results == null) _logger.LogWarning($"Trip not found with the keyword {keyword}");
            _logger.LogInformation($"Keyword : {keyword} search succesfull");
            return results;

        }
    }
}
