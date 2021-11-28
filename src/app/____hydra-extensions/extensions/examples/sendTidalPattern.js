
circlePattern = []

msg.IP = 'stanage.local'
msg.outgoingPort = 5051


count = 16
p1 = pixel({
  count: count,
  x: ({i}) => Math.sin(Math.PI*2*i/count)*300 + window.innerWidth/2,
  y: ({i}) =>  Math.cos(Math.PI*2*i/count)*300 + window.innerHeight/2,
  tick: ({px, i}) =>  {
    circlePattern[i*3] = px.red
    circlePattern[i*3+1] = px.green
    circlePattern[i*3+2] =  px.blue
  }
/*  draw: ({ctx, px, i}) => {
    ctx.fillRect(px.x, px.y, 2 + px.red, 10)
  },*/
})


count = 16
p1 = pixel({
  count: count,
//  x: ({i}) => Math.sin(Math.PI*2*i/count)*300 + window.innerWidth/2,
  x: ({i}) => i *90,
  y: 600,
 // y: ({i}) =>  Math.cos(Math.PI*2*i/count)*300 + window.innerHeight/2,
  tick: ({px, i}) =>  {
    circlePattern[i*3] = px.red
    circlePattern[i*3+1] = px.green
    circlePattern[i*3+2] =  px.blue
  }
/*  draw: ({ctx, px, i}) => {
    ctx.fillRect(px.x, px.y, 2 + px.red, 10)
  },*/
})


count2 = 10
p2 = pixel({
  count: 0,
  x: ({i}) => Math.sin(Math.PI*2*i/10)*200 + window.innerWidth/2,
  y: ({i}) =>  Math.cos(Math.PI*2*i/10)*200 + window.innerHeight/2
})
count3 = 6
p3 = pixel({
  count: 0,
  x: ({i}) => Math.sin(Math.PI*2*i/count3)*100 + window.innerWidth/2,
  y: ({i}) =>  Math.cos(Math.PI*2*i/count3)*100 + window.innerHeight/2
})

osc(50, 0.02, 0.8).thresh(0.9, 0.2).color(0, 0, 1)
  .add(osc(40, -0.02).thresh(0.95, 0.01).color(2, 0, 0))
//  .kaleid()
  // .add(osc(30, -0.02).color(0, 1, 0))
  .out()

shape(4, 0.5)
  .repeat(4, 10)
  .color(1, 0, 0)
  .rotate(0, 0.2)
  .add(shape(4, 0.7).repeat(3).color(0, 0.5).rotate(0, -0.2).scrollX(0, 0.1), 1)
  .out()


solid().out()

src(o0).layer(shape(3, 0.01)).scrollX(0.004).rotate(0.1).scale(1.01).out()


s0.initScreen(2)

src(s0).scale(1.4).rotate(0, 0).scrollX(0, 0.01)
  .out()

solid().layer(src(s0).scale(1, 1, 2).scrollY(0, 0.01)).out()


osc(30, 0.007).diff(osc(20, -0.01)).mult(osc(60, 0.004).thresh()).out()


osc(100, 0.01, 0.6).thresh(0.1).rotate(0, 0.02).mult(osc(20, 0.01).rotate(0, -0.28).color(1, -1, -1)).out()

if(int) clearInterval(int)
int = setInterval(() => {
  args =  circlePattern.map((val) => ({ type: 'float', value: val}))
  //console.log('hi')
  msg.send({ address: '/circle', args: args})
}, 500)

//STRIPEY synth
osc(3, 0.05).thresh(0.7, 0.4).mult(osc(60, -0.03).modulateScale(osc(4, 0.0004), -0.6)).diff(osc(3, -0.04, 1.8).color(1, 0.1, 0).modulate(src(o0).scale(1.2).pixelate(1000, 1000).rotate(0, 0.04).scrollX(0, 0.01), () => a.fft[0]*0.1)).out()

/// CAMERA RHYTHM

count = 48
p1 = pixel({
  count: count,
  x: ({i}) => 40 + Math.floor(i/3) *90,
  y: ({i}) => 120 + Math.floor((i%3))*250,
  tick: ({px, i}) =>  {
    circlePattern[i] = px.value
  }
})

src(s0).brightness(-0.05).contrast(2).saturate(0).out()

src(o0)
   // .blend(solid(), 0.06)
    .brightness(-0.96)
	.layer(
		src(s0).brightness(-25).contrast(2).saturate(0).luma()
	)
 //  .scrollX(-0.15)
 // .modulate(osc(4, 0.25).color(1, 0), -0.15)
   .scale(1, 0.99)
   .out()
