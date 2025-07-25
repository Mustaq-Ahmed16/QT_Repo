using System.Text.Json.Serialization;

namespace DriverTripScheduleApp.Models
{
    public class User
    {
        public int UserId { get; set; }

        public string Email { get; set; }
        public string Password { get; set; }

        public string? Role { get; set; }

        [JsonIgnore]
        public Driver Driver { get; set; }

        [JsonIgnore]
        public FleetManager FleetManager { get; set; }


    }
}
