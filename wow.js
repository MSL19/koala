var http = require("http");
var options = {
  hostname: 'api.agromonitoring.com',
  port: 80,
  path: '/agro/1.0/polygons?appid=cda3de7380c305987a9346a110328670',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'    
}
  
  
};
var req = http.request(options, function(res) {
  console.log('Status: ' + res.statusCode);
  console.log('Headers: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (body) {
    console.log('Body: ' + body);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
var datatt = JSON.stringify({
  "name":"copperLake",
  "geo_json":

  {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-106.918631,38.998766],[-106.911535,38.997833],[-106.920519,38.982629],[-106.937227,38.988453],[-106.918631,38.998766]]]}}]}

});
req.write(datatt);
req.end();