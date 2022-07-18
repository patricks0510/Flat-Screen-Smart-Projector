const Vector2 = require('./vector2.js')

class CartesianPixel {
    constructor(a,r,g,b,x,y){
        this.a = a
        this.r = r
        this.g = g
        this.b = b
        this.x = x
        this.y = y

    }
    getCoords(){
        let coords = new Vector2(this.x,this.y)
        return coords
    }
}

module.exports = CartesianPixel