var getPixels = require("get-pixels");
let fs = require('fs');

function getName(num){
  let nameArr = fs.readFileSync('./aspen/nameArray.json');
  let parsedNarr = JSON.parse(nameArr);
  return parsedNarr[num];
}
let nameArr = fs.readFileSync('./aspen/nameArray.json');
let parsedNarr = JSON.parse(nameArr);
let imgArr =[];

for(let i = 0; i<parsedNarr.length; i++){
getPixels("./aspen/"+getName(i)+".png", function(err, pixels) {
  if(err) {
    console.log("Bad image path")
    return
  }
  for(let i = 0; i<pixels.data.length; i++){
    let subArr = [pixels.data[i],pixels.data[i+1],pixels.data[i+2],pixels.data[i+3]];
    imgArr.push(subArr);
    i+=4;
  }
  console.log(i+": "+imgArr.length);
})
}

for(let i = 0;i<imgArr.length;i++){
  let totalpixValue = imgArr[i][0]+imgArr[i][1]+imgArr[i][2]+imgArr[i][3];
  console.log(i + ": "+ totalpixValue);
}