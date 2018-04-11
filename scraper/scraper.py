import dataset
import requests
from lxml.html import document_fromstring

base_url = 'http://denkmalverzeichnis.magdeburg.de/KID/DenkmalDetailInfoMitBild.asp?id=%s'

r = range(2871, 5500)

urls = [(i, base_url % i) for i in r]

db = dataset.connect('sqlite:///databse.db')

table = db['history']

def parsePage(text, i):
	doc = document_fromstring(text)

	# print(text)
	if( len(doc.xpath("//table")) ):
		tableX = doc.xpath("//table")[0]


		stadteil = tableX.xpath(".//tr[2]/td[2]/text()")
		anschrift = tableX.xpath(".//tr[3]/td[2]/text()")
		objektart = tableX.xpath(".//tr[4]/td[2]/text()")
		objektbezeichnung = tableX.xpath(".//tr[6]/td[2]/text()")
		denkmalbereich = tableX.xpath(".//tr[7]/td[2]/text()")
		image = tableX.xpath("//input[@name='Bild1']/@value")

		stadteilAsString = None
		anschriftAsString = None
		objektartAsString = None
		objektbezeichnungAsString = None
		denkmalbereichAsString = None
		imageUrl = None

		if(len(stadteil) > 0):
			stadteilAsString = stadteil[0]
			# print(stadteilAsString)
		if(len(anschrift) > 0):
			anschriftAsString = anschrift[0]
			# print(anschriftAsString)
		if(len(objektart) > 0):
			objektartAsString = objektart[0]
			# print(objektartAsString)
		if(len(objektbezeichnung) > 0):
			objektbezeichnungAsString = objektbezeichnung[0]
			# print(objektbezeichnungAsString)
		if(len(denkmalbereich) > 0):
			denkmalbereichAsString = denkmalbereich[0]
			# print(denkmalbereichAsString)
		if(len(image) > 0):
			imageUrl = "http://denkmalverzeichnis.magdeburg.de/RPWebMM" + image[0].replace("\\","/")
			# print(imageUrl)

		description = doc.xpath("//textarea/text()")[0]

		index = description.find("\r\n\r\n") + 4 # cut after new lines
		descriptionShort = description[index:]

		# print(descriptionShort)

		newItem = dict(stadteil=stadteilAsString, anschrift=anschriftAsString, objektart=objektartAsString, objektbezeichnung=objektbezeichnungAsString, denkmalbereich=denkmalbereichAsString, image=imageUrl, denkmalverzeichnisId=i, description=descriptionShort )

		db['history'].insert(newItem)


for (i, url) in urls:
	r = requests.get(url).text
	parsePage(r, i)
	print("Done with: %s" % i)

result = db['history'].all()
