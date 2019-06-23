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
  "name":"mtElbert",
  "geo_json":

  {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-104.967749,39.81352],[-104.96855,39.804469],[-104.960268,39.803623],[-104.958594,39.813366],[-104.967749,39.81352]]]}}]}

});
req.write(datatt);
req.end();