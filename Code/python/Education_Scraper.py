import csv, re, cStringIO, codecs

from pattern.web import abs, URL, DOM, plaintext, strip_between
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

#unicode writer
class UnicodeWriter:
    """
    A CSV writer which will write rows to CSV file "f",
    which is encoded in the given encoding.
    """

    def __init__(self, f, dialect=csv.excel, encoding="utf-8", **kwds):
        # Redirect output to a queue
        self.queue = cStringIO.StringIO()
        self.writer = csv.writer(self.queue, dialect=dialect, **kwds)
        self.stream = f
        self.encoder = codecs.getincrementalencoder(encoding)()

    def writerow(self, row):
        self.writer.writerow([s.encode("utf-8") for s in row])
        # Fetch UTF-8 output from the queue ...
        data = self.queue.getvalue()
        data = data.decode("utf-8")
        # ... and reencode it into the target encoding
        data = self.encoder.encode(data)
        # write to the target stream
        self.stream.write(data)
        # empty queue
        self.queue.truncate(0)

    def writerows(self, rows):
        for row in rows:
            self.writerow(row)
            




#function to scrape the STARR test scores of a county identified by county_num
def scrape_starrtest(county_num):
	if county_num<10:
		county_num = '0' + str(county_num)
	else:
		county_num = str(county_num)
	
	print county_num
	#url = 'http://star.cde.ca.gov/star2012/ViewReport.aspx?ps=true&lstTestYear=2012&lstTestType=X&lstCounty=01&lstDistrict=&lstSchool=&lstGroup=1&lstSubGroup=1'
	url = 'http://star.cde.ca.gov/star2012/ViewReport.aspx?ps=true&lstTestYear=2012&lstTestType=X&lstCounty=' + str(county_num) + '&lstDistrict=&lstSchool=&lstGroup=1&lstSubGroup=1'
	abs_url = URL(string = url)
	dom = DOM(abs_url.download(cached=True))#download the DOM

	
	#sciend_num = dom.by_class("rm")[4].content
	scicst_num = dom.by_class("rm")[3].content
	math_num = dom.by_class("rm")[2].content
	hist_num = dom.by_class("rm")[1].content
	ela_num = dom.by_class("rm")[0].content
	
	#sciend_percent = dom.by_class("rs")[4].content[:5]
	scicst_percent = dom.by_class("rs")[3].content[:5]
	math_percent = dom.by_class("rs")[2].content[:5]
	hist_percent = dom.by_class("rs")[1].content[:5]
	ela_percent = dom.by_class("rs")[0].content[:5]
	
	county = dom.by_tag("h2")[0].content
	
	
	# write all the collected data to a new row of the output file
	writer.writerow([county, ela_num,ela_percent, hist_num, hist_percent, math_num, math_percent,scicst_num, scicst_percent])


#function to scrape the graduation rates of a county identified by county_num
def scrape_gradrate(county_num):
	if county_num<10:
		county_num = '0' + str(county_num)
	else:
		county_num = str(county_num)
	
	print county_num
	#url = 'http://dq.cde.ca.gov/dataquest/cohortrates/CRByGender.aspx?cds=01000000000000&TheYear=2011-12&Agg=O&Topic=Dropouts&RC=County&SubGroup=Ethnic/Racial'
	url = 'http://dq.cde.ca.gov/dataquest/cohortrates/CRByGender.aspx?cds='+county_num+'000000000000&TheYear=2011-12&Agg=O&Topic=Dropouts&RC=County&SubGroup=Ethnic/Racial'
	abs_url = URL(string = url)
	dom = DOM(abs_url.download(cached=True))#download the DOM

	
	grad_percent = dom.by_tag("tr")[-1].by_tag("td")[4].content
	total_dropouts = dom.by_tag("tr")[-1].by_tag("td")[5].by_tag("span")[0].content
	total_grads = dom.by_tag("tr")[-1].by_tag("td")[3].by_tag("span")[0].content
	total_num = dom.by_tag("tr")[-1].by_tag("td")[2].by_tag("span")[0].content
	
	county = dom.by_tag("h2")[0].by_tag("span")[0].content[26:]

	

	# write all the collected data to a new row of the output file
	writer.writerow([county, total_num,total_grads, total_dropouts, grad_percent])


