var app = require('express')();
let http2 = require("http");
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let fs = require('fs');

let names = fs.readFileSync('./aspen/nameArray.json');
let arrOfNames = JSON.parse(names);
let nameArr = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', async function(socket){
    socket.on('console message', async function(msg){
      console.log('message: ' + msg);

      if(msg.substring(0,3)==="get"){
        console.log("getting image: "+msg.substring(3));
        console.log(arrOfNames);
        console.log(arrOfNames.includes("2016+10Oct+26+18+0+0Lan[TR]"));
        if(arrOfNames.includes(msg.substring(3))){
          console.log("image "+msg.substring(3)+" is valid");
          fs.readFile('./aspen/'+msg.substring(3)+'.png', function(err, data){
            socket.emit('imageConversionByClient', { image: true, buffer: data });
            socket.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64"));
          });
        }
        else{
          console.log("image "+msg.substring(3)+" is invalid");

        }
    
    }
      //CODE BLOCK FOR SECONDARY IMAGE
      /*fs.readFile('./aspen/2016+10Oct+10+18+0+0Lan[TR].png', function(err, data){
        socket.emit('imageConversionByClient2', { image: true, buffer: data });
        socket.emit('imageConversionByServer2', "data:image/png;base64,"+ data.toString("base64"));
      });
      */
     //CODE BLOCK FOR SECONDARY IMAGE

      

    });

    socket.on("download images", async function(){
      console.log("images downloading...")
      let N = await getImages();
      io.emit('console message', N);
    });
    
    
  });

http.listen(3000, function(){
  console.log('listening on *:3000');
});

async function getImages(){
  let JSONdata = await getSatData("1401087271",Math.floor(Date.now()/1000)-100,"5d0d454d6dae90004761d30a","cda3de7380c305987a9346a110328670");
  let options;
  let numI = JSONdata.length;
  console.log(numI);

  for(let i =0; i<numI; i++){
      await getI(JSONdata,i);
  }
  let data = JSON.stringify(nameArr);
  fs.writeFileSync('./aspen/nameArray.json', data);  
  return data;

  
}

async function getI(data,num){
  let IMGurl = data[num]['image']['truecolor'].substring(29);
  console.log(IMGurl);
  let UNIdate = data[num]['dt'];
  let dateN = timeConverter(UNIdate);
  dateN += data[num]['type'].substring(0,3)+"[TR]";

  options = {
          host: 'api.agromonitoring.com'
        , port: 80
        , path: IMGurl
      }
  let request = http2.get(options, function(res){
      var imagedata = ''
      res.setEncoding('binary')
  
      res.on('data', function(chunk){
          imagedata += chunk
      })
  
      res.on('end', function(){
         if(!arrOfNames.includes(dateN)){ //seee if the file is already downloaded before re dowunloading it
              fs.writeFile('./aspen/'+dateN+'.png', imagedata, 'binary', function(err){
                  if (err) throw err
                  console.log('File saved.')
              })
         }
          

         
      })
  
  })
  nameArr[num] = dateN;

  
}
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['01Jan','02Feb','03Mar','04Apr','05May','06Jun','07Jul','08Aug','09Sep','10Oct','11Nov','12Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = year + '+' + month + '+' + date + '+' + hour + '+' + min + '+' + sec ;
  return time;
}


function getSatData(startDate,endDate,polyId,APId){ 
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