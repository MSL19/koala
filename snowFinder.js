var Jimp = require('jimp');
let fs = require('fs');
let hashArr = [];
function getName(num){
    let nameArr = fs.readFileSync('./aspen/nameArray.json');
    let parsedNarr = JSON.parse(nameArr);
    return parsedNarr[num];
  }
async function blueCheck(){
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

    console.log(parsedNarrL.length);
        for(let i = 0; i<parsedNarrL.length; i++){
            getHash(i);
        }

    hashArr.sort(function(b,a){return a.imHash - b.imHash});
    for(let i = 0; i<parsedNarrL; i++){
        console.log(hashArr[i]);
    }
}
hashAnalysis();


async function getHash(num){
    await Jimp.read("./aspen/"+getName(num)+".png", function (err, image){
        // console.log(image.hash(10));
         hashArr.push({imHash:parseInt(image.hash(10)),imName:getName(num)});
         
        // if(num === 77)console.log(hashArr);
 
     });
}


