var Jimp = require('jimp');
let fs = require('fs');
let hashArr = [];
function getName(num){
    let nameArr = fs.readFileSync('./aspen/nameArray.json');
    let parsedNarr = JSON.parse(nameArr);
    return parsedNarr[num];
  }
var brightestArr = [];
var hasBlue = false;
Jimp.read("./aspen/2019+06Jun+10+18+0+0Sen[TR].png", function (err, image) {
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
let nameArrL = fs.readFileSync('./aspen/nameArray.json');

//for(let i =0; i<nameArrL.length; i++){
    Jimp.read("./aspen/"+getName(0)+".png", function (err, image){
        console.log(image);
        hashArr.push({
            hash: image.hash(10),
            name: getName(0)

        });
    });
//}
hashArr.sort(function(b,a){return a.hash - b.hash});
console.log(hashArr);
