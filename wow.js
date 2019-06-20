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
  "name":"test4",
  "geo_json":{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-111.467,44.30192],[-111.46849,44.27506],[-111.43713,44.27424],[-111.43724,44.29996],[-111.467,44.30192]]]}}});
req.write(datatt);
req.end();