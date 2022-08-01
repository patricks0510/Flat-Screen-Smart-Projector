var bmp = require("bmp-js");
const fs = require('fs');
const transformer = require('./applyTransform.js')


class BmpImage {
    constructor(filename){
        this.fname = filename
        var bmpBuffer = fs.readFileSync(this.fname+'.bmp');
        this.bmpData = bmp.decode(bmpBuffer);
        //console.log(this.bmpData)
        this.pixelStream = [...this.bmpData.data] 
    }
    overwritePxStream(pxStream){
        this.bmpData.data = pxStream
    }
    colorShift(){
        for(let i = 0; i < this.pixelStream.length; i+=3){
            //skip A bit of ARGB
            i += 1
            for(let j = 0; j < 3; j++){
                if(this.pixelStream[i+j] == '00'){
                    this.pixelStream[i+j] = 170
                }
            }
        }
        this.bmpData.data = this.pixelStream
        //console.log(this.bmpData.data)
    }
    createNewBMP(){
        let editImg = bmp.encode(this.bmpData)
        let writeEdit = fs.createWriteStream(this.fname+'_EDIT.bmp')

        // write some data with a base64 encoding
        writeEdit.write(editImg.data, 'hex');

        // the finish event is emitted when all data has been flushed from the stream
        writeEdit.on('finish', () => {
            console.log('wrote all data to file');
        });

        // close the stream
        writeEdit.end();
    }
    getPixelStream(){
        return this.pixelStream
    }
    getHeight(){
        return this.bmpData.height
    }
    getWidth(){
        return this.bmpData.width
    }
}

module.exports = BmpImage
// var pic = new BmpImage('bmp_24')
// transformer.applyTransform(pix.bmpData,)
// pic.createNewBMP()






//could have the UI module send a pixel array object, I work with that, and then send a pixel array back
//let pixelStream = [...pic.bmpData.data]

// for(let i = 0; i < pixelStream.length; i+=3){
//     //skip A bit of ARGB
//     i += 1
//     for(let j = 0; j < 3; j++){
//         if(pixelStream[i+j] == 00){
//             pixelStream[i+j] = 170
//         }
//     }
// }

//pic.bmpData.data = pixelStream

// //console.log(pic.bmpData)
// var editImg = bmp.encode(pic.bmpData)
// //console.log(editImg)
// let writeEdit = fs.createWriteStream('bmp_24_EDIT.bmp')

// // write some data with a base64 encoding
// writeEdit.write(editImg.data, 'hex');

// // the finish event is emitted when all data has been flushed from the stream
// writeEdit.on('finish', () => {
//     console.log('wrote all data to file');
// });

// // close the stream
// writeEdit.end();