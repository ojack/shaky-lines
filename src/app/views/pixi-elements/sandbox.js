const PIXI = require('pixi.js')
const Midi = require('./../../util/midi.js')
const transpose = require('./../../util/transpose.js')

const rand = (min, max) => min + Math.random()*(max-min)
module.exports = (stage, app) => {
    const container = new PIXI.Container()
    container.position.x = rand(200, window.innerWidth - 1000)
    container.position.y = rand(200, window.innerHeight - 100)
    const g = new PIXI.Graphics()
   g.beginFill(0xffffff);
   g.drawRect(-5, -5, 10, 10);
   g.endFill();
    container.addChild(g)

    for(var i = 0; i < 50; i++) {
        const clone = new PIXI.Graphics(g.geometry)
        clone.position.x = i*20
        container.addChild(clone)
        clone.tint = 0xffffff*i/10
        clone.scale.x = (50 -i) / 10
        clone.scale.y = (50 -i) / 10
    }
    stage.addChild(container)

    // trying out midi events
    this.midi = new Midi()
    this.midi.start()

    const notes = Object.keys(transpose)
    this.midi.push(0, 3, notes[2], 15, 1)

    const randNote = () => Math.floor(Math.random() * notes.length)
    
    let time = 0
    setInterval((dt) => {
        time += 0.1
        // midi channel, octave, note, velocity, length
       this.midi.push(1, 2, notes[randNote()], 4 + Math.sin(time)*3 , 2)
       // this.midi.push(0, 3, 4, 15, 0.4)
    }, 500)

    console.log(this.midi)

    app.ticker.add((dt) => {
        this.midi.run()

      //  this.midi.push(0, 3, 4, 1)

    })
}