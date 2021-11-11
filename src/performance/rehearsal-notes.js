image(v.biblioteca, {skewX: 10})

// numbers have fabric presets

// second letters have hydra presets
// hydra

!! destination-out!

// drawing to do::
-- thin line or medium or thick
-- way to specify which parameter to repeat

-- difference, destination-out, source-over

// canvas going in and out
hide()

src(o0)
    .brightness(-0.01)
   .layer(
		src(s0)
         .blend(solid(0, 0, 0, 0), [1, 0])
  		//.color(0.5, 0, 0)
  		//.hue(() => time*0.1).modulate(osc(2), 0.5)
     )
  .scrollY(-0.001)
   .out()

 src(o0)
  //.brightness(-0.001)
 .modulate(o0, 0.001)
  .scrollY(-0.001)
  .layer(src(s0).mask(osc(4).thresh(0.1)).luma())
  .out()

// twitter zoom in
s1.initVideo(v.lv)

src(o0).layer(
  	src(s1)
    .color(1.2, 0.2, 0.3)
  // .invert()
    .lumaInvert([-0.1, 0.1, 0.1].fast(2))
    //.lumaInvert(-0.1)
   // .invert()
   // .scale([5, 0.5, 0.1])
    .scale(5)
  //.mask(src(s0).invert().thresh(0.2))
  //.repeat([2, 2)
   .scrollY(0, -0.02)
)
  .saturate(1.1)
  .out()

//!!! twitter scroll
  src(o0)
       .brightness(-0.01)
  	.layer(
    		src(s1)
            .diff(osc(2, 0.03, 0.9))
            .luma(0.8, 0.001).saturate(1.2)
  	)
      .saturate(1.1)
      .out()
