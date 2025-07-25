using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.IRepositories;
using DriverTripScheduleApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;

namespace DriverTripScheduleApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripController : ControllerBase
    {
        private readonly AppDbContext _context;

        private readonly ITripService _tripService;

        public TripController(AppDbContext context,ITripService tripService)
        {
            _context = context;
            _tripService = tripService;
        }

        [HttpPost("assign-trip")]
        public async Task<IActionResult> AssignTrip(TripDto tripDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                if (userId == null) return NotFound("User not found");
                var trip = await _tripService.AssignTripAsync(tripDto, userId);
                if (trip == null) return BadRequest("Trip not assinged");
                return Ok("Trip assigned Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
                
            }
            

            //var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            //var fleetmanager = _context.FleetManagers.FirstOrDefault(fm=>fm.UserId==userId);
            //if (fleetmanager == null) return Unauthorized();
            //if (tripDto.TripEndTime <= tripDto.TripStartTime) return BadRequest("Invalid Request");

            //bool conflict = await _context.Trips.AnyAsync(t=>
            //    (t.DriverId == tripDto.DriverId || t.VehicleId == tripDto.VehicleId) &&
            //    t.TripStartTime<tripDto.TripEndTime && tripDto.TripStartTime < t.TripEndTime);
            //if (conflict) return Conflict("Trip Overlap Detected");
            //var trip = new Trip
            //{
            //    FleetManagerId=fleetmanager.FleetManagerId,
            //    DriverId=tripDto.DriverId,
            //    VehicleId = tripDto.VehicleId,
            //    Origin = tripDto.Origin,
            //    Destination = tripDto.Destination,
            //    TripStartTime = tripDto.TripStartTime,
            //    TripEndTime = tripDto.TripEndTime,
            //    SubmissionDate = DateTime.UtcNow.AddHours(5).AddMinutes(30)
            //};


            //_context.Trips.Add(trip);
            //_context.SaveChanges();
            //return Ok("Trip assigned Successfully");

        }

        [HttpGet("assigned")]
        //[Authorize(Roles ="Driver")]
        public async Task<IActionResult> GetAssignedTrips()
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
                var trips = await _tripService.GetAssignedTripsListAsync(userId);

                return Ok(trips);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            

            //var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            //var driver = _context.Drivers.FirstOrDefault(d=>d.UserId==userId);
            //if(driver == null) return Unauthorized();

            //var trips = _context.Trips.Include(t => t.Vehicle).Where(t => t.DriverId == driver.DriverId).ToList();

            //return Ok(trips);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditTrip(TripDto tripDto, int id)
        {
            try
            {
                var trip = await _tripService.EditTripAsync(tripDto, id);
                if (trip == null) return BadRequest();
                return Ok("Trip Updated Successfully");


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            //var trip = await _context.Trips.FindAsync(id);
            //if (trip == null) return NotFound();

            //trip.VehicleId = tripDto.VehicleId;
            //trip.DriverId = tripDto.DriverId;

            //trip.Origin = tripDto.Origin;
            //trip.Destination = tripDto.Destination;
            //trip.TripStartTime = tripDto.TripStartTime;
            //trip.TripEndTime = tripDto.TripEndTime;

            //await _context.SaveChangesAsync();
            //return Ok("Trip Updated Successfully");

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            try
            {
                bool trip = await _tripService.DeleteTripAsync(id);
                if (!trip) return BadRequest();
                return Ok("Trip Deleted");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
            //var trip = await _context.Trips.FindAsync(id);
            //if (trip == null) return NotFound();

            //_context.Trips.Remove(trip);
            //await _context.SaveChangesAsync();
            //return Ok("Trip Deleted");

        }
        [HttpGet]
        public async Task<IActionResult> GetAllTrips()
        {
            try
            {
                var trips = await _tripService.GetAllTripsAsync();
                return Ok(trips);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetTripById(int id)
        {
            var trip = await _tripService.GetTripByIdAsync(id);
            if (trip == null) return NotFound();
            return Ok(trip);
        }
        [HttpGet("search")]
        //[AllowAnonymous]
        public async Task<IActionResult> SearchTrips([FromQuery]string keyword)
        {
            if (string.IsNullOrEmpty(keyword)) return NotFound("Search Keyword required");
            keyword = keyword.ToLower();

            var results = await _tripService.SearchTripsAsync(keyword);

            return Ok(results);
            //if(string.IsNullOrEmpty(keyword)) return NotFound("Search Keyword required");
            //keyword = keyword.ToLower();

            //var results = await _context.Trips.Include(t => t.Driver).Include(t => t.Vehicle)
            //   .Where(t => t.Driver.Name.ToLower().Contains(keyword)
            //   || t.Vehicle.VehicleNumber.ToLower().Contains(keyword)).ToListAsync();

            //return Ok(results);
        }


    }
}
