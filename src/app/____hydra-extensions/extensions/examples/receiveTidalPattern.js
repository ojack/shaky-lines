p = Pattern('3 4 <5 4> 10')

cyclePosition = 0
cps = 1

msg.setPort(5050)
tidalPattern = ''
msg.on('/pattern', (args) => {
  console.log(args)
  tidalPattern = args[0].value
  console.log(tidalPattern)
  try {
	p = Pattern(tidalPattern)
  } catch (e) {
    console.log(e)
  }
  cps = args[1].value
  cyclePosition = args[2].value
})

// time = cyclePosition/cps
// dPos = dt*cps

canvas.update = ({dt}) => {
  cyclePosition += (dt/1000)*cps
 // console.log(cyclePosition)
}

getValuesAtTime = (mult) => () => {
 // var t = mult*time
 // var cyclePosition = time*cps
return p.query(Math.floor(cyclePosition), 1).filter((event) => {
  var start = event.arc.start.n/event.arc.start.d
  var end = event.arc.end.n/event.arc.end.d
  if(cyclePosition%1 < end && cyclePosition%1 >= start) return true
  return false
}).map((event) => event.value)[0]}



shape(getValuesAtTime(1)).repeat(() => getValuesAtTime(1)+1, getValuesAtTime(1)).luma().color(1,() => Math.sin(time*10), 0.6).contrast().out(o0)


src(o1)
 // .blend(src(o0).rotate(0, 0.2), 0.2)
  .layer(src(o0).rotate(0, 0.2).modulateScale(osc(4), -0.9).luma(), 0.02)
  //.modulateHue(o0, 4)
  .scale(1, 1.01, 1, 0.4, 0.2)
  .out(o1)

src(o0)
	.layer(
      shape(2)
        .repeat(1, getValuesAtTime(0.5)).luma()
      //  .mask(shape(2, 0.2, 0).repeat(3).rotate(Math.PI/2).scrollX(0, 0))
  		//.diff(shape(2, 0.5, 0).rotate(Math.PI/2).scrollX(0, 0).luma())
  )
   .scrollX(0.001)
   .modulateScale(osc(4), -0.01)
  // .rotate(0, -0.00002)
  .out()


src(o1)
	.layer(osc(43, 0.01, 0.8).mask(o0))
    .scrollY(0.001)
    .out(o1)

shape(getValuesAtTime(1)).luma().color(1, 0, 0).out(o0)

osc().out()

render(o0)
