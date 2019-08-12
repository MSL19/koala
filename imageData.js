let http = require("http");
let fs = require('fs');
let names = fs.readFileSync('./aspen/nameArray.json');
let arrOfNames = JSON.parse(names);
let nameArr = [];
console.log(Date.now()/1000);
function getSatData(startDate,endDate,polyId,APId){ 
    return new Promise(function(resolve, reject){
        let request = http.request({
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
    let request = http.get(options, function(res){
        var imagedata = '';
        res.setEncoding('binary');
    
        res.on('data', function(chunk){
            imagedata += chunk;
        })
    
        res.on('end', function(){
          // if(!arrOfNames.includes(dateN)){ //seee if the file is already downloaded before re dowunloading it
                fs.writeFile('./aspen/'+dateN+'.png', imagedata, 'binary', function(err){
                    if (err) throw err
                    console.log('File saved.')
                })
          // }
            

           
        })
    
    })
    nameArr[num] = dateN;

    
}
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

    
}
getImages();