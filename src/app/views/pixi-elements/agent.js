const PIXI = require('pixi.js')

const params = [ 
    { key: 'scale', type: 'xy' }, 
    { key: 'skew', type: 'xy' }, 
    { key: 'position', type: 'xy'},
    { key: 'angle', type: 'number'}
]

// const showXY = (key, point) => {
//     // console.log('type', typeof point)
//     return ['x', 'y'].map((i) => showParam(
//     `${key}${i}`,point[i], (e) => point.set(e.target.value)
//     ))
//   }

// draggable agent 
module.exports = class Agent {
    constructor (emit) {
        const self = this
        const graphics = new PIXI.Graphics()
        const container = new PIXI.Container()

        container.interactive = true
       
        container
        .on('pointerdown', onDragStart)
        .on('pointerup', onDragEnd)
        .on('pointerupoutside', onDragEnd)
        .on('pointermove', onDragMove);

        this.container = container
        container.addChild(graphics)
        this.g = graphics
        this.container.cursor = 'move'

        this.params = [
            { key: 'angle', 
            type: 'number', 
            step: 0.2,
            value: () => self.container['angle'],
            set:  (val) => self.container['angle'] = val
        },   { key: 'tint', 
        type: 'number', 
        // value: () => PIXI.utils.hex2string(self.g['tint']),
        // set:  (val) => {
        //  self.g['tint'] = Number(`0x${val.substr(1)}`)
        // }
        value: () => self.g['tint'],
        step: 10,
        set:  (val) => {
         self.g['tint'] =val
        }
    }
        ]

        // const appendParam = ()
        // params.forEach((param) => {

        // })



        function onDragStart(event) {
            // console.log(this, event)
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            const localPosition = this.data.getLocalPosition(this.parent)
            console.log('starting', localPosition, event.data, event)
            this.alpha = 0.5;
            this.dragging = true;
            // this.cursor = 'move'
        }
        
        function onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
            emit('select', self)
        }
        
        function onDragMove() {
            if (this.dragging) {
                const newPosition = this.data.getLocalPosition(this.parent);
                this.x = newPosition.x;
                this.y = newPosition.y;
                emit('select', self)

            }
        }
    }

    // set pivot for graphics to be in the center of the container
    // to do: adjust pivot on drag start
    updatePivot() {
        const w = this.g.width
        const h = this.g.height
        const bounds = this.g.getBounds()
        const pivotX = bounds.x + bounds.width/2
        const pivotY = bounds.y + bounds.height/2
    
        this.container.pivot.set(pivotX, pivotY)
        this.container.position.set(pivotX, pivotY)
        // this.container.position.set(this.container.x + w/2, this.container.y + h/2)
    }

    // initParams() {
    //     this.params = {}
    //     params.forEach((param) => {
    //        // this.paramsy
    //     })
    // }


}