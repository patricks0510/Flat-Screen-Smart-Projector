const Vector2 = require('./vector2.js')
const Vector3 = require('./vector3.js')
const Matrix2x2 = require('./matrix2x2.js')
const Plane = require('./plane.js')
const CartesianPixel = require('./cartesianPixel.js')
const BmpImage = require('./bmpImage.js')
const transformer = require('./applyTransform.js')

const { performance } = require('perf_hooks');

function workflowTest(origin,iHat,jHat){
    var startTime = performance.now()

    origin = origin/10.4
    origin = iHat/10.4
    origin = jHat/10.4

    var originDistance = new Vector3(0,0,origin)
    var iHatDistance = new Vector3(1,0,iHat)
    var jHatDistance = new Vector3(0,1,jHat)

    var projPlane = new Plane(originDistance,iHatDistance,jHatDistance)

    projPlane.calcEq()

    var iHat = projPlane.getIHat()
    var jHat = projPlane.getJHat()
    console.log(projPlane.getAngle())
    var lT = new Matrix2x2(iHat.x,jHat.x,iHat.y,jHat.y)

    lT.invert()

    var pic = new BmpImage('square')
    let newpixelStream = transformer.applyTransform(pic.pixelStream,pic.bmpData.height,pic.bmpData.width,lT)
    pic.overwritePxStream(newpixelStream)
    //pic.colorShift()

    pic.createNewBMP()

    var endTime = performance.now()

    console.log(`Sensor input to image output took ${endTime - startTime} milliseconds`)
}