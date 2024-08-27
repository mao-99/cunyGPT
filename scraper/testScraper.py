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
        courses = ["ACLS", "ACCT", "ADSE", "AFAS", "AFST", "APLS", "AMNH", "ASLG", "AMST", "ANCU", "ANCM", "ANMG", "ANTH",
                   "ANTC", "ANTP", "ARAB", "ARCT", "ARCE", "ARCH", "ARCL", "ARTX", "ARTC", "ARTH", "ARTL", "ARTS", "ARDR",
                   "ARIM", "ARNM", "ARVP", "ASAM", "ASTR", "AUDI", "AUSD", "AUTE", "AVMA", "BENG", "BICH", "BIOM", "BISC",
                   "BIOL", "EGBI", "BIOS", "BIOT", "BLST", "BOTA", "BUSI", "BUTF", "BUAD", "BUDA", "BUIS", "BUIT", "BUIN",
                   "BUMA", "BUPO", "BULA", "BUFA", "STRE", "STRM", "STRT", "CAPS", "CPR", "CAST", "EGCH", "CHEM", "EDCH",
                   "CBSE", "EDCS", "CHIN", "CIST", "EGCI", "CCAR", "CMAL", "CLAS", "CLLS", "CLTM", "CONE", "CODI", "CNOW",
                   "CASD", "CODE", "COSC", "COST", "COMM", "COMT", "COHE", "CHSS", "COBL", "COLI", "EGCT", "CMGI", "CMIS",
                   "CMLI", "CMPR", "CMSC", "CMST", "COTE", "COOP", "CORE", "COAD", "COUN", "COHS", "CUED", "CREO", "CJST",
                   "CJMA", "CTTH", "CTTN", "ARCU", "CUDI", "CUTE", "CYNE", "DANC", "DAAN", "DANA", "DAPR", "DASC", "DEHY",
                   "DENT", "DEES", "DESI", "DESK", "DIET", "DIDE", "DIHU", "DILI", "MUDI", "DISB", "DRAT", "DRAM", "ECED",
                   "ECAE", "EESC", "EASC", "EAST", "ECHO", "ECON", "EDES", "EDIL", "EDUC", "EDLA", "EDAB", "EDAR", "EDBL",
                   "EDBI", "EDBM", "EDCN", "EDCI", "EDCO", "EDCU", "EDDA", "EDEC", "EDEM", "EDHE", "EDLT", "EDMA", "EDMH",
                   "EDMS", "EDRE", "EDRC", "EDSE", "EDSP", "EDSU", "EDET", "EDUB", "EDFO", "EDPS", "EGEL", "ELET", "ELTE",
                   "EMET", "EECE", "EMMS", "EMSA", "EMMT", "EGNG", "ENSC", "ENGL", "ENSL", "EGEC", "MAEN", "ENTM", "ENTR",
                   "EVOH", "EVCT", "EVHC", "EVJS", "EVSC", "EVST", "EPID", "ETHN", "EURO", "EXSC", "FAMA", "FNES", "FASH",
                   "FADE", "FETH", "FILM", "FITV", "FINA", "ARFI", "ARFP", "FISC", "FOST", "FNPH", "CMFO", "FOSC", "FREN",
                   "FROR", "FRSE", "GADE", "GARD", "ARGL", "GNST", "GEPP", "GSCI", "GEST", "GEIS", "GEOG", "GEOP", "GETE",
                   "GEOL", "GEGE", "GERM", "GESS", "GERO", "GEMS", "GLST", "GOVT", "GRSR", "GREK", "GRKA", "GRKM", "HACR",
                   "EDHP", "HECM", "HLED", "HEHU", "HEIM", "HITE", "HEPM", "HPGC", "HESC", "HESA", "HENS", "HEBR", "HIST",
                   "HISA", "HISE", "HISU", "HISW", "HONR", "HONS", "HORT", "HOMA", "HUBI", "HURE", "HURI", "HUSE", "HUMA",
                   "HUJU", "LAWI", "INDE", "IBAP", "INDT", "INSI", "INSU", "INTG", "INTP", "INTE", "CRIN", "INMS", "INRE",
                   "INST", "INCL", "IRIS", "ITAL", "JAPA", "JAST", "JAZZ", "JWST", "JOUR", "JUST", "KORE", "LBST", "LAMG",
                   "LADE", "LNST", "LANG", "LATI", "LACS", "LAST", "LAW", "LAWP", "LAWS", "EDLE", "LESP", "LIAR", "LASE",
                   "LIAS", "LIST", "LIBR", "LISC", "LIBT", "LING", "EDLI", "LITE", "MAHC", "MAOM", "MANA", "MAST", "MATE",
                   "MARK", "MACO", "MSTH", "MATH", "MAED", "EGME", "EGMT", "MEDI", "MATC", "MECO", "MEPA", "MEST", "METC",
                   "EDME", "MELS", "MDLT", "MELE", "MDTC", "MDCN", "MDST", "MEHE", "MESG", "MEAS", "EDMI", "MILI", "MODL",
                   "MVMT", "MOSC", "MMDE", "MSST", "MUSI", "MUSH", "MUSP", "MUSR", "MUST", "NASS", "NEUR", "NEME", "NURS",
                   "NURC", "NUTR", "NUFS", "OCTH", "OFTC", "ONFI", "OPDA", "OPRE", "OPMA", "OPTH", "PAST", "PARA", "PIMA",
                   "PERF", "PERM", "PMSC", "PHIL", "PHLE", "PHOT", "PHED", "PHSC", "PHTA", "PHTH", "PHAS", "PHYS", "POLS",
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
        with open('course_descriptions.csv', 'w', newline='', encoding='utf-8') as file:
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

                    for row in rows:
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

                                print(f"Course Title: {course_title}")
                                print(f"College: {college}")
                                print(f"Description: {description}")


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
