using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.IRepositories;
using DriverTripScheduleApp.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;



namespace DriverTripScheduleApp.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        public AuthService(AppDbContext context, IConfiguration configuration,ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            _logger.LogInformation("Verifying the email:{Email} if already exists or not", email);
            var isExists = await _context.Users.AnyAsync(u => u.Email == email);
            Console.WriteLine(isExists);
            return isExists;
        }
        private bool VerifyManager(string secretKey)
        {
            const string managerKey = "Fleet@2004";
            if (secretKey != managerKey)
            {
                return false;
            }
            return true;
        }
        public async Task<User> RegisterUserAsync(RegisterDto registerDto)
        {
            if (registerDto.Role == "FleetManager")
            {
                var isManager = VerifyManager(registerDto.SecretKey);
                if (!isManager) return null;
            }
                
            var email = await IsEmailExistsAsync(registerDto.Email);
            if (email == null)
            {
                _logger.LogWarning("Email doesnot exist");
                return null;
            }
            _logger.LogInformation("Attempting Register for {Email}", registerDto.Email);
            var user = new User
            {

                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Username = registerDto.Name,
                Role = registerDto.Role,
            };
            _context.Users.Add(user);
            _context.SaveChanges();
            _logger.LogInformation("Register Successful for {Email}",registerDto.Email);

            if (registerDto.Role == "Driver")
            {
                _context.Drivers.Add(new Driver { UserId = user.UserId, Name = registerDto.Name, LicenseNumber = registerDto.LicenseNumber });
            }
            else if (registerDto.Role == "FleetManager")
            {
                _context.FleetManagers.Add(new FleetManager { UserId = user.UserId, Name = registerDto.Name });
            }
            _context.SaveChanges();
            _logger.LogInformation("Successfully Register User for {Email} as {Role}", registerDto.Email, registerDto.Role);

            return user;


        }
        public async Task<User> LoginUserAsync(LoginDto logindto)
        {
            _logger.LogInformation("Attempting login for {Email}", logindto.Email);
            var user = _context.Users.FirstOrDefault(u => u.Email == logindto.Email);
         
            if (user == null || !BCrypt.Net.BCrypt.Verify(logindto.Password, user.Password))
            {
                _logger.LogWarning("Login failed:User not found for {Email}",logindto.Email);
                return null;
            }
            _logger.LogInformation("Login Successfull for {Email}", logindto.Email);
            return (user);
        }
        public async Task<string> GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.Role,user.Role)
            };
            var keyString = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(keyString))
            {
                throw new InvalidOperationException("Jwt Key  is not configured");
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public async Task<Driver> RegisterDriverAsync(RegisterDriverDto registerdto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerdto.Email))
            {
                return null;
            }
            _logger.LogInformation("Attempting registering Driver by manager for {Email}", registerdto.Email);
            var user = new User
            {
                Email = registerdto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerdto.Password),
                Username=registerdto.Name,
                Role = "Driver"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            var driver = new Driver{ UserId = user.UserId, Name = registerdto.Name, LicenseNumber = registerdto.LicenseNumber };

            _context.Drivers.Add(driver);
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Registered Driver : {registerdto.Name}");
            return driver;
        }


       
    }
}
