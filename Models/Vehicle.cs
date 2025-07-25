namespace DriverTripScheduleApp.Models
{
    public class Vehicle
    {
        public int VehicleId { get; set; }

        public string VehicleNumber { get; set; }

        public string Model { get; set; }

        public int Capacity { get; set; }

        public ICollection<Trip> Trips { get; set; }



    }
}
