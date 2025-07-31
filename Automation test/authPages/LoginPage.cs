

using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;

namespace DriverTripSchedulerAutomationTest;

public class LoginPage
{

    private readonly IWebDriver driver;
    public LoginPage(IWebDriver driver)
    {
        this.driver = driver;
    }
   

    private IWebElement EmailInput => driver.FindElement(By.Id("email"));
    private IWebElement PasswordInput => driver.FindElement(By.Id("password"));

    private IWebElement LoginButton => driver.FindElement(By.Id("loginbtn"));

  

    public void EnterEmail(string email)
    {
        EmailInput.SendKeys(email);
    }
    public void EnterPassword(string password)
    {
        PasswordInput.SendKeys(password);
    }
    public void ClickLoginButton()
    {
        LoginButton.Submit();
    }

}
