var express = require('express');
var app = express();
var http = require('http').createServer(app);
let fs = require('fs');
var io = require('socket.io')(http);

var name;
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    res.sendFile(__dirname+'/index.html');
});
io.on('connection', function(socket){
    console.log('a user connected');
  });
app.post('/submit-student-data', function (req, res) {
    name = req.body.firstName + ' ' + req.body.lastName;
    
//    res.send(name + ' Submitted Successfully!');
    if(name === "TEST test"){
        
      var img = fs.readFileSync('./aspen/2017+06Jun+23+18+0+0Lan[TR].png');
    
    }
    else{
        var img = fs.readFileSync('./aspen/2017+04Apr+20+18+0+0Lan[TR].png');

    }
    res.writeHead(200, {'Content-Type': 'image/gif' });
    res.end(img, 'binary');
    
    printName();
});
function printName(){
    console.log(name);
}
var server = app.listen(5000, function () {
    console.log('Node server is running..');
});