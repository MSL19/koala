var http = require("http");

function getSatData(startDate,endDate,polyId,APId){ //this pulls the JSON data on Apple stock from Alphavantage and returns the JSON
    return new Promise(function(resolve, reject){
        var request = http.request({
            method: "GET",
            host: "api.agromonitoring.com", //"api.intrinio.com",
            path: "/agro/1.0/image/search?start="+startDate+"&end="+endDate+"&polyid="+polyId+"&appid="+APId, 
            
        
        }, function(response) {
            var json = "";
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

async function test(){
    var t = await getSatData("1547942400","1549065600","5d093aa46dae90003461d1d9","cda3de7380c305987a9346a110328670");
    console.log(t[1]['image']['truecolor']);
}
test();