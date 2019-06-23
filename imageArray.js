var getPixels = require("get-pixels");
let fs = require('fs');

function getName(num){
  let nameArr = fs.readFileSync('./aspen/nameArray.json');
  let parsedNarr = JSON.parse(nameArr);
  return parsedNarr[num];
}
/*getPixels("logo.png", function(err, pixels) {
  if(err) {
    console.log("Bad image path")
    return
  }
  let testArr =[];
  for(let i = 0; i<pixels.data.length; i++){
    testArr.push(pixels.data[i]+" "+pixels.data[i+1]+" "+pixels.data[i+2]+" "+pixels.data[i+3]);
    i+=4;
  }
  console.log("got pixels", testArr);
})
*/
console.log(getName(2));