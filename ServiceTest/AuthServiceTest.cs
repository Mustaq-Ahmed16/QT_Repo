using Castle.Core.Logging;
using DriverTripScheduleApp.Data;
using DriverTripScheduleApp.DTOs;
using DriverTripScheduleApp.Models;
using DriverTripScheduleApp.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace DriverTripScheduleAppTest;

[TestClass]
public class AuthServiceTest
{
    private AuthService _authService;
    private AppDbContext _appDbContext;
    private IConfiguration _configuration;
    private Mock<ILogger<AuthService>> _loggerMock;


    [TestInitialize]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase(databaseName: "AuthTestdb").Options;

        _appDbContext = new AppDbContext(options);

        // Mock configure
        var inMemorySettings = new Dictionary<string, string> { { "Jwt:Key", "Thisissecretkeyfortokenbweyvcwuv783293874bdxuiqn" }, { "Jwt:Issuer", "TestIssuer" }, { "Jwt:Audience", "TestAudience" } };

        _configuration = new ConfigurationBuilder().AddInMemoryCollection(inMemorySettings).Build();
        _loggerMock = new Mock<ILogger<AuthService>>();
        _authService =new AuthService(_appDbContext, _configuration,_loggerMock.Object);

    }

    [TestMethod]
    public async Task RegisterUserAsync_ShouldRegisterNewUser()
    {
        //Arrange
        var registerDto = new RegisterDto
        {
            Email = "mustaq@gmail.com",
            Password = "mus123",
            Role = "FleetManager",
            Name="Mustaq",
            LicenseNumber="LIC675936",
            SecretKey="Fleet@2004"


        };

        //Act
        var result = await _authService.RegisterUserAsync(registerDto);

        //Assert
        Assert.IsNotNull(result);
        Assert.AreEqual(registerDto.Email, result.Email);
        Assert.AreEqual("FleetManager", result.Role);

    }

    [TestMethod]
    public async Task IsEmailExistsAsync_ShouldReturnTrue_IfEmailExists()
    {
        var user = new User { UserId=2,Username="John", Email = "john@gmail.com", Password = "john123", Role = "FleetManager" };
        _appDbContext.Users.Add(user);
        await _appDbContext.SaveChangesAsync();

        //Act
        var exists = await _authService.IsEmailExistsAsync("john@gmail.com");
        Console.WriteLine(exists);
        Assert.IsTrue(exists);

    }

    [TestMethod]
    public async Task LoginUserAsync_ShouldReturnUser_WhenCredentialsValid()
    {
        //Arrange
        var password = BCrypt.Net.BCrypt.HashPassword("password123");
        var user = new User { UserId=3,Username="Test",Email = "testuser@gmail.com", Password = password, Role = "Driver" };
        _appDbContext.Users.Add(user);
        await _appDbContext.SaveChangesAsync();

        var loginDto = new LoginDto { Email = "testuser@gmail.com", Password = "password123" };

        //Act
        var result = await _authService.LoginUserAsync(loginDto);
        
        //Assert
        Assert.IsNotNull(result);

        Assert.AreEqual("testuser@gmail.com", result.Email);
    }
    [TestMethod]
    public async Task GenerateToken_ShouldReturnToken()
    {
        // arrange

        var user = new User {UserId=1, Email = "mustaq@gmail.com",Password="mus123", Role = "FleetManager" };

        //act
        var token = await _authService.GenerateToken(user);

        //assert
        Assert.IsFalse(string.IsNullOrWhiteSpace(token));


      
    }

    [TestMethod]
    public async Task RegisterDriverAsync_ShouldRegisterDriver()
    {
        //arrange
        var dto = new RegisterDriverDto { Email = "driver@gmail.com", Password = "pass123", Name = "DriverOne", LicenseNumber = "DL64682"};

        var isExistsDriver = await _authService.IsEmailExistsAsync(dto.Email);
        Assert.IsFalse(isExistsDriver);
        var user =await _authService.RegisterDriverAsync(dto);
        await _appDbContext.SaveChangesAsync();

        //var driver = new Driver { UserId = user.UserId, Name = dto.Name, LicenseNumber = dto.LicenseNumber };
        //_appDbContext.Drivers.Add(driver);
        //await _appDbContext.SaveChangesAsync();

        Assert.IsNotNull(user);
        Assert.AreEqual("DriverOne", user.Name);
    }
}
