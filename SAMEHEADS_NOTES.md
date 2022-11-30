s2.initCam()

src(s2).luma(0.4, 0).mask(shape(4, 0.99, 0)).scale(0.6).contrast().scrollX(-0.1).scrollY(-0.2).out(o1)

solid().out()

f0.set({
  query: "conga",
  interval: [800, 100, 100, 100],
 // notes: ['a4', 'e3'],
  //index: () => wrand([0, 1, 2, 3, 4], [])
  mutate: 10,
  playbackRate: [0.2, 0.3, 0.6, 1, 2],
  index: [1, 2, 3, 4],
  gain: () => p0.y
})

src(o0)
    .scrollY(() => -0.008*p3.y)
   // .scale(1.01)
	.luma(0.03)
	 .blend(osc(2, 0.04, 1.2)
	 	.rotate(0, 0.04), 0.04)
	//.saturate(1.1))
    .saturate(() => 1.04 + p0.x*0.4)
	.contrast(1.01)
	.brightness(0.003)
	.hue(0.004)
	.colorama(0.0005)
	.blend(o0, 0.8)
	.modulateHue(src(o0), 2)
	.modulate(solid()
		.add(gradient()
			.hue(() => time * 0.04)
			.brightness(-0.5)
			.color(1, 1)
		),
		-0.00004)
	// .luma(0.3)
	//() => -p0.x*0.02)
    .layer(s0)
	.layer(o1)
	.layer(src(s1))
	.out()

src(o0).luma(0.3).out(o2)

render(o2)
