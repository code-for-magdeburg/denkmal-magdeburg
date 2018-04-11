var fs = require('fs');

var express = require('express');
var app = express();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/test');

var denkmalSchema = new Schema({  
    denkmalbereich: String,
    objektart: String,
    denkmalverzeichnisId: Number,
    image: String,
    anschrift: String,
    objektbezeichnung: String,
    description: String,
    stadteil: String,
    loc: {
	    type: [Number],  // [<longitude>, <latitude>]
	    index: '2d'      // create the geospatial index
	    }
});

var Denkmal = mongoose.model('Denkmal', denkmalSchema);  

app.get('/getNearest', function(req, res) {  
    var limit = req.query.limit || 10;

    // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = req.query.lng;
    coords[1] = req.query.lat;

    // find a location
    Denkmal.find({
      loc: {
        $near: coords
      }
    }).limit(limit).exec(function(err, locations) {
      if (err) {
        return res.json(500, err);
      }

      res.json(200, locations);
    });
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {

	// insert the scraped data only once
	Denkmal.findOne(function(err, data){
		if( !data ) {
			var allResults = JSON.parse(fs.readFileSync('./../scraper/history.json')).results;

			for (i=0; i<allResults.length; i++) {
				var row = allResults[i];
				row.loc = [row.lng, row.lat];
				delete row.lat;
				delete row.lng;
				delete row.id;
			};

			Denkmal.collection.insert(allResults, new function(err, success) {
				if(err) console.log(err);
				else console.log('successfully inserted data')
			});

		} else {
			console.log('data already inserted')
			console.log(JSON.stringify(data))
		}
	});

});