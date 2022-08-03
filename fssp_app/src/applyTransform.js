const Vector2 = require('./vector2.js')
const Vector3 = require('./vector3.js')
const Matrix2x2 = require('./matrix2x2.js')
const Plane = require('./plane.js')
const CartesianPixel = require('./cartesianPixel.js')
const BmpImage = require('./BmpImage.js')
const { sort, mod, sec } = require('mathjs')

//pseudocode
/*
pixelsInCartesian = [][]

for(i;j, data buffer, steps of 4)
	calculate x, y from i+j
		x = sum % width of png
		y = floor(sum / width)
		center coordinates
	for(within those 4)
		create pixel object, add to array
			-a,r,g,b from data buffer
			-x
			-y
		add to pixelsInCartesian

modPixelsInCart = [][]

for(i;j, pixelsInCartesian, +1)#nested
	apply lin transform to pixels x,y variables
	create new pixel with that a,r,g,b and modified x,y
	add to modPixelsInCart[i][j]

for(i,data buffer, steps of 4)
	corner coordinates
	add to output buffer in y then x order

send output buffer to encode function
*/

//passes in a pixel buffer from bmpImage.js
function applyTransform(decodedBMP,height,width,transformMatrix){
    //empty 2d array for pixels with corresponding cartesian coordinates
    var filler1 = new CartesianPixel(0,0,0,0,0,0)
    var pxInCartesian = [...Array(width)].map(e => Array(height).fill(filler1));
    //get the pixel data from the decoded BMP
    var pxBuffer = decodedBMP
    //pixel buffer position, increments by 4 as there are 4 bytes per pixel
    var buffPos = 0
    //loop through the image, pixel by pixel
    for(let i = 0; i<height; i++) {
      for(let j = 0; j<width;j++) {
        //get the a,r,g,b values from each pixel
        let a = pxBuffer[buffPos]
        let r = pxBuffer[buffPos+1]
        let g = pxBuffer[buffPos+2]
        let b = pxBuffer[buffPos+3]
        
        //get the centered x,y coordinates from cornedered coordinates
        let x = Math.floor(-1*(j - width/2))
        let y = Math.floor(-1*(i - height/2))
  
        //create new pixel object and add to array, i j indexed from top left, x y indexed from center
        let formedPX = new CartesianPixel(a,r,g,b,x,y)
        pxInCartesian[j][i] = formedPX
        //move to next section of the pixel buffer to get the next pixel, 4 bytes per pixel
        buffPos += 4
      }

    }
    // console.log(pxInCartesian[0][0])
    // console.log(pxInCartesian[width-1][0])
    // console.log(pxInCartesian[0][height-1])
    // console.log(pxInCartesian[width-1][height-1])
    
    //modified pixels in cartesian coordinates, transform applied
    var modPxInCartesian = [...Array(width)].map(e => Array(height).fill(filler1));
    
    //loop through the pixel array, modify the coodinates according to the transform matrix calculated
    for(let i = 0; i<height; i++){
      for(let j = 0; j< width; j++){
        //temp current pixel
        let currentPX = pxInCartesian[j][i]
        //hold the coordinates of that pixel in cartesian system
        let originalCoords = currentPX.getCoords()

        //calculate new coordinates of that pixel by applying transformation to the coordinates
        let newCoords = originalCoords.matMult(transformMatrix.a,transformMatrix.b,transformMatrix.c,transformMatrix.d)

        //keep coordinates within the size of the image
        newCoords.x = Math.floor(newCoords.x)
        newCoords.y = Math.floor(newCoords.y)

        if(Math.abs(newCoords.x) > width/2){
            if(newCoords.x > 0){
                newCoords.x = Math.floor(width/2)
            }
            else{
                newCoords.x = Math.floor(-1*width/2)
            }
        }
        if(Math.abs(newCoords.y) > height/2){
            if(newCoords.y > 0){
                newCoords.y = Math.floor(height/2)
            }
            else{
                newCoords.y = Math.floor(-1*height/2)
            }
        }
        //create new pixel with those cartesian coordinates
        let movedPX = new CartesianPixel(currentPX.a,currentPX.r,currentPX.g,currentPX.b,newCoords.x,newCoords.y)

        //moved pixels stored in new aray, j i indexed from top left, x y indexed from center
        modPxInCartesian[j][i] = movedPX
      }
    }
    // console.log('modified corners')
    // console.log(modPxInCartesian[0][0])
    // console.log(modPxInCartesian[199][0])
    // console.log(modPxInCartesian[0][149])
    // console.log(modPxInCartesian[199][149])

    //empty array of empty pixels
    let sortedTopRightPX = [...Array(width)].map(e => Array(height).fill(filler1))
    
    //check the moded pixel cartesian array for black pixels
    var blackPxBoolArray = [...Array(width)].map(e => Array(height).fill(false))
    for(let i = 0; i < height; i++){
      for(let j = 0; j < width; j++){
        if(modPxInCartesian[j][i].r == '00' && modPxInCartesian[j][i].g == '00' && modPxInCartesian[j][i].b == '00'){
          //console.log(modPxInCartesian[j][i].x, modPxInCartesian[j][i].y)
          //console.log()
          let realX = Math.floor(modPxInCartesian[j][i].x + width/2)
          let realY = Math.floor(modPxInCartesian[j][i].y + height/2)
          
          if(realX > width){
            realX = width
          }
          else if(realX < 0){
            realX = 0
          }
          if(realY > height){
            realY = height
          }
          else if(realY < 0){
            realY = 0
          }
          blackPxBoolArray[realX][realY] = true
        }
      }
    }

    for(let i = 0; i < height; i++){
      for(let j = 0; j < width; j++){
        if(blackPxBoolArray[j][i] == true){
          //console.log('black px placed')
          sortedTopRightPX[j][i] = new CartesianPixel(0,0,0,0,0,0)
        }
        else{
          sortedTopRightPX[j][i] = new CartesianPixel(0,255,255,255,0,0)
        }
      }
    }

    buffPos = 0
    //start with the lowest x values and the highest y values to get a pixel stream indexed from top right
    for(let i = 0; i < height; i++){
      for(let j = 0; j < width; j++){
        
        //get the pixel at current index
        //let currentPX = sortedTopRightPX[j][i]
        
        //put pixel data back into pxBuffer 
        pxBuffer[buffPos]   = sortedTopRightPX[j][i].a
        pxBuffer[buffPos+1] = sortedTopRightPX[j][i].r
        pxBuffer[buffPos+2] = sortedTopRightPX[j][i].g
        pxBuffer[buffPos+3] = sortedTopRightPX[j][i].b
        
        //console.log(sortedTopRightPX[j][i].r)
        //move to next pixel, 4 bytes per pixel
        buffPos += 4
      }
      
    }
    //console.log(pxBuffer)
    return pxBuffer
}

module.exports = {applyTransform}