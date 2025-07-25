using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.Models;

namespace DriverTripScheduleApp.IRepositories
{
    public interface IAuthService
    {
        Task<User> RegisterUserAsync(RegisterDto registerDto);
        Task<User> LoginUserAsync(LoginDto loginDto);
        Task<string> GenerateToken(User user);
        Task<Driver> RegisterDriverAsync(RegisterDto registerdto);
        Task<bool> IsEmailExistsAsync(string email);
    }
}
