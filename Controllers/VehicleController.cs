using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.IRepositories;
using DriverTripScheduleApp.Models;
using Microsoft.AspNetCore.Mvc;

namespace DriverTripScheduleApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly IVehicleService _vehicleService;

        public VehicleController(IVehicleService vehicleService)
        {
            _vehicleService = vehicleService;
        }
        [HttpPost]
        public async Task<IActionResult> AddVehicle(VehicleDto vehicledto)
        {
            bool Isvehicle = await _vehicleService.IsVehicleExistsAsync(vehicledto.VehicleNumber);
            if(Isvehicle)
            {
                return BadRequest("Vehicle Already exists");
            }
            var vehicle =_vehicleService.AddVehicleAsync(vehicledto);
            if (vehicle == null) return BadRequest("Error Occured");
         
            return Ok("Vehicle added Successfully");
            //var vehicle = new Vehicle
            //{
            //    VehicleNumber = vehicledto.VehicleNumber,
            //    Model = vehicledto.Model,
            //    Capacity = vehicledto.Capacity
            //};
            //_appDbContext.Vehicles.Add(vehicle);
            //_appDbContext.SaveChanges();
            //return Ok("Vehicle added Successfully");


        }

        [HttpGet("all")]
        public async Task<IActionResult> GetVehicles()
        {
            try
            {
                var vehicles = _vehicleService.GetAllVehiclesAsync();
                return Ok(vehicles);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            

        }

        [HttpGet("{vehicleId}")]
        public async Task<IActionResult> GetVehicleById(int vehicleId)
        {
            try
            {
                var vehicle =await _vehicleService.GetVehicleByIdAsync(vehicleId);
                if (vehicle == null) return NotFound();
                return Ok(vehicle);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }




        [HttpPut("{vehicleId}")]
        public async Task<IActionResult> UpdateVehicle(int vehicleId, VehicleDto vehicledto)
        {
            try
            {
                var vehicle = await _vehicleService.UpdateVehicleAsync(vehicleId,vehicledto);
                if (vehicle == null) return NotFound();
                return Ok(vehicle);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
          
            
        }

        [HttpDelete("{vehicleId}")]
        public async Task<IActionResult> DeleteVehicle(int vehicleId)
        {
            try
            {
                var vehicle = await _vehicleService.DeleteVehicleAsync(vehicleId);
                if (!vehicle) return BadRequest("Error occured");
                return Ok("Vehicle Deleted Successfully");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            

        }
    }
}
