using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using SeleniumExtras.WaitHelpers;

namespace DriverTripSchedulerAutomationTest;

public class TripTests : DriverSetup
{
    private string baseUrl = "http://localhost:5173";
    [Test]
    public void AddTripTest()
    {
        // SETUP
        driver.Navigate().GoToUrl($"{baseUrl}/login");
        driver.FindElement(By.Id("email")).SendKeys("mus@gmail.com");
        driver.FindElement(By.Id("password")).SendKeys("mus123");
        driver.FindElement(By.Id("loginbtn")).Submit();
        wait.Until(d => d.Url.Contains("/manager"));

        // ---------- STEP 1: ADD NEW TRIP ----------
        wait.Until(driver => driver.FindElement(By.XPath("//*[@id=\"addTripBtn\"]"))).Click();



       
        // Step 2: Select Driver
        driver.FindElement(By.XPath("//button[contains(., 'Select Driver')]")).Click();
        driver.FindElement(By.XPath("//div[contains(@class, 'SelectItem') and contains(., '1. John Doe')]")).Click(); // Replace with actual driver text

        // Step 3: Select Vehicle
        driver.FindElement(By.XPath("//button[contains(., 'Select Vehicle')]")).Click();
        driver.FindElement(By.XPath("//div[contains(@class, 'SelectItem') and contains(., 'KA01AB1234')]")).Click(); // Replace with actual vehicle number

        // Step 4: Fill in Origin and Destination
        driver.FindElement(By.Name("origin")).SendKeys("Bangalore");
        driver.FindElement(By.Name("destination")).SendKeys("Mysore");

        // Step 5: Fill in Trip Start and End
        driver.FindElement(By.Name("tripStart")).SendKeys("2025-08-01T10:00");
        driver.FindElement(By.Name("tripEnd")).SendKeys("2025-08-01T14:00");

        // Step 6: Click Submit
        driver.FindElement(By.Id("submit-btn")).Click();







    }

    [Test]
    public void EdiTrip()
    {
        driver.Navigate().GoToUrl($"{baseUrl}/login");
        driver.FindElement(By.Id("email")).SendKeys("mus@gmail.com");
        driver.FindElement(By.Id("password")).SendKeys("mus123");
        driver.FindElement(By.Id("loginbtn")).Submit();
        wait.Until(d => d.Url.Contains("/manager"));

        driver.FindElement(By.XPath("//*[@id=\"root\"]/div/main/div/div/div/div[2]/table/tbody/tr[3]/td[10]/button[1]")).Click();
        driver.FindElement(By.Name("tripStart")).SendKeys("10/02/2025 10:00 AM");
        driver.FindElement(By.Name("tripEnd")).SendKeys("10/01/2025 10:00 AM");

        driver.FindElement(By.XPath("//*[@id=\"submit-btn\"]")).Click();

        //Assert.IsTrue(driver.PageSource.Contains("✅ Trip updateed successfully"));

        // ---------- STEP 3: DELETE TRIP ----------




        //driver.FindElement(By.XPath(" * [@id = \"root\"] / div / main / div / div / div / div[2] / table / tbody / tr[5] / td[10] / button[2]")).Click();
        //Assert.IsTrue(driver.PageSource.Contains("🗑️ Trip deleted"));
    }

    [Test]
    public void DeleteTrip()
    {
        driver.Navigate().GoToUrl($"{baseUrl}/login");
        driver.FindElement(By.Id("email")).SendKeys("mus@gmail.com");
        driver.FindElement(By.Id("password")).SendKeys("mus123");
        driver.FindElement(By.Id("loginbtn")).Submit();
        wait.Until(d => d.Url.Contains("/manager"));
        driver.FindElement(By.XPath("//*[@id=\"root\"]/div/main/div/div/div/div[2]/table/tbody/tr[3]/td[10]/button[2]")).Click();
        
    }

}
