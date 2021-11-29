const PIXI = require('pixi.js')
const createParam = require('./param.js')

const params = [
    { key: 'scale', type: 'number', coords: ['x', 'y'], step: 0.2 },
    { key: 'skew', type: 'number', coords: ['x', 'y'],  step: 0.1 },
    { key: 'position', type: 'number', coords: ['x', 'y'], step: 1 },
    { key: 'angle', type: 'number', step: 0.2 },
    { key: 'tint', type: 'number', target: 'g', step: 10 }, // tint is a property of the graphics object:
    { key: 'alpha', type: 'number', step: 0.1 },
    // { key: 'blendMode', type: 'select', options: PIXI.BLEND_MODES, target: 'g'}
]

// const createSquare = (x,  y, tint = 0x00ff00) => {
//     const square = new PIXI.Sprite(PIXI.Texture.WHITE);
//     square.tint = tint;
//     square.factor = 1;
//     square.anchor.set(0.5);
//     square.position.set(x, y);
//     return square;
// }

// const createControl = (w, h) => {
//   const container = new PIXI.Container()
//    const center = createSquare(0, 0, 0xff0000)
//    const corners = [createSquare(-w/2, -h/2), createSquare(w/2, -h/2), createSquare(w/2, h/2), createSquare(-w/2, h/2)]
//    corners.forEach((corner) => { container.addChild(corner) })
//    container.addChild(center)

//    return {
//        container: container,
//        corners: corners, 
//        center: center
//    }
// }

module.exports = class Agent {
    constructor(emit, child = null) {
        const self = this
        
      //  this.control = createControl(200, 200)

        this.clones = []

        const container = new PIXI.Container()

        container.interactive = true

        container
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);

        this.container = container
        // console.log('child value', child)
        if(child === null) {
            // console.log('creating graphis', this)
            const graphics = new PIXI.Graphics()
            this.g = graphics
        } else {
            this.g = child
        }

        container.addChild(this.g)

        
        this.container.cursor = 'move'

        this.params = []

        const addParam = (param) => {
            const { key, target = 'container' } = param
            const p = Object.assign({}, param, {
                get: () => self[target][key],
                _set: (val) => {

                    self[target][key] = val
                }
            })
            this.params.push(createParam(p))
        }

        const addXYParam = (param) => {
            const { key, target = 'container', coords } = param
            // const arr = ['x', 'y']
            // arr.forEach((i) => console.log(i))
            coords.forEach((i) => {
                // console.log('i', i)
                const p = Object.assign({}, param, {
                    key: `${key}.${i}`,
                    get: () => self[target][key][i],
                    _set: (val) => { 
                        self[target][key][i] = val
                    }
            })

            this.params.push(createParam(p))

            })
        }

        params.forEach((param) => {
            // if(param.type = )
            if (param.coords) {
                addXYParam(param)
            } else {
                addParam(param)
            }
        })

        // create map of params to access as object
        this.paramsObj = {}
        this.params.forEach((param) => {
            this.paramsObj[param.key] = param
        })

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
                console.log(self.paramsObj)
                const newPosition = this.data.getLocalPosition(this.parent);
                // this.x = newPosition.x;
                // this.y = newPosition.y;
                self.paramsObj['position.x'].set(newPosition.x)
                self.paramsObj['position.y'].set(newPosition.y)
                emit('select', self)

            }
        }

        this.container.params = this.params
    }

    repeat(num = 4) {
        const parent = this.container.parent
        new Array(num).forEach(() => {
            
        })
    }

    calculatePivot() {
        const w = this.g.width
        const h = this.g.height
        const bounds = this.g.getBounds()
        const pivotX = bounds.x + bounds.width / 2
        const pivotY = bounds.y + bounds.height / 2
        return {
            x: pivotX, y: pivotY, bounds: bounds
        }
    }

    // set pivot for graphics to be in the center of the container
    // to do: adjust pivot on drag start
    updatePivot() {
        const w = this.g.width
        const h = this.g.height
        const bounds = this.g.getBounds()
        const pivotX = bounds.x + bounds.width / 2
        const pivotY = bounds.y + bounds.height / 2

        this.container.pivot.set(pivotX, pivotY)
        this.container.position.set(pivotX, pivotY)
     //   this.control.container.position.set(pivotX, pivotY)
        // this.container.position.set(this.container.x + w/2, this.container.y + h/2)
    }
}