#function to scrape the API of a county identified by county_num
def scrape_api(county_num):
	if county_num<10:
		county_num = '0' + str(county_num)
	else:
		county_num = str(county_num)
	
	print county_num
	#url = 'http://dq.cde.ca.gov/dataquest/Acnt2012/2011Base_Co.aspx?cYear=&cSelect=02'
	url = 'http://dq.cde.ca.gov/dataquest/Acnt2012/2011Base_Co.aspx?cYear=&cSelect=' + county_num
	abs_url = URL(string = url)
	dom = DOM(abs_url.download(cached=True))#download the DOM

	#grab the value for each district and sum them up to obtain the county total value
	districts = dom.by_class('medium\+_left')

	num_students_county_total = 0
	api_county_total = 0
	for n in districts:
		#grab and sum number of students
		district_num_students = n.parent.by_class("medium_center")[0].content
		
		if not "&nbsp" in district_num_students:
			#cast to int
			district_num_students = int(district_num_students.replace(',',''))
			num_students_county_total += district_num_students
		
			#grab and sum API for each district
			district_api = n.parent.by_class("medium_center")[1].content
			#remove any asterii
			district_api = district_api.replace('*','')		
			#cast to int
			district_api = int(district_api.replace(',',''))
		
			#add the API weighted by the number of students in the current district
			api_county_total += district_api*district_num_students
		
	#divide the weighted sum of APIs by the total number of students in the county
	average_api = api_county_total/num_students_county_total

		
		
	API_num_students = dom.by_class('medium\+_left')[0].parent.by_class("medium_center")[0].content

	#use county number as a placeholder for the county name for now, as the county name is not easily scrapable	
	county = county_num

	

	# write all the collected data to a new row of the output file
	writer.writerow([str(county), str(num_students_county_total),str(average_api)])





#function to scrape the truancy rates of a county identified by county_num
def scrape_truancy(county_num):
	if county_num<10:
		county_num = '0' + str(county_num)
	else:
		county_num = str(county_num)
	
	print county_num
	#url = 'http://dq.cde.ca.gov/dataquest/SuspExp/suspexplrate.aspx?cYear=2011-12&cType=ALL&cCDS=01000000000000&cName=ALAMEDA&cLevel=County&cChoice=cSusExpRt'
	url = 'http://dq.cde.ca.gov/dataquest/SuspExp/suspexplrate.aspx?cYear=2011-12&cType=ALL&cCDS=' + county_num + '000000000000&cName=ALAMEDA&cLevel=County&cChoice=cSusExpRt'
	abs_url = URL(string = url)
	dom = DOM(abs_url.download(cached=True))#download the DOM


	county = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[1].by_tag("a")[0].content
	total_enrollment = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[1].by_tag("td")[3].content
	suspensions = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[1].by_tag("td")[4].content
	suspension_rate = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[1].by_tag("td")[5].content
	expulsions = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[1].by_tag("td")[6].content
	expulsion_rate = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[1].by_tag("td")[7].content
	truants = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[1].by_tag("td")[8].content
	trauncy_rate = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[1].by_tag("td")[9].content

	
	#For the first county only, also grab the statewide totals
	if county_num=='01':
		state_total_enrollment = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[2].by_tag("td")[3].content
		state_suspensions = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[2].by_tag("td")[4].content
		state_suspension_rate = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[2].by_tag("td")[5].content
		state_expulsions = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[2].by_tag("td")[6].content
		state_expulsion_rate = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[2].by_tag("td")[7].content
		state_truants = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[2].by_tag("td")[8].content
		state_trauncy_rate = dom.by_id("ContentPlaceHolder1_gdTotal").by_tag("tr")[2].by_tag("td")[9].content
		
		# write the statewide total data to the top row of the output file
		writer.writerow(["California Total", state_total_enrollment,state_suspensions, state_suspension_rate, state_expulsions, state_expulsion_rate, state_truants, state_trauncy_rate])

	

	# write all the collected data to a new row of the output file
	writer.writerow([county, total_enrollment,suspensions, suspension_rate, expulsions, expulsion_rate, truants, trauncy_rate])


