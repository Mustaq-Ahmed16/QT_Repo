namespace DriverTripScheduleApp.Models
{
    public class Driver
    {
        public int DriverId { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }

        public string LicenseNumber { get; set; }

        public User User { get; set; }
        public ICollection<Trip> Trips { get; set; }
        
    }
}
