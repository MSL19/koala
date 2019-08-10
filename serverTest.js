var app = require('express')();
let http2 = require("http");
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let fs = require('fs');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', async function(socket){
    socket.on('chat message', async function(msg){
      console.log('message: ' + msg);
      fs.readFile('./aspen/2016+09Sep+24+18+0+0Lan[TR].png', function(err, data){
        socket.emit('imageConversionByClient', { image: true, buffer: data });
        socket.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64"));
      });
      fs.readFile('./aspen/2016+10Oct+10+18+0+0Lan[TR].png', function(err, data){
        socket.emit('imageConversionByClient2', { image: true, buffer: data });
        socket.emit('imageConversionByServer2', "data:image/png;base64,"+ data.toString("base64"));
      });
      let JSONdata = await getSatData("1401087271",Math.floor(Date.now()/1000),"5d0d454d6dae90004761d30a","cda3de7380c305987a9346a110328670");
      let data = JSON.stringify(JSONdata);

      io.emit('chat message', data);

    });
    
    
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function getSatData(startDate,endDate,polyId,APId){ //this pulls the JSON data on Apple stock from Alphavantage and returns the JSON
  return new Promise(function(resolve, reject){
      let request = http2.request({
          method: "GET",
          host: "api.agromonitoring.com", //"api.intrinio.com",
          path: "/agro/1.0/image/search?start="+startDate+"&end="+endDate+"&polyid="+polyId+"&appid="+APId, 
          
      
      }, function(response) {
          let json = "";
          response.on('data', function (chunk) {
              json += chunk;
          });
          response.on('end', function() {
              try{
              company = JSON.parse(json);   
              resolve(company); //returning the JSON
              }
              catch(e){
              reject(e);
              }                
          });
      });
      request.end();
      });
       
}