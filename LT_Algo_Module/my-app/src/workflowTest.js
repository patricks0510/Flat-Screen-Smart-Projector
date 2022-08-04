const Vector2 = require('./vector2.js')
const Vector3 = require('./vector3.js')
const Matrix2x2 = require('./matrix2x2.js')
const Plane = require('./plane.js')
const CartesianPixel = require('./cartesianPixel.js')
const BmpImage = require('./bmpImage.js')
const transformer = require('./applyTransform.js')
const { argv } = require('node:process');
const { performance } = require('perf_hooks');

function workflowTest(originIn,iHatIn,jHatIn){
    var startTime = performance.now()


    originIn = originIn/10.4
    iHatIn = iHatIn/10.4
    jHatIn = jHatIn/10.4

    var originDistance = new Vector3(0,0,originIn)
    var iHatDistance = new Vector3(1,0,iHatIn)
    var jHatDistance = new Vector3(0,1,jHatIn)

    var projPlane = new Plane(originDistance,iHatDistance,jHatDistance)

    projPlane.calcEq()

    var iHat = projPlane.getIHat()
    var jHat = projPlane.getJHat()
    console.log('angle: '+projPlane.getAngle())
    var lT = new Matrix2x2(iHat.x,jHat.x,iHat.y,jHat.y)
    console.log(lT.a+', '+lT.b+', '+lT.c+', '+lT.d)
    lT.invert()
    console.log(lT.a+', '+lT.b+', '+lT.c+', '+lT.d)
    
    var pic = new BmpImage('6ptStar')
    let newpixelStream = transformer.applyTransform(pic.pixelStream,pic.bmpData.height,pic.bmpData.width,lT)
    pic.overwritePxStream(newpixelStream)
    //pic.colorShift()

    pic.createNewBMP()

    var endTime = performance.now()

    console.log(`Sensor input to image output took ${endTime - startTime} milliseconds`)
}

workflowTest(argv[2],argv[3],argv[4])