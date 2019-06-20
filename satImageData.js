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

async function getImage(num){
    let JSONdata = await getSatData("1547942400","1549065600","5d093aa46dae90003461d1d9","cda3de7380c305987a9346a110328670");
    let IMGurl = JSONdata[num]['image']['truecolor'].substring(21);
    let options;
    console.log(IMGurl);
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
            fs.writeFile('SatImage.png', imagedata, 'binary', function(err){
                if (err) throw err
                console.log('File saved.')
            })
        })
    
    })
    
    
}
getImage(1);