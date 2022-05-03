
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


//// 
synth = new Tone.PolySynth().toDestination();
// set the attributes across all the voices using 'set'
synth.set({ detune: -1200 });

base = 100
notes =
  [0, 1, 2, 3, 4, 5]

//
//play a middle 'C' for the duration of an 8th note
p0.set({
  interval: 100,
  trigger: ({ y }) => {
    n = base + quantize(1 - y/height, notes)
   console.log(n) 
   synth.triggerAttackRelease(n, "8n");
  }
})