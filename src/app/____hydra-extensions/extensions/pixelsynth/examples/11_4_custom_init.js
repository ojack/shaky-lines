
osc(4).rotate(0, -0.09).out()

solid().out()

osc(20, -0.06)
  .rotate(0, 0.15)
  .pixelate(1000, 16)
  .thresh(0.8, 0.3)
  //.scrollX(0, 0.15)
 // .modulateScale(osc(4, 0.3).color(1, 0), -0.8)
  .out()

osc(100, 0).thresh(0.9, 0.1).rotate(0.4).mult(osc(40, 0.02).modulateScale(osc())).scrollX(0, 0.01).out()


osc(40, 0)
  .mult(
  	osc(80)
  		.mult(
          osc(100, 0.02)
          	.mult(osc(5, -0.03).rotate(Math.PI/2))
          )
   )
   .rotate(0, 0.02)
   .blend(o0, 0.9)
   .modulate(o0, -0.05)
  // .brightness(0.01
  .contrast(1.02, 0.8)
  //.luma(0.01)
  .scale(1.01)
  .out()
