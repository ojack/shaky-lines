const assetsBaseURL = "/Users/ojack/PROJECTS/TEXTUALIDADES/FOOTAGE/"
const videos = {
  lv: "louisville.mov",
  br: "brionna.mov",
  j: "julianna.mov",
  twitter: "twitter.mov",
  paro: "paro.mp4 ",
//  paro2: "paro21s-1.mov",
  ropocops: "robocops.mp4",
  politicos: "politicos.mp4",
  monumento: "monumento.mp4"
}

const images = {
  biblioteca: "cai-biblioteca.jpg",
  cai2: "CAI-cara.jpg",
  cai: "cai-cara-antes.jpg"
}

module.exports = {
  startup: () => {
    window.v = {}
    window.hide = () => fabricCanvas.style.opacity = 0
    window.show = () => fabricCanvas.style.opacity = 1
    Object.keys(videos).forEach((key) => {
      window.v[key] = `${assetsBaseURL}${videos[key]}`
    })
    Object.keys(images).forEach((key) => {
      window.v[key] = `${assetsBaseURL}${images[key]}`
    })
    setFunction({
  name: 'lumaInvert',
  type: 'color',
  inputs: [
    {
      type: 'float',
      name: 'threshold',
      default: 0.5,
    },
{
      type: 'float',
      name: 'tolerance',
      default: 0.1,
    }
  ],
  glsl:
`   float a = smoothstep(threshold-tolerance, threshold+tolerance, _luminance(_c0.rgb));
   return vec4(_c0.rgb, (1.0 - a)*_c0.a);`
})


    s0.init({ src: fabricCanvas })
  //  text("hi")
  //  osc().diff(s0).out()
  },
  presets: [
() => {
  // flash in and out
  hide()

  text()
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
},
() => {
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
}, () => { // 2
  src(o0)
   .brightness(-0.01)
.layer(
    src(s1)
        .diff(osc(2, 0.03, 0.9))
        .luma(0.8, 0.001).saturate(1.2)
)
  .saturate(1.1)
  .out()
    }, () => { //3
    }, () => { //4
    }, () => { //5
    }, () => { // 6
    }, () => { // 7
    }, () => { // 8
    }, () => { // 9
    }, () => { // 10
    }
  ]
}
