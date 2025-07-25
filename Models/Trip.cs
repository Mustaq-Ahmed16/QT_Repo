using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DriverTripScheduleApp.Models
{
    public class Trip
    {
        public int TripId { get; set; }
        public string Origin { get; set; }

        public string Destination { get; set; }

        public DateTime TripStartTime { get; set; }
        public DateTime TripEndTime { get; set; }
        public DateTime SubmissionDate { get; set; }

      
        public int DriverId { get; set; }
        public int VehicleId { get; set; }
        public int FleetManagerId { get; set; }

        [JsonIgnore]
        [ForeignKey("DriverId")]
        public Driver Driver { get; set; }

        [JsonIgnore]
        [ForeignKey("VehicleId")]
        public Vehicle Vehicle { get; set; }

        [JsonIgnore]
        [ForeignKey("FleetManagerId")]
        public FleetManager FleetManager { get; set; }
        



    }
}
