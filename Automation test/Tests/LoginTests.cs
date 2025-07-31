namespace DriverTripSchedulerAutomationTest;

public class LoginTests:DriverSetup
{
    

    [Test]
    public void TestLoginWithValidCredentials()
    {
        driver.Navigate().GoToUrl("http://localhost:5173/login");

        var loginPage = new LoginPage(driver);

        
        loginPage.EnterEmail("mus@gmail.com");
        Thread.Sleep(2000);
        loginPage.EnterPassword("mus123");

        loginPage.ClickLoginButton();
        Thread.Sleep(2000);
        Assert.That(driver.Url.Contains("manager"));
        Thread.Sleep(2000);
    }

    [Test]
    public void TestLoginWithInvalidEmail_ShouldFail()
    {
        driver.Navigate().GoToUrl("http://localhost:5173/login");
        var loginPage = new LoginPage(driver);

        loginPage.EnterEmail("sumit@gmail.com");
        Thread.Sleep(2000);
        loginPage.EnterPassword("mus123");

        loginPage.ClickLoginButton();
        Thread.Sleep(2000);
        Assert.IsTrue(driver.PageSource.Contains("Login error. Please try again later"));
        Thread.Sleep(2000);
    }
    [Test]
    public void TestLoginWithInvalidPassword_ShouldFail()
    {
        driver.Navigate().GoToUrl("http://localhost:5173/login");
        var loginPage = new LoginPage(driver);

        loginPage.EnterEmail("mus@gmail.com");
        Thread.Sleep(2000);
        loginPage.EnterPassword("123456");

        loginPage.ClickLoginButton();
        Thread.Sleep(2000);
        Assert.IsTrue(driver.PageSource.Contains("Login error. Please try again later"));
        Thread.Sleep(2000);
    }
}
