using DriverTripScheduleApp.CustomExceptions;
using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.IRepositories;

using DriverTripScheduleApp.Models;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Security.Claims;

namespace DriverTripScheduleApp.Services
{
    public class TripService:ITripService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<TripService> _logger;

        public TripService(AppDbContext context,ILogger<TripService> logger)
        {
            _context = context;
            _logger = logger;
        }

        private async Task<bool> IsTripOverlaped(int? tripIdToExclude, int driverId, int vehicleId, DateTime startTime, DateTime endTime)
        {
            if (endTime <= startTime)
            {
                _logger.LogWarning("Trip end time must be after start time.");
                return true;

            }

            return await _context.Trips.AnyAsync(t =>
                (!tripIdToExclude.HasValue || t.TripId != tripIdToExclude.Value) &&
                (t.DriverId == driverId || t.VehicleId == vehicleId) &&
                t.TripStartTime < endTime &&
                startTime < t.TripEndTime);
        }
        private DateTime ConvertIstToUtc(DateTime isDateTime)
        {
            var istZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
            return TimeZoneInfo.ConvertTimeFromUtc(isDateTime.ToUniversalTime(), istZone);
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
            

            if(await IsTripOverlaped(null,tripDto.DriverId,tripDto.VehicleId,tripDto.TripStartTime,tripDto.TripEndTime))
            {
                _logger.LogWarning("Trip conflict detected.");
                throw new TripOverlapException("Trip overlap detected. Please choose different times or resources.");

            }
            //Convert UTC → IST
          
            var tripStartIST = ConvertIstToUtc(tripDto.TripStartTime.ToUniversalTime());
            var tripEndIST = ConvertIstToUtc(tripDto.TripEndTime.ToUniversalTime());
            var submissionDateIST = ConvertIstToUtc(DateTime.UtcNow);

            var trip = new Trip
            {
                FleetManagerId = fleetmanager.FleetManagerId,
                DriverId = tripDto.DriverId,
                VehicleId = tripDto.VehicleId,
                Origin = tripDto.Origin,
                Destination = tripDto.Destination,
                TripStartTime = tripStartIST,
                TripEndTime = tripEndIST,
                SubmissionDate = submissionDateIST
            };


            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Trip assigned Successfully by Fleet Manager : {fleetmanager.Name}");
            return trip;
        }

       

        public async Task<List<TripDto>> GetAssignedTripsListAsync(int userId)
        {
           
            var driver = _context.Drivers.FirstOrDefault(d => d.UserId == userId);
            _logger.LogInformation($"Attempting to get assigned trips of DriverId {driver?.DriverId}");
            if (driver == null)
            {
                _logger.LogWarning("Driver not found");
                return new List<TripDto>();
            }

            var trips = await _context.Trips.Include(t => t.Vehicle).Include(t => t.FleetManager)
                .ThenInclude(f => f.User).Where(t => t.DriverId == driver.DriverId).ToListAsync();

            if (trips.Count == 0)
            {
                _logger.LogInformation("Trip List is empty");
 
            }
            _logger.LogInformation($"Getting alll trips and Trip loist size is : {trips.Count}");

            var tripDtos = trips.Select(t=>new TripDto
            {
                TripId = t.TripId,
                Origin=t.Origin,
                Destination=t.Destination,
                TripStartTime=t.TripStartTime,
                TripEndTime=t.TripEndTime,
                SubmissionDate=t.SubmissionDate,
                DriverId=t.DriverId,
                FleetManagerId=t.FleetManagerId,
                VehicleId=t.VehicleId,
                Driver = new UserDto
                {
                    UserName= driver.Name,

                },
                FleetManager=new UserDto
                {
                    UserName=t.FleetManager.Name,
                },
                Vehicle=new VehicleDto
                {
                    VehicleNumber=t.Vehicle.VehicleNumber,
                    Model=t.Vehicle.Model,
                }

            }).ToList();
            return tripDtos;
       

        }

