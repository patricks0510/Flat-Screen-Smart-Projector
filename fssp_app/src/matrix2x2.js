/*2x2 matrix class in the form of:
 [a b; c d]
*/
class Matrix2x2 {
    constructor(a,b,c,d){
      this.a = a
      this.b = b
      this.c = c
      this.d = d
    }
    invert(){
      let det = (1/(this.a*this.d-this.b*this.c))
      det = det.toFixed(3)
      let tempA = this.d*det
      let tempD = this.a*det
      this.a = tempA
      this.b = -1*this.b*det
      this.c = -1*this.c*det
      this.d = tempD
      this.a = this.a.toFixed(3)
      this.b = this.b.toFixed(3)
      this.c = this.c.toFixed(3)
      this.d = this.d.toFixed(3)
    }
  }

  module.exports = Matrix2x2