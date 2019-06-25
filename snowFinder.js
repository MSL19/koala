var Jimp = require('jimp');
var brightestArr = [];
Jimp.read("./aspen/2016+09Sep+8+18+0+0Lan[TR].png", function (err, image) {
    for(let i = 0; i<image.bitmap.height; i++){
        for(let j =0;j<image.bitmap.width; j++){
        let combColor = Jimp.intToRGBA(image.getPixelColor(j, i))['r'] + Jimp.intToRGBA(image.getPixelColor(j, i))['g']+Jimp.intToRGBA(image.getPixelColor(j, i))['b'];
            brightestArr.push({totalRGB:combColor,x:j,y:i});
            //console.log(combColor);

        }
        
    }
    brightestArr.sort(function(b,a){return a.totalRGB - b.totalRGB});
console.log(brightestArr);
});
