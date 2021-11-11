const { fabric } = require('fabric')

console.log(fabric)

const canvasEl = document.createElement('canvas')
canvasEl.width = 300
canvasEl.height = 300
document.body.appendChild(canvasEl)

var canvas = new fabric.Canvas(canvasEl);

// create a rectangle object
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 20,
  height: 20
});

// what if you could animate properties by clicking?
rect.animate('angle', 45, {
  onChange: canvas.renderAll.bind(canvas)
});

// "add" rectangle onto canvas
canvas.add(rect);

console.log(canvas.getObjects()) // get all objects on canvas (rect will be first and only)

console.log(rect.stateProperties) // show all properties of object

console.log(canvas.toObject())


const canvas2 = document.createElement('canvas')
canvas2.width = 1280
canvas2.height = 720
document.body.appendChild(canvas2)
var fCanvas2 = new fabric.Canvas(canvas2);

fCanvas2.loadFromJSON(canvas.toObject())

console.log(rect.toObject())
window.rect = rect
