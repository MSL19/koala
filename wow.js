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
  "name":"antero",
  "geo_json":{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-106.249552,38.676759],[-106.241598,38.676759],[-106.241884,38.669927],[-106.250324,38.669726],[-106.249552,38.676759]]]}}]}});
req.write(datatt);
req.end();