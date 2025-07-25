namespace DriverTripScheduleApp.Models
{
    public class FleetManager
    {
        public int FleetManagerId { get; set; }

        public int UserId { get; set; }

        public string Name { get; set; }

        public User User { get; set; }

        public ICollection<Trip> Trips { get; set; }
    }
}
