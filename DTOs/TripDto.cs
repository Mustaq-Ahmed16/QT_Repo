using DriverTripScheduleApp.Models;

namespace DriverTripScheduleApp.DTOs
{
    public class TripDto
    {
       
        public string Origin { get; set; }

        public string Destination { get; set; }

        public DateTime TripStartTime { get; set; }
        public DateTime TripEndTime { get; set; }

        public int DriverId { get; set; }
        public int VehicleId { get; set; }
    }
}