#function to scrape the truancy rates of a county identified by county_num
def scrape_education(county_num):
	if county_num<10:
		county_num = '0' + str(county_num)
	else:
		county_num = str(county_num)
	
	print county_num
	#url = 'http://dq.cde.ca.gov/dataquest/Staff/StaffEduLvl.aspx?cYear=2011-12&cChoice=CoEduc&TheCounty=01,ALAMEDA&cType=T&cGender=&Submit=1'
	url = 'http://dq.cde.ca.gov/dataquest/Staff/StaffEduLvl.aspx?cYear=2011-12&cChoice=CoEduc&TheCounty=' + county_num + '01,ALAMEDA&cType=T&cGender=&Submit=1'
	abs_url = URL(string = url)
	dom = DOM(abs_url.download(cached=True))#download the DOM

	

	other = dom.by_id("ctl00_ContentPlaceHolder1_gdTotal").by_tag("td")[12].content.replace(',','')
	associates = dom.by_id("ctl00_ContentPlaceHolder1_gdTotal").by_tag("td")[11].content.replace(',','')
	bachelors = str(int(dom.by_id("ctl00_ContentPlaceHolder1_gdTotal").by_tag("td")[9].content.replace(',','')) + int(dom.by_id("ctl00_ContentPlaceHolder1_gdTotal").by_tag("td")[10].content.replace(',','')))

	masters = str(int(dom.by_id("ctl00_ContentPlaceHolder1_gdTotal").by_tag("td")[4].content.replace(',','')) + int(dom.by_id("ctl00_ContentPlaceHolder1_gdTotal").by_tag("td")[5].content.replace(',','')))
	jurisdoctor = dom.by_id("ctl00_ContentPlaceHolder1_gdTotal").by_tag("td")[3].content.replace(',','')
	doctorate = dom.by_id("ctl00_ContentPlaceHolder1_gdTotal").by_tag("td")[2].content.replace(',','')
	
	bachelors_and_less = str(int(bachelors) + int(associates) + int(other))
	
	post_grad = str(int(masters) + int(jurisdoctor) + int(doctorate))
	
	county = dom.by_id("ctl00_ContentPlaceHolder1_gdTotal").by_tag("a")[0].content

	# write all the collected data to a new row of the output file
	writer.writerow([county, bachelors_and_less, post_grad, associates, bachelors, masters, jurisdoctor, doctorate])




#### STARR TEST DATA #######
# Creating the csv output file for writing into as well as defining the writer
output = open("starr_test_scores_2011_2012.csv", "wb")
writer = UnicodeWriter(output)

# add header row
writer.writerow(["County", "English-Language Arts (Grades 2-11) - Number of scores","English-Language Arts (Grades 2-11) - % Proficient or Advanced", "History (Grades 8 and 11, and end-of-course) - Number of scores", "History (Grades 8 and 11, and end-of-course) - % Proficient or Advanced", "Mathematics (Grades 2-7, and end-of-course) - Number of scores", "Mathematics (Grades 2-7, and end-of-course) - % Proficient or Advanced","Science CST (Grades 5, 8, and 10) - Number of scores", "Science CST (Grades 5, 8, and 10) - % Proficient or Advanced"])

n = 0
while n<59:
	scrape_starrtest(n)
	n += 1

output.close()

#### DROPOUT RATE DATA #######
# Creating the csv output file for writing into as well as defining the writer
output = open("dropout_rate_2011_2012.csv", "wb")
writer = UnicodeWriter(output)


# add header row
writer.writerow(["County", "Total Student Cohort","Total Cohort Graduates",  "Cohort Dropouts", "Cohort Graduation Percentage"])


n = 1
while n<59:
	scrape_gradrate(n)
	n += 1

output.close()

#### API DATA #######
# Creating the csv output file for writing into as well as defining the writer
output = open("api_2011_2012.csv", "wb")
writer = UnicodeWriter(output)


# add header row
writer.writerow(["County", "Number of Students Included in API","2011 Base API"])


n = 1
while n<59:
	scrape_api(n)
	n += 1

output.close()



# #### TRUANCY DATA #######
# Creating the csv output file for writing into as well as defining the writer
output = open("truancy_2011_2012.csv", "wb")
writer = UnicodeWriter(output)

# add header row
writer.writerow(["County", "Enrollment","Suspensions", "Suspension Rate", "Expulsions", "Expulsion Rate", "Truants", "Truancy Rate"])


n = 1
while n<59:
	scrape_truancy(n)
	n += 1

output.close()


# #### STAFF EDUCATION DATA #######
# Creating the csv output file for writing into as well as defining the writer
output = open("staff_education_2011_2012.csv", "wb")
writer = UnicodeWriter(output)

# add header row
writer.writerow(["County", "Bachelors or less","Masters or more", "Associates", "Bachelors", "Masters", "Juris Doctor", "PhD" ])


n = 1
while n<59:
	scrape_education(n)
	n += 1

output.close()




