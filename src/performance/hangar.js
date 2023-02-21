const { solarizedDark } = require("cm6-theme-solarized-dark")

module.exports = () => {
 markerCanvas.style.mixBlendMode = "difference"
 markerCanvas.style.opacity = 0
 strokeCanvas.style.opacity = 0

 solid(0, 0, 0, 0).out()
 
 bpm = 60
 s2.initCam()

src(s2).luma(0.2, 0).mask(shape(4, 0.99, 0)).scale(0.6).contrast().scrollX(-0.1).scrollY(-0.2).out(o1)
 s1.init({
    src: markerCanvas
  })

 p0.setMarker({
    width: 10,
    height: 30,
    color: 'black',
    lineColor: 'white',
    lineWidth: 4
  })
  
  p1.setMarker({
    width: 30,
    height: 30,
    // color: 'yellow',
    // lineColor: 'green',
    color: 'black',
    lineColor: 'white',
   // lineWidth: 40,
    lineWidth: () => 1 + p0.x*4
  })

  p2.setMarker({
    width: 10,
    height: 10,
    color: 'yellow',
    lineColor: 'blue',
    lineWidth: 2
  })



// p0.setMarker({
// 	width: 30,
// 	height: 30,
// 	color: 'white',
// 	lineColor: 'yellow',
// 	lineWidth: 6
// })

p1.setStroke({
	size: 30,
	thinning: 0,
	smoothing: 0,
	streamline: 0,
	color: 'green',
	simplify: 10
})

// p1.setMarker({
// 	alpha: 0
// })

p3.setStroke({
	size: 100,
	thinning: 4,
	blending: 'difference'
})

p2.setStroke({
	size: 150,
	thinning: 4,
	blending: 'difference',
   color: 'blue'
})

reverb.wet.value = 0
delay.wet.value = 0

// f0.set({
//   query: "bell",
//   test: () => { 
//     console.log('hi')
//     //f0.loadSimilar(0)
//   },
//  // notes: ['a4', 'e3'],
//   //index: () => wrand([0, 1, 2, 3, 4], [])
//   index: 0
// })

// p3.setMarker({
// 	alpha: 0
// })

// p2.setMarker({
// 	alpha: 0
// })

// p0.set({
// 	trigger: () => {
// 		//console.log('hi')
// 		//console.log(p0._readPixel(100, 100))
// 		// p0.strokes.forEach((stroke) => {
// 		// 	stroke.points.forEach((p) => {
// 		// 		//  console.log(p)
// 		// 		//  if(p & p.x) {
// 		// 		const val = p0._readPixel(p.x, p.y)
// 		// 		//console.log(val, p.x, p.y)
// 		// 		// p.y -= (0.5 - val) * 3
// 		// 		p.y += Math.sin(time * 0.9)*0.4 * (0.5 - val) * 3
// 		// 		// }
// 		// 	})
// 		// //	p0.simplifyStroke(stroke)
// 		// 	p0.updateStroke(stroke)
// 		// })
// 		// p0._renderStrokes()
// 	},
// 	interval: 80
// })

// src(o0)
// 	//.brightness(() => -p2.x * 0.1)
// 	//.hue(0.001)
// 	.scale(1, 0.9, .94, () => p3.x, 0.6)
// 	//.layer(src(s0).hue(() => time * 0.1).repeat(() => p3.x * 10, () => p3.y * 10).brightness(-0.45))
// 	// .layer(src(s0))
// 	// .layer(s1)
// 	.layer(
// 		//src(o1)
// 		//.invert()
// 		//.hue(0.4)
// 		osc(2, 0.1, 0.8)
// 		.color(-1.2, 0.4)
//         .hue(0.1)
//         .saturate(2)
// 		.mult(osc(10, -0.05).modulateScale(osc(5, 0.2).color(1, 0), -0.5)
//           //   .thresh(0.2, 0.1)
//              )
// 		//.diff(s0)
// 		//.diff(s1)
//         .layer(src(o1).luma(0.2, 0))
// 		.mask(shape(4, 0.7, 0)
// 			.repeat(3, 1)
// 			.invert()
//          ))
// 	//  .modulateHue(o0, 0.8)
//     .blend(o1, () => {
//   		if(p1.y > 0.7) return 0
//   		return 1
// 	})
// 	.out()

// solid()
// 	.out(o1)

// src(o1)
//     .brightness(() => (1 - p2.x) * -0.04)
//  	.modulateHue(o1, () => (p3.y)*4)
// 	.scrollY(() => (p2.y) * -0.004)
// 	.layer(src(s0).invert()
// 		.scrollY(-0.02)
//         .brightness(() => -(1-p2.x))
//      )
// 	//.layer(s1)
// 	.out(o1)

// render(o0)
}