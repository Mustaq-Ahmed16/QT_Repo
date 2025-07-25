using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.IRepositories;
using DriverTripScheduleApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace DriverTripScheduleApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        
        private readonly ILogger<AuthController> _logger;
        
        private readonly IAuthService _authService;
        public AuthController(ILogger<AuthController> logger,IAuthService authService)
        {
            _authService = authService;
            _logger = logger;
         
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                if (registerDto == null)
                {
                    return NotFound();
                }

                var user =await _authService.RegisterUserAsync(registerDto);
                if(user==null) return NotFound();
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto logindto)
        {
            try
            {
                if (logindto == null) return NotFound();
                var user = await _authService.LoginUserAsync(logindto);
                if(user==null) return NotFound();
                var token = await _authService.GenerateToken(user);
                if(token==null) return NotFound("Token not found");
                return Ok(new AuthResponseDto { User = user,Token=token});
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
           

        }

        //private string GenerateToken(User user)
        //{
        //    var claims = new[]
        //    {
        //        new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
        //        new Claim(ClaimTypes.Email,user.Email),
        //        new Claim(ClaimTypes.Role,user.Role)
        //    };
        //    var keyString = _configuration["Jwt:Key"];
        //    if (string.IsNullOrEmpty(keyString))
        //    {
        //        throw new InvalidOperationException("Jwt Key  is not configured");
        //    }
        //    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));
        //    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        //    var token = new JwtSecurityToken(
        //        issuer: _configuration["Jwt:Issuer"],
        //        audience: _configuration["Jwt:Audience"],
        //        claims: claims,
        //        expires: DateTime.Now.AddHours(1),
        //        signingCredentials: creds);
        //    return new JwtSecurityTokenHandler().WriteToken(token);

        //}

        [HttpPost("register-driver")]
        public async Task<IActionResult> RegisterDriver([FromBody] RegisterDto registerdto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(registerdto.Email) || string.IsNullOrWhiteSpace(registerdto.Password))
                {
                    return BadRequest("Email and Password are required.");

                }
                
                var driver = await _authService.RegisterDriverAsync(registerdto);
                return Ok(driver);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            

        }
    }
}
