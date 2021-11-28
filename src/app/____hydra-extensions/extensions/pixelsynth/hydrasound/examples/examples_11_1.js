// base
pixelsynth.init({
  numFrequencies: 160,
  numOctaves: 3,
  baseFrequency: 20.3,
  fadeTime: 0.1
})
s0.initScreen(2)
solid().out()
src(o0)
.brightness(-0.002)
  .layer(
    src(s0)
    .luma(0.2)
    .mask(
      shape(4, 0.4)
      .repeat(1, [3, 10, 100, 0, 1].fast(0.2))
    )
    )
//  .mask(shape(4, 0.9))
  //.invert()
  //.luma(0.8)
  //.rotate(0, 0.1)
  .scrollX(0.001)
  .scale(1.001)
  .out()

src(o0)
  //.diff(shape().repeat())
  //.mask(shape())
  .scale(1.1)
  .out()

solid().out()

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

solid().out()

osc().rotate(0, 0.2).out()

s0.initCam()

src(s0).repeat(1, 1).sharpen(1, 1, 0).thresh(0.9, 0.2).scrollX(0, 0.1).out()

src(s0).repeat(1, 1).scrollX(0, 0.1).luma().out()


pixelsynth.init({
  fadeTime: 10
})

pixelsynth.init({
  numOctaves: 10,
  baseFrequency: 60.3,
  fadeTime: 0.1
})


s1.initScreen(2)

src(s1).luma(0.1).scale(1).scrollX(0, 0.2).mask(shape(4, 0.9).scrollY(-0.1)).out()
