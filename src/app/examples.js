
// change stroke
p0.set({
    strokeOptions: { 
      size: 60, 
      thinning: 2, 
      smoothing: 0, 
      streamline: 0 }
  })


notes = scale("A3", "pentatonic", 3)
p0.set({
    trigger: (v) => { 
        const { value, y, x, _timeToNext } = v
        const note = quantize(1 - y/height, notes)
        midi.note( note, 100, _timeToNext - 10, 0)
    },
    interval: 200
})