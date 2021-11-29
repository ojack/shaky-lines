const Agent = require('./agent.js')


module.exports = class Rect extends Agent{
    constructor(emit) {
        super(emit)
        this.g.beginFill(0xDE3249);
        this.g.drawRect(0, 0, 100, 100);
        this.g.endFill();

        // this.g.interactive = true
        // this.g.buttonMode = true
       // this.g.pivot.set(50)
     
        //this.g.position.set(200, 200)
        this.updatePivot()
    }
}