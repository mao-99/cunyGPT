import time
import csv
from bs4 import BeautifulSoup
from seleniumbase import BaseCase

class CourseDescriptionTest(BaseCase):
    def test_course_descriptions(self):
        # Open the initial page
        self.open("https://globalsearch.cuny.edu/CFGlobalSearchTool/search.jsp")

        # Select all colleges
        self.execute_script("document.getElementById('magicpowerpd').click();")

        # Select the term (example: Fall 2024)
        self.select_option_by_value("#t_pd", "1249")  # Replace with the actual term value

        # Click the 'Next' button
        self.click('input[name="next_btn"]')

        # Test with just two courses
        courses = [
                    "POLS",
                   "POLI", "POSC", "POTE", "PORT", "PRMA", "PSYC", "PUAD", "PUAF", "PUHE", "EDPU", "PUPO", "PUNA", "PRST",
                   "PRLS", "QUAN", "QUME", "RASA", "RATE", "REES", "RECR", "EDRP", "REOR", "REHA", "RELG", "RELI", "RESE",
                   "RSMT", "RETH", "REDE", "RUSS", "RUAS", "SEEK", "SPCL", "SCPS", "SCSW", "SCIE", "EDSC", "SCED", "SECU",
                   "SEXU", "BUSE", "SOBS", "SOEI", "SOSC", "SOSR", "SOWE", "SOWO", "SOCI", "SPAN", "EDSA", "SPED", "SPEE",
                   "SPEC", "SPTH", "SPET", "SPEV", "STAT", "STAF", "STDV", "STHR", "STAB", "SUTE", "SUST", "TREM", "TAXA",
                   "EDTC", "TECH", "TELE", "THEA", "THAR", "TPRE", "TOHO", "TOXI", "TROR", "TRAS", "TRTO", "UNST", "UBAF",
                   "UBPL", "UBST", "VETE", "VATC", "WEIU", "WGST", "WOST", "GWSS", "WGAC", "WKST", "WORK", "MATW", "WOCI",
                   "WOCL", "WOFL", "WOHU", "WOLI", "WRIT", "YOST"]

        # Save the original tab handle
        original_window = self.driver.current_window_handle

        # Open CSV file in write mode
        with open('course_descriptions3.csv', 'w', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow(['Course', 'College', 'Description'])  # Write header row

            for course in courses:
                # Wait for the subject dropdown to become visible and select course subject
                self.wait_for_element_visible("#subject_ld")
                self.select_option_by_value("#subject_ld", course)

                # Wait for the course career dropdown to become visible and select 'UGRD'
                self.wait_for_element_visible("#courseCareerId")
                self.select_option_by_value("#courseCareerId", "UGRD")

                # Click the search button
                self.execute_script('document.getElementById("search_new_spin").click();')

                # Optionally, add a small delay to ensure content is fully loaded
                time.sleep(2)  # You can adjust or replace this with a more reliable wait condition

                # Extract page source and parse with BeautifulSoup
                html_source = self.get_page_source()
                soup = BeautifulSoup(html_source, 'html.parser')

                # Find all tables with class "classinfo"
                tables = soup.find_all('table', class_='classinfo')

                for table in tables:
                    # Find all rows in the tbody
                    rows = table.find_all('tr')

                    for r, row in enumerate(rows):
                        # Find the first column (Class column) in each row
                        first_column = row.find('td')

                        if first_column:
                            # Find the link in the first column
                            link = first_column.find('a')
                            if link:
                                
                                # Get the href attribute of the link
                                href = link.get('href')
                                # print(f"Navigating to: {href}")  # Optional: Print the link

                                # Open the link in a new tab
                                self.driver.execute_script(f"window.open('{href}', '_blank');")
                                
                                # Switch to the new tab
                                self.driver.switch_to.window(self.driver.window_handles[-1])

                                # Wait for the new tab to load
                                time.sleep(2)  # Adjust this wait time as needed
                                html_source = self.get_page_source()
                                soup = BeautifulSoup(html_source, 'html.parser')

                                # Extract course information
                               
                                description = soup.find_all('table', border='0', style='border-style:none')[4].find('tbody').find('tr').find('td').text.strip()
                                course_title = soup.find('div', class_='shadowbox').find_all('p')[0].text.strip()
                                college = soup.find('div', class_='shadowbox').find_all('p')[1].text.strip()

                                # print(f"Course Title: {course_title}")
                                # print(f"College: {college}")
                                # print(f"Description: {description}")


                                # Write to CSV file
                                writer.writerow([course_title, college, description])

                                # Close the current tab
                                self.driver.close()

                                # Switch back to the original tab
                                self.driver.switch_to.window(original_window)

                # Go back to the previous state
                self.execute_script("window.history.go(-1)")

# To execute the test script
if __name__ == "__main__":
    from seleniumbase import SB
    with SB() as sb:
        CourseDescriptionTest().test_course_descriptions()


#TO BE Scraped: 
#Management, Nursing, Physics