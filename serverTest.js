var app = require('express')();
let http2 = require("http");
var http = require('http').createServer(app);
var io = require('socket.io')(http);
let fs = require('fs');
var Jimp = require('jimp');
let currentIndex = 0;
let CFindex = 0;
let names = fs.readFileSync('./aspen/nameArray.json');
let arrOfNames = JSON.parse(names);
let nameArr = [];
let cFArchetype;
let cFImage;
let cloudFreeArr = [];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
async function hashDist(i){
  await Jimp.read("./aspen/"+arrOfNames[i]+".png", function (err, image) {
    let hashDiff = Jimp.distance(cFImage, image);
    console.log("Hash Distance for "+ arrOfNames[i]+": "+hashDiff);
    io.emit("console message", "Hash Distance for "+ arrOfNames[i]+": "+hashDiff);
    if(hashDiff<0.16){
      cloudFreeArr.push(arrOfNames[i]);
    }
  });
}

// Neural Network Prep
async function convoluteImage(imageName){
  let imageMatrix = [];
  
  console.log(imageName);
  await Jimp.read("./aspen/"+imageName+".png", function (err, image){
    if(image.bitmap.height === 173){
      for(let i =0; i<image.bitmap.width; i++){
        //imageMatrix[i] = [];
        for(let j = 0; j<image.bitmap.height; j++){
          for(let four = 0; four<4; four++){// 96664/24220 = 3.99
           if(imageMatrix.length<96664){
              imageMatrix.push((Jimp.intToRGBA(image.getPixelColor(i,j))));
           }
          }
          
        }
      }      
    }
    else{
    for(let i =0; i<image.bitmap.width; i++){
      //imageMatrix[i] = [];
      for(let j = 0; j<image.bitmap.height; j++){
        imageMatrix.push((Jimp.intToRGBA(image.getPixelColor(i,j))));
      }
    }
  }
    console.log(imageMatrix.length);

  });
}
io.on('connection', async function(socket){
    socket.on('console message', async function(msg){
      console.log('message: ' + msg);

      if(msg.substring(0,3)==="get"){
        console.log("getting image: "+msg.substring(3));
        if(arrOfNames.includes(msg.substring(3))){
          console.log("image "+msg.substring(3)+" is valid");
          currentImage = msg.substring(3);
          currentIndex = arrOfNames.indexOf(msg.substring(3));
          fs.readFile('./aspen/'+msg.substring(3)+'.png', function(err, data){ 
            io.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64")); //This works...
          });
          io.emit('console message', "showing image of index: "+currentIndex+" name: "+arrOfNames[currentIndex]);

        }
        else{
          console.log("image "+msg.substring(3)+" is invalid");

        }
    
    }
    });

    socket.on("download images", async function(){
      console.log("images downloading...")
      let N = await getImages();
      io.emit('console message', N);
    });

    socket.on("select cloud-free", async function(){
      /*cFArchetype = {
        name: arrOfNames[currentIndex], 
        index: currentIndex
      }
      console.log("an image has been selected as cloud free...");
      await Jimp.read("./aspen/"+cFArchetype.name+".png", function (err, image) {
        let cFIhash = parseInt(image.hash(10));
        io.emit('console message', "Hash of cloud free image: "+cFIhash);
        cFImage = image;
      });
      */
     convoluteImage(arrOfNames[currentIndex]);

    });

    socket.on("show cloud-free", async function(){
      for(let i = 0; i<arrOfNames.length; i++){
       hashDist(i);
      }
    });
    socket.on("next CF image", async function(){
      console.log(cloudFreeArr);

      if(CFindex>cloudFreeArr.length)CFindex = 0;
      let CFstring = cloudFreeArr[CFindex];
      fs.readFile('./aspen/'+CFstring+'.png', function(err, data){
        console.log("found the file: "+CFstring);
        io.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64")); 
      });
      io.emit('console message', "showing Clouf Free image of index: "+CFindex+" name: "+CFstring);
      CFindex++;
    });
    socket.on("prev CF image", async function(){
      if(CFindex<0)CFindex = cloudFreeArr.length;
      let CFstring = cloudFreeArr[CFindex];
      fs.readFile('./aspen/'+CFstring+'.png', function(err, data){
        console.log("found the file: "+cloudFreeArr[CFindex]);
        io.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64")); 
      });
      io.emit('console message', "showing Clouf Free image of index: "+CFindex+" name: "+cloudFreeArr[CFindex]);
      CFindex--;
    });
    socket.on("next image", async function(){
      currentIndex++;
      if(currentIndex>arrOfNames.length-1) currentIndex = 0;
      let imString = arrOfNames[currentIndex];
      fs.readFile('./aspen/'+imString+'.png', function(err, data){
        console.log("found the file: "+arrOfNames[currentIndex]);
        io.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64")); 
      });
      io.emit('console message', "showing image of index: "+currentIndex+" name: "+arrOfNames[currentIndex]);

    });

    socket.on("prev image", async function(){
      currentIndex--;
      if(currentIndex<0) currentIndex = arrOfNames.length-1;
      fs.readFile('./aspen/'+arrOfNames[currentIndex]+'.png', function(err, data){
        console.log("found the file: "+arrOfNames[currentIndex]);
        io.emit('imageConversionByServer', "data:image/png;base64,"+ data.toString("base64"));
      });
      io.emit('console message', "showing image of index: "+currentIndex+" name: "+arrOfNames[currentIndex]);

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