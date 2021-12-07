
### 
p0.interval = () => choose([125, 500])
p0.bang = (p) => { // what to do on each trigger}

p0.set({
    interval: 
    bang:
})

pAll.set({
    interval:
})

### Utility functions
`choose([1, 2, 4])` randomly selects from values
`quantize(value, array)` maps a value between 0 and 1 to an element of an array
`rand(min, max)` gets a random value
`

### Midi out


to do tuesday:
1. how to select midi scale + notes
2. add speed parameter to 
3. ! select midi device (1 or mutliple??)
4. show trigger on interval
5. change midi .send to midi.note


overall:
-- show / hide lines

later:
-- pass previous bang state


















### Options
- interval: free, 1, 1/2, 1/3, 1/4, 1/8, 1/16, 1/32 (cut line to fit interval)
- use probability (on / off)
- live code box for "bang" // includes midi and/or synth options
- repetitions (i.e. parrallel lines correspond to notes)
- wrap, repeat, palindrome
- continuous vs. trigger on pixel change


### To do tuesday:
- ability to "live code" ---> just use variables for different voices and regular editor
- put editor on the side
- key commands to save code to local storage
- visual feedback for trigger points

### To do:
- line smoothing
- save files / presets to a preset "bank"
- can select different agents or colors
- separate hydra box to the side for coding
- pressing numbers selects different voice 
- add faust and web audio modules
- add delay and reverb
