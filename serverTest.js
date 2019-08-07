var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let fs = require('fs');
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      console.log('message: ' + msg);
      fs.readFile('./aspen/2016+09Sep+24+18+0+0Lan[TR].png', function(err, data){
        socket.emit('imageConversionByClient', { image: true, buffer: data });
        socket.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64"));
      });
    });
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});