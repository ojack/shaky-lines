const PIXI = require('pixi.js')


const params = [ 
    { key: 'scale', type: 'xy' }, 
    { key: 'skew', type: 'xy' }, 
    { key: 'position', type: 'xy'},
    { key: 'angle', type: 'number'}
  ]

// draggable agent 
module.exports = class Agent {
    constructor (emit) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xDE3249);
        graphics.drawRect(0, 0, 100, 100);
        graphics.endFill();

        graphics.interactive = true
        // graphics.buttonMode = true
        graphics.pivot.set(50)
        graphics.cursor = 'move'

        graphics.position.set(200, 200)
       
        graphics
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

        this.el = graphics


        function onDragStart(event) {
            // console.log(this, event)
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            // this.cursor = 'move'
        }
        
        function onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
            emit('select', this)
        }
        
        function onDragMove() {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
                emit('select', this)

            }
        }
    }

    initParams() {
        this.params = {}
        params.forEach((param) => {
           // this.paramsy
        })
    }


}