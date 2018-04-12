import locations from "./locations.json";

// Convert Degress to Radians
function deg2rad(deg) {
  return deg * Math.PI / 180;
}

// PythagorasEquirectangular
function getDistance(lat1, lon1, lat2, lon2) {
  lat1 = deg2rad(lat1);
  lat2 = deg2rad(lat2);
  lon1 = deg2rad(lon1);
  lon2 = deg2rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = lat2 - lat1;
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}

function getLocationOrder(latitude, longitude) {
  return locations.sort((x, y) => {
    const dx = getDistance(latitude, longitude, x[1], x[2]);
    const dy = getDistance(latitude, longitude, y[1], y[2]);
    return dx - dy;
  });
}

export { getLocationOrder };
