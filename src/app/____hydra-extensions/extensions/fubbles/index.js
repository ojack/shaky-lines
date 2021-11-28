const Draw = require('./drawFunctions.js')
console.log('loaded fub')

const w = 500

const drawHeight = 400
const graphWidth = w/2 - 4

const funcCreator = (funcObj) => (min = -1, max = 1, speed = 1, palindrome = false) => {
  if(typeof(min) === 'function') min = min()
  if(typeof(max) === 'function') max = max()
  if(typeof(speed) === 'function') speed = speed()
  if(typeof(palindrome) === 'function') palindrome = palindrome()
//  console.log(funcObj)
  return () => funcObj.get(time, min, max, speed, palindrome)
}

const map = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const graphElement = (parent, clickHandler) => {
  const el = document.createElement('div')
  //  this.f.push(el)
  el.style.width = `${graphWidth}px`
  el.style.display = 'inline-block'
  el.style.border = '1px solid gray'
  // const selected = false
  el.addEventListener('click', clickHandler)
  parent.appendChild(el)

  return {
    el: el,
    select: () => {
      // selected = true
      el.style.border = '1.5px solid white'
    },
    deselect: () => {
      // selected = false
      el.style.border = '1px solid gray'
    }
  }
}

class Fubbles {
  constructor () {

    // document.getElementById('hydra-ui').style.width =  'calc(100% - 500px)'
    this.selectedIndex = null


    this.container = document.createElement('div')
    this.container.style.width = `${w}px`
    this.container.style.height = '100%'
    this.container.style.position = 'fixed'
    this.container.style.top = '0px'
    this.container.style.right = '0px'
    this.container.style.display = 'flex'
    this.container.style.flexDirection = 'column'

    this.functionContainer = document.createElement('div')
    this.functionContainer.width = '100%'

    this.targetArea = document.createElement('canvas')
    this.targetArea.width = w
    this.targetArea.height = drawHeight
    // this.targetArea.style.width = 'calc(100% - 320px)'
    this.targetArea.style.height = drawHeight
    // this.targetArea.style.position = 'fixed'
    // this.targetArea.style.top = '0px'
    // this.targetArea.style.left = '0px'
    this.targetArea.style.border = '1px solid gray'
    this.ctx = this.targetArea.getContext('2d')

    this.isRecording = false
    this.mouseX = 0
    this.mouseY = 0

    document.body.appendChild(this.container)
    this.container.appendChild(this.targetArea)
    this.container.appendChild(this.functionContainer)

    this.graphElements = []
    this.f = []
    new Array(10).fill(0).forEach((_, i) => {
      const f = graphElement(this.functionContainer, () => { this.updateSelection(i)})
      this.graphElements.push(f)
      this.f[i] = {
        x: new Draw({ parent: f.el, width: graphWidth, onEvent: this.updateSelection.bind(this), index: i }),
        y: new Draw({ parent: f.el, width: graphWidth, onEvent: this.updateSelection.bind(this), index: i})
      }
      window['f'+i] = {
        x: funcCreator(this.f[i].x),
        y: funcCreator(this.f[i].y)
      }
    })
    //  let test = new myFunction()
    // console.log('adding events to ', drawingEl)
    this.targetArea.addEventListener('mousedown', (e) => {
      console.log('mouse down!!')
      var rect = e.target.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left
      this.mouseY = e.clientY - rect.top
      if(this.selectedIndex !== null) {
        console.log(this)
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
        // this.showCanvas()
        this.f[this.selectedIndex].x.start(e.clientX, window.time)
        this.f[this.selectedIndex].y.start(e.clientX, window.time)
        this.isRecording = true
      }

    })

    this.targetArea.addEventListener('mousemove', (e) => {
      // if(this.selectedIndex !== null) {
      //   this.f[this.selectedIndex].x.update(e.clientX, window.time)
      //   this.f[this.selectedIndex].y.update(e.clientY, window.time)
      // }
      var rect = e.target.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left
      this.mouseY = e.clientY - rect.top
      // this.mouseX = e.clientX
      // this.mouseY = e.clientY
      //  console.log('MOUSE MOVW')
    })

    this.targetArea.addEventListener('mouseup', (e) => {
      var rect = e.target.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left
      this.mouseY = e.clientY - rect.top
      this.isRecording = false
      if(this.selectedIndex !== null) {
        // this.hideCanvas()
        this.f[this.selectedIndex].x.stop(time)
        this.f[this.selectedIndex].y.stop(time)
        //this.deselectAll()
      }
    })


    //  this.draw = new Draw()
    // window.f0 = (min = 0, max = 1, speed = 1, palindrome = false) => {
    //   if(typeof(min) === 'function') min = min()
    //   if(typeof(max) === 'function') max = max()
    //   if(typeof(speed) === 'function') speed = speed()
    //   if(typeof(palindrome) === 'function') palindrome = palindrome()
    //   return () => this.draw.test.get(window.time, min, max, speed, palindrome)
    // }
  }

  showCanvas() {
    this.targetArea.style.opacity = 1
  }

  hideCanvas() {
    this.targetArea.style.opacity = 0
  }

  deselectAll() {
    this.targetArea.style.pointerEvents = 'none'
    this.targetArea.style.border = '0px'
    this.selectedIndex = null
  }
  updateSelection(index, isSelected) {
    console.log('selected', isSelected)

    // this.f.forEach((f) => {
    //   f.x.deselect()
    //   f.y.deselect()
    // })
    this.graphElements.forEach((el) => {
      el.deselect()
      el.deselect()
    })

    if(index === this.selectedIndex) {
      this.deselectAll()
      console.log(this.f[index].x)
    } else {
      // this.f[index].x.select()
      // this.f[index].y.select()
      this.graphElements[index].select()
      console.log(this.f[index].x)
      this.selectedIndex = index
      this.targetArea.style.pointerEvents = 'auto'
      this.targetArea.style.border = '1px solid gray'
    }
    // if(!isSelected) {
    //
    //
    // } else {
    //   this.deselectAll()
    //     console.log(this.f[index].x)
    // }
    //

  }

  draw() {
    this.ctx.fillStyle = "rgba(0, 200, 200, 0.5)"
    console.log(this.mouseX, this.mouseY)
    this.ctx.fillRect(this.mouseX, this.mouseY, 10, 10)
  }
  updateHydra(dt) {
    if(this.isRecording) {
      var rect = this.targetArea.getBoundingClientRect();
      // console.log(rect)
      const x = map(this.mouseX, 0, rect.width, 1, -1)
      const y = map(this.mouseY, 0, rect.height, -1, 1)
      this.f[this.selectedIndex].x.update(x, window.time)
      this.f[this.selectedIndex].y.update(y, window.time)
      if(this.showCanvas) {
        this.draw()
      }
    }

    this.f.forEach((f) => {
      f.x.draw(time)
      f.y.draw(time)
    })
  }
}

module.exports = Fubbles
