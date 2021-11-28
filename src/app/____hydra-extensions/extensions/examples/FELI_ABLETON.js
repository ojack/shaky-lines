msg.IP = '192.168.178.137'

msg.outgoingPort = 5500

msg.setPort(51200)

msg.send({ address: "/kick", args: [{type: 'float', value: 13}, {type: 'float', value: 12}]})

s0.initCam()

osc(30).modulateScale(osc(4, -0.04), -0.99).out()

p1 = pixel({
  count: 1,
  x: 300,
  y: 400,
  tick: ({px}) => msg.send({ address: "/kick", args: [{type: 'float', value: 13}, {type: 'float', value: px.value*127}]})
})

p2 = pixel({
  count: 1,
  x: 700,
  y: 400,
  tick: ({px}) => msg.send({ address: "/kick", args: [{type: 'float', value: 1}, {type: 'float', value: px.value*127}]})
})


osc(20, 0.01).modulate(o0, 0.12).rotate(0, 0.01).scrollX(0, 0.01).out()


osc(5).out()

src(s0).saturate(0).contrast().out()

solid().out()

src(o0)
  .layer(
  	osc(20, 0.08).mask(shape(3, 0.2).diff(shape(3, 0.19)).scrollY(0.1))
).scale(() => 0.99 + a.fft[0]*0.03).modulate(o0, () => -a.fft[2]*0.02).out()

a.show()
