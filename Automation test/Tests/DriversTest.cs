using OpenQA.Selenium;

namespace DriverTripSchedulerAutomationTest;

public class DriversTest:DriverSetup
{
    private string baseUrl = "http://localhost:5173";
    [Test]
    public void RegisterDriver()
    {
        driver.Navigate().GoToUrl($"{baseUrl}/login");
        driver.FindElement(By.Id("email")).SendKeys("mus@gmail.com");
        driver.FindElement(By.Id("password")).SendKeys("mus123");
        driver.FindElement(By.Id("loginbtn")).Submit();
        wait.Until(d => d.Url.Contains("/manager"));

        driver.FindElement(By.XPath("//*[@id=\"root\"]/div/aside/button[2]")).Click();
        driver.FindElement(By.XPath("//*[@id=\"root\"]/div/main/div/div[2]/div/div[1]/button")).Click();
        driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[1]")).SendKeys("Kumar");
        driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[2]")).SendKeys("LIC784750");
        driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[3]")).SendKeys("kumar@gmail.com");
        driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[4]")).SendKeys("kumar123");
        driver.FindElement(By.XPath("/html/body/div[3]/div[3]/button[2]")).Click();
           
    }

    [Test]
    public void EditDriver()
    {
        
        driver.Navigate().GoToUrl($"{baseUrl}/login");
        driver.FindElement(By.Id("email")).SendKeys("mus@gmail.com");
        driver.FindElement(By.Id("password")).SendKeys("mus123");
        driver.FindElement(By.Id("loginbtn")).Submit();
        wait.Until(d => d.Url.Contains("/manager"));

        driver.FindElement(By.XPath("//*[@id=\"root\"]/div/aside/button[2]")).Click();
        Thread.Sleep(1000);
        driver.FindElement(By.XPath("/html/body/div/div/main/div/div[2]/div/div[2]/table/tbody/tr[1]/td[4]/button[1]")).Click();
        driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[1]")).SendKeys("Kumar");
        driver.FindElement(By.XPath("/html/body/div[3]/div[2]/input[1]")).SendKeys("LIC784750");
       
        driver.FindElement(By.XPath("/html/body/div[3]/div[3]/button[2]")).Click();
    }

    [Test]
    public void DeleteDriver()
    {
        driver.Navigate().GoToUrl($"{baseUrl}/login");
        driver.FindElement(By.Id("email")).SendKeys("mus@gmail.com");
        driver.FindElement(By.Id("password")).SendKeys("mus123");
        driver.FindElement(By.Id("loginbtn")).Submit();
        wait.Until(d => d.Url.Contains("/manager"));

        driver.FindElement(By.XPath("//*[@id=\"root\"]/div/aside/button[2]")).Click();

        Thread.Sleep(1000);
        driver.FindElement(By.XPath("//*[@id=\"root\"]/div/main/div/div[2]/div/div[2]/table/tbody/tr[2]/td[4]/button[2]")).Click();
    }
}
