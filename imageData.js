let http = require("http");
let fs = require('fs');

function getSatData(startDate,endDate,polyId,APId){ //this pulls the JSON data on Apple stock from Alphavantage and returns the JSON
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
    options = {
            host: 'api.agromonitoring.com'
          , port: 80
          , path: IMGurl
        }
    let request = http.get(options, function(res){
        var imagedata = ''
        res.setEncoding('binary')
    
        res.on('data', function(chunk){
            imagedata += chunk
        })
    
        res.on('end', function(){
            fs.writeFile('./aspen/'+dateN+'.png', imagedata, 'binary', function(err){
                if (err) throw err
                console.log('File saved.')
            })
        })
    
    })
    
}
async function getImages(){
    let JSONdata = await getSatData("1501087271","1561087271","5d0c5b746dae90003461d21d","cda3de7380c305987a9346a110328670");
    let options;
    let numI = JSONdata.length;
    console.log(numI);

    for(let i =0; i<numI; i++){
        await getI(JSONdata,i);
    }
    
}
getImages();