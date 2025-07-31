using OpenQA.Selenium;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DriverTripSchedulerAutomationTest.authPages
{
    public class RegisterPage
    {
        private readonly IWebDriver driver;

        public RegisterPage(IWebDriver driver)
        {
            this.driver = driver;
        }

        
        private IWebElement NameInput => driver.FindElement(By.Id("name"));
        private IWebElement EmailInput => driver.FindElement(By.Id("email"));
        private IWebElement PasswordInput => driver.FindElement(By.Id("password"));
        private IWebElement LincenseInput => driver.FindElement(By.Id("license"));
      
        private IWebElement RoleSelect => driver.FindElement(By.Id("role"));
        private IWebElement KeyInput => driver.FindElement(By.Id("adminkey"));
        private IWebElement RegisterBtn => driver.FindElement(By.Id("registerbtn"));
        
        
        public void EnterName(string name) => NameInput.SendKeys(name);
        public void EnterEmail(string email)=>EmailInput.SendKeys(email);
        
        public void EnterPassword(string password)=>PasswordInput.SendKeys(password);   

        public void EnterLincense(string license)=>LincenseInput.SendKeys(license);
        public void SelectRole(string role)=> RoleSelect.SendKeys(role);
        public void EnterKey(string key)=>KeyInput.SendKeys(key);
        public void ClickRegisterBtn()=>RegisterBtn.Submit();


    }
}
