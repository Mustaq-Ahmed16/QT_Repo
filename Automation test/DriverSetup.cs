using OpenQA.Selenium;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Support.UI;


namespace DriverTripSchedulerAutomationTest
{
    public class DriverSetup:IDisposable
    {
        protected IWebDriver driver;
        protected WebDriverWait wait;
        [SetUp]
        public void StartBrowser()
        {
            EdgeOptions options = new EdgeOptions();
            options.AddArgument("start-maximized");
            driver = new EdgeDriver(options);
            wait = new WebDriverWait(driver,TimeSpan.FromSeconds(5));
        }

        [TearDown]
        public void CloseBrowser()
        {
            Dispose();
        }
        public void Dispose()
        {
            driver?.Quit();
            driver?.Dispose();
        }
    }
}
