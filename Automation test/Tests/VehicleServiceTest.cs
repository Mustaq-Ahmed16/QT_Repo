using OpenQA.Selenium;

namespace DriverTripSchedulerAutomationTest;

public class VehicleServiceTest:DriverSetup
{
    private string baseUrl = "http://localhost:5173";
    [Test]
    public void AddUpdateDeleteVehicle()
    {
        driver.Navigate().GoToUrl($"{baseUrl}/login");
        driver.FindElement(By.Id("email")).SendKeys("mus@gmail.com");
        driver.FindElement(By.Id("password")).SendKeys("mus123");
        driver.FindElement(By.Id("loginbtn")).Submit();
        wait.Until(d => d.Url.Contains("/manager"));

        driver.FindElement(By.XPath("//*[@id=\"root\"]/div/aside/button[3]")).Click();
        //driver.FindElement(By.XPath("/html/body/div/div/main/div/div/div/div[1]/button")).Click();
        //driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[1]")).SendKeys("MP479854");
        //driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[2]")).SendKeys("Swift Dzire");
        //driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[3]")).SendKeys("5");
        //Thread.Sleep(1000);
        //driver.FindElement(By.XPath("/html/body/div[3]/div[3]/button[2]")).Click();


        Thread.Sleep(2000);
        //driver.FindElement(By.XPath("/html/body/div[3]/div[3]/button[1]")).Click();

        //driver.FindElement(By.XPath("/html/body/div/div/main/div/div/div/div[2]/table/tbody/tr[1]/td[5]/button[1]")).Click();

        //driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[1]")).SendKeys("UP649685");
        //driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[2]")).SendKeys("Nano");
        //driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[3]")).SendKeys("4");

        //Thread.Sleep(2000);
        //driver.FindElement(By.XPath("/html/body/div[3]/div[3]/button[2]")).Click();
        //Thread.Sleep(2000);

        // delete vehicle
        driver.FindElement(By.XPath("//*[@id=\"root\"]/div/main/div/div/div/div[2]/table/tbody/tr[1]/td[5]/button[2]")).Click();

        IAlert alert = driver.SwitchTo().Alert();

        // Accept the alert (click OK)
        alert.Accept();


    }


}
