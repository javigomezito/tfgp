import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

class PythonOrgSearch(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()

    def test_search_in_python_org(self):
        driver = self.driver
        driver.get("http://localhost:8080")
        #self.assertIn("Python", driver.title)
        name = driver.find_element_by_name("nombre")
        password = driver.find_element_by_name("password")
        name.send_keys("pycon")
        #name.send_keys(Keys.RETURN)
        password.send_keys("test")
        password.send_keys(Keys.RETURN)
        #assert "No results found." not in driver.page_source
        nombres = driver.find_element_by_name("pycon")
        print(nombres)
        self.assertIsNotNone(nombres)

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()