        public async Task<Trip> EditTripAsync(EditTripDto tripDto, int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
            {
                _logger.LogWarning($"Trip with ID {id} not found for editing.");
                return null;
            }
            if(await IsTripOverlaped(id,tripDto.DriverId,tripDto.VehicleId,tripDto.TripStartTime,tripDto.TripEndTime))
            {
                _logger.LogWarning("Trip edit failed due to overlap.");
                throw new TripOverlapException("Trip overlap detected. Please choose different times or resources.");

            }
            var istStartTime =ConvertIstToUtc(tripDto.TripStartTime);
            var istEndTime = ConvertIstToUtc(tripDto.TripEndTime);
            var submitTime = ConvertIstToUtc(DateTime.UtcNow);
            
            trip.VehicleId = tripDto.VehicleId;
            trip.DriverId = tripDto.DriverId;
            trip.Origin = tripDto.Origin;
            trip.Destination = tripDto.Destination;
            trip.TripStartTime = istStartTime;
            trip.TripEndTime = istEndTime;
            trip.SubmissionDate = submitTime;


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

        public async Task<List<TripDto>> GetAllTripsAsync()
        {
            _logger.LogInformation("Attempting to get all Trips");
            var trips = await _context.Trips.Include(t => t.Driver).Include(t => t.Vehicle).Include(t => t.FleetManager).ToListAsync();
            if(trips.Count == 0) _logger.LogInformation("Trip list is Empty");
            _logger.LogInformation($"Getting all trips and Trip list size: {trips.Count}");
            return trips.Select(t=>new TripDto
            {
                TripId=t.TripId,
                Origin=t.Origin,
                Destination=t.Destination,
                TripStartTime=t.TripStartTime,
                TripEndTime=t.TripEndTime,
                SubmissionDate=t.SubmissionDate,
                DriverId = t.DriverId,
                FleetManagerId = t.FleetManagerId,
                VehicleId = t.VehicleId,
                Driver =new UserDto
                {
                    UserId=t.Driver.UserId,
                    UserName=t.Driver.Name,
          
                },
                FleetManager=new UserDto
                {
                    UserId=t.FleetManager.UserId,
                    UserName=t.FleetManager.Name,
                },
                Vehicle=new VehicleDto
                {
                    VehicleNumber=t.Vehicle.VehicleNumber,
                    Capacity=t.Vehicle.Capacity,
                    Model=t.Vehicle.Model,
                }

            }).ToList();
        }

        public async Task<Trip> GetTripByIdAsync(int id)
        {
            _logger.LogInformation($"Attempting to get a trip of TripId:{id}");
            var trip = await _context.Trips.FirstOrDefaultAsync(t => t.TripId == id);
            if (trip == null) _logger.LogWarning($"Trip with Id:{id} not found");
            _logger.LogInformation($"Trip found with ${id} and return");
            return trip;
        }


        public async Task<List<TripDto>> SearchTripsAsync(string keyword)
        {
            keyword = keyword.ToLower();
            _logger.LogInformation($"Searching trips with keyword '{keyword}'");

            var results = await _context.Trips
               .Include(t => t.Driver)
               .Include(t => t.Vehicle)
               .Include(t => t.FleetManager)
               .Where(t =>
                   t.Driver.Name.ToLower().Contains(keyword) ||
                   t.Vehicle.VehicleNumber.ToLower().Contains(keyword)
               )
               .ToListAsync();

            if (results.Count == 0)
                _logger.LogWarning($"No trips found with keyword '{keyword}'");

            _logger.LogInformation($"Found {results.Count} trips matching '{keyword}'");

            return results.Select(t => new TripDto
            {
                TripId = t.TripId,
                Origin = t.Origin,
                Destination = t.Destination,
                TripStartTime = t.TripStartTime,
                TripEndTime = t.TripEndTime,
                SubmissionDate = t.SubmissionDate,
                DriverId = t.DriverId,
                FleetManagerId = t.FleetManagerId,
                VehicleId = t.VehicleId,
                Driver = new UserDto
                {
                    UserId = t.Driver.UserId,
                    UserName = t.Driver.Name
                },
                FleetManager = new UserDto
                {
                    UserId = t.FleetManager.UserId,
                    UserName = t.FleetManager.Name
                },
                Vehicle = new VehicleDto
                {
                    VehicleNumber = t.Vehicle.VehicleNumber,
                    Capacity = t.Vehicle.Capacity,
                    Model = t.Vehicle.Model
                }
            }).ToList();
        }





        //public async Task<List<Trip>> SearchTripsAsync(string keyword)
        //{

        //    keyword = keyword.ToLower();
        //    _logger.LogInformation($"Searching trip with Keyword {keyword}");
        //    var results = await _context.Trips.Include(t => t.Driver).Include(t => t.Vehicle)
        //       .Where(t => t.Driver.Name.ToLower().Contains(keyword)
        //       || t.Vehicle.VehicleNumber.ToLower().Contains(keyword)).ToListAsync();
        //    if (results == null) _logger.LogWarning($"Trip not found with the keyword {keyword}");
        //    _logger.LogInformation($"Keyword : {keyword} search succesfull");
        //    return results;

        //}
    }
}
