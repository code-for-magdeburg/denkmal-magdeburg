const fs = require("fs");

const contents = fs.readFileSync("history.json");

const jsonContent = JSON.parse(contents);

const idLocation = [];

jsonContent.results.forEach(x => {
  const { id, lng, lat } = x;

  idLocation.push([id, lng, lat]);
  const data = JSON.stringify(x, null, "\t");

  fs.writeFile(`../public/data/location/${id}.json`, data, err => {
    if (err) return console.error(err);
    console.log("done");
  });
});

const data = JSON.stringify(idLocation, null, "\t");

fs.writeFile(`../public/data/index.json`, data, err => {
  if (err) return console.error(err);
  console.log("done");
});
