﻿namespace DriverTripScheduleApp.DTOs
{
    public class RegisterDto
    {
        
        public string Email { get; set; }
        public string Password { get; set; }

        public string? Role { get; set; }

        public string Name { get; set; }
        public string? LicenseNumber { get; set; }
    }
}
