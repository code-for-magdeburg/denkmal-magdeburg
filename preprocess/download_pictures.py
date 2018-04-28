import urllib.request
import json

with open('history.json') as data_file:
    data = json.load(data_file)

    for d in data['results']:
        print(int(d['id']))
        if int(d['id']) < 592:
            continue

        url = d['image']
        if url is not None:
            urllib.request.urlretrieve(
                url, '../public/data/images/' + str(d['id']) + '.jpg')
