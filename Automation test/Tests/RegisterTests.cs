using DriverTripSchedulerAutomationTest.authPages;
using OpenQA.Selenium.Support.UI;

namespace DriverTripSchedulerAutomationTest;

public class RegisterTests:DriverSetup
{
    
   

    [Test]
    public void TestRegisterNewUserFleetManager()
    {
        driver.Navigate().GoToUrl("http://localhost:5173/register");
        var registerPage = new RegisterPage(driver);

        registerPage.EnterName("ABC");
        registerPage.EnterEmail("abc@gmail.com");
        registerPage.EnterPassword("abc123");
        registerPage.EnterLincense("LIC784920");
        Thread.Sleep(2000);
        registerPage.SelectRole("FleetManager");
        registerPage.EnterKey("Fleet@2004");
        registerPage.ClickRegisterBtn();
        Thread.Sleep(2000);
     
        Assert.That(driver.Url.Contains("login"));
    }
    [Test]
    public void TestRegisterNewUserDriver()
    {
        driver.Navigate().GoToUrl("http://localhost:5173/register");
        var registerPage = new RegisterPage(driver);

        registerPage.EnterName("Alex");
        registerPage.EnterEmail("alex@gmail.com");
        Thread.Sleep(1000);
        registerPage.EnterPassword("alex123");
        registerPage.EnterLincense("LIC798410");
        Thread.Sleep(1000);
        registerPage.SelectRole("Driver");
        registerPage.ClickRegisterBtn();
        Thread.Sleep(1000);
        Assert.That(driver.Url.Contains("login"));
    }
}
