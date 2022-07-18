var bmp = require("bmp-js");
const fs = require('fs');


class bmpImage {
    constructor(filename){
        this.fname = filename
        var bmpBuffer = fs.readFileSync(this.fname+'.bmp');
        this.bmpData = bmp.decode(bmpBuffer);
        console.log(this.bmpData)
        this.pixelArray = [...this.bmpData.data] 
    }
    colorShift(){
        for(let i = 0; i < this.pixelArray.length; i+=3){
            //skip A bit of ARGB
            i += 1
            for(let j = 0; j < 3; j++){
                if(this.pixelArray[i+j] == '00'){
                    this.pixelArray[i+j] = 170
                }
            }
        }
        this.bmpData.data = this.pixelArray
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
    getPixelArray(){
        return this.pixelArray
    }
    getHeight(){
        return this.bmpData.height
    }
    getWidth(){
        return this.bmpData.width
    }
}


var pic = new bmpImage('bmp_24')
pic.colorShift()
pic.createNewBMP()






//could have the UI module send a pixel array object, I work with that, and then send a pixel array back
//let pixelArray = [...pic.bmpData.data]

// for(let i = 0; i < pixelArray.length; i+=3){
//     //skip A bit of ARGB
//     i += 1
//     for(let j = 0; j < 3; j++){
//         if(pixelArray[i+j] == 00){
//             pixelArray[i+j] = 170
//         }
//     }
// }

//pic.bmpData.data = pixelArray

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