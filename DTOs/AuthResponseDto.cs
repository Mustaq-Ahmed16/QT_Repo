using DriverTripScheduleApp.Models;

namespace DriverTripScheduleApp.DTOs
{
    public class AuthResponseDto
    {
        public User User { get; set; }

        public string Token { get; set; }
    }
}
