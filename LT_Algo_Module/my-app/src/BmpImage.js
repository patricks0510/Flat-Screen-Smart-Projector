var bmp = require("bmp-js");
const fs = require('fs');


class bmpImage {
    constructor(){
        var bmpBuffer = fs.readFileSync('bmp_24.bmp');
        this.bmpData = bmp.decode(bmpBuffer);   
    }
}


var pic = new bmpImage()
//could have the UI module send a pixel array object, I work with that, and then send a pixel array back
let pixelArray = [...pic.bmpData.data]

for(let i = 0; i < pixelArray.length; i+=3){
    //skip A bit of ARGB
    i += 1
    for(let j = 0; j < 3; j++){
        if(pixelArray[i+j] == 00){
            pixelArray[i+j] = 170
        }
    }
}

pic.bmpData.data = pixelArray
console.log(pic.bmpData)
var editImg = bmp.encode(pic.bmpData)
console.log(editImg)
let writeEdit = fs.createWriteStream('bmp_24_EDIT.bmp')

// write some data with a base64 encoding
writeEdit.write(editImg.data, 'hex');

// the finish event is emitted when all data has been flushed from the stream
writeEdit.on('finish', () => {
    console.log('wrote all data to file');
});

// close the stream
writeEdit.end();