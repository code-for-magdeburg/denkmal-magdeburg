import dataset
import requests
import time

db = dataset.connect('sqlite:///databse.db')
table = db['history']

key = "XAI2eQAhITGGep9PYpBj7ZQM90NtKSpd"
baseUrl = "http://www.mapquestapi.com/geocoding/v1/address?street=%s&city=Magdeburg&country=Germany&maxResults=1&key=" + key

def geocode(row):
	address = row['anschrift']

	if row['lat'] == None:
		print(address)
		url = baseUrl % address
		response = requests.get(url).json()
		lat = response['results'][0]['locations'][0]['latLng']['lat']
		lng = response['results'][0]['locations'][0]['latLng']['lng']

		row['lng'] = lng
		row['lat'] = lat

		table.update(row, ['id'])
		# time.sleep(0.5)

	else:
		print(row['lat'])


for row in list(table.all()):
	geocode(row)


dataset.freeze(table, format='csv', filename='history.csv')
dataset.freeze(table, format='json', filename='history.json')
