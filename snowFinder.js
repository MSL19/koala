var Jimp = require('jimp');
let fs = require('fs');
let hashArr = [];

async function blueCheck(){ //depreciated
    var brightestArr = [];
    var hasBlue = false;
    await Jimp.read("./aspen/2019+06Jun+10+18+0+0Sen[TR].png", function (err, image) {
        for(let i = 0; i<image.bitmap.height; i++){
            for(let j =0;j<image.bitmap.width; j++){
            let combColor = Jimp.intToRGBA(image.getPixelColor(j, i))['r'] + Jimp.intToRGBA(image.getPixelColor(j, i))['g']+Jimp.intToRGBA(image.getPixelColor(j, i))['b'];
                brightestArr.push({totalRGB:combColor,x:j,y:i});
                image.setPixelColor(0, j, i); // sets the colour of that pixel

        if(Jimp.intToRGBA(image.getPixelColor(j, i))['r']<=156&&Jimp.intToRGBA(image.getPixelColor(j, i))['r']>=127&&Jimp.intToRGBA(image.getPixelColor(j, i))['g']>=115&&Jimp.intToRGBA(image.getPixelColor(j, i))['g']<=155&&Jimp.intToRGBA(image.getPixelColor(j, i))['b']>=126&&Jimp.intToRGBA(image.getPixelColor(j, i))['b']<=162){
            hasBlue = true;
            

        }
        }
        }
        brightestArr.sort(function(b,a){return a.totalRGB - b.totalRGB});
        console.log(hasBlue);
    });

}

async function hashAnalysis(){
    let nameArrL = fs.readFileSync('./aspen/nameArray.json');
    let parsedNarrL = JSON.parse(nameArrL);

    console.log("Number of images: "+parsedNarrL.length);
        for(let i = 0; i<parsedNarrL.length; i++){
            getHash(i, parsedNarrL.length, parsedNarrL[i]);
            console.log(i);
        }

    hashArr.sort(function(b,a){return a.imHash - b.imHash}); // sorts the images in the array based off of their hashed values
    setTimeout(function reorderImages(){
    

        console.log("Hashed array length (should be the same as the normal image array length): "+hashArr.length);
        for(let i = 0; i<hashArr.length; i++){
            let blueString = "false";
            let blueString2 = "false";
    
            if(hashArr[i].hasBl)blueString = "true";
            if(hashArr[i].hasBl2)blueString2 = "true";
            fs.rename('./sortedByHash/'+hashArr[i].imName+'.png', './sortedByHash/'+i+hashArr[i].imName+blueString+blueString2+'.png', function (err) {
                if (err) throw err;
                console.log('rename complete');
              });
        }
    }, 15000)
}
hashAnalysis();

async function getHash(num, stop, name){
    await Jimp.read("./sortedByHash/"+name+".png", function (err, image){
        let hasBlue = false;
        let hasBlue2 =false;
        for(let i = 0; i<image.bitmap.height; i++){
            for(let j =0;j<image.bitmap.width; j++){
                    if(Jimp.intToRGBA(image.getPixelColor(j, i))['r']<=156&&Jimp.intToRGBA(image.getPixelColor(j, i))['r']>=127&&Jimp.intToRGBA(image.getPixelColor(j, i))['g']>=115&&Jimp.intToRGBA(image.getPixelColor(j, i))['g']<=155&&Jimp.intToRGBA(image.getPixelColor(j, i))['b']>=126&&Jimp.intToRGBA(image.getPixelColor(j, i))['b']<=162){
                        hasBlue = true;
                    }
                    if(Jimp.intToRGBA(image.getPixelColor(j, i))['r']<=127&&Jimp.intToRGBA(image.getPixelColor(j, i))['r']>=122&&Jimp.intToRGBA(image.getPixelColor(j, i))['g']>=135&&Jimp.intToRGBA(image.getPixelColor(j, i))['g']<=146&&Jimp.intToRGBA(image.getPixelColor(j, i))['b']>=142&&Jimp.intToRGBA(image.getPixelColor(j, i))['b']<=147){
                        hasBlue2 = true;
                    }
            }
        }
         hashArr.push({hasBl:hasBlue,hasBl2: hasBlue2, imHash:parseInt(image.hash(10)),imName:name});
         console.log(name);
         if(num === stop-1){
           //  console.log(hashArr);
             hashArr.sort(function(b,a){return a.imHash - b.imHash});
             console.log("THis should be sorted...");

             //console.log(hashArr);
          //  reorderImages();


         }
 
     });
}



