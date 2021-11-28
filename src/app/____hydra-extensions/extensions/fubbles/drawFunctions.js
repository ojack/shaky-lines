const funcCreator = (funcObj) => (min = -1, max = 1, speed = 1, palindrome = false) => {
  if(typeof(min) === 'function') min = min()
  if(typeof(max) === 'function') max = max()
  if(typeof(speed) === 'function') speed = speed()
  if(typeof(palindrome) === 'function') palindrome = palindrome()
  return () => funcObj.get(time, min, max, speed, palindrome)
}


module.exports = class drawFunctions {
  constructor({ parent, width, height = 60, index }) {

    this.selected = false

  //  this.test = test

    this.canvas = document.createElement('canvas')
    this.canvas.width = width
    this.canvas.height = height

  //   this.canvas.addEventListener('mousedown', () => {
  // //    console.log('mousedown')
  //     //this.select()
  //     onEvent(index, this.selected)
  //   })
    parent.appendChild(this.canvas)

    this.ctx = this.canvas.getContext('2d')
    this.function = new myFunction()
  }

  // select() {
  //   this.selected = true
  //   this.canvas.style.border = "solid 2px white"
  // }
  //
  // deselect() {
  //   this.selected = false
  //     this.canvas.style.border = "none"
  // }

  start(val, time) {
    this.function.start(val, time)
  }

  update(val, time) {
    this.function.update(val, time)
  }

  stop(val, time) {
    this.function.stop(val, time)
  }

  get(...opts) {
    return this.function.get(...opts)
  }

  draw(time) {
    this.ctx.fillStyle = 'black'
  //  console.log(this.canvas.height)
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.function.draw(this.ctx, time,  this.canvas.width, this.canvas.height, 5, 10)
  }
}


const map = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// update, default go between -1 and 1
class myFunction {
  constructor(){
  //  this.x = 0
  //  this.y = 0
    this.vals = []
//    this.yVals = []
    this.isLogging = false
    this.startTime = 0
    this.endTime = 0
    this.length = 0
    this.min = -1
    this.max = 1
    this.lastValue = 0
  }

  start(val, time) {
    this.startTime = time
    this.vals = []
    this.isLogging = true
    this.update(val, time)
  }

  update(val, time) {
    if(this.isLogging) {
    //  console.log('x', val, 'y', val)
      this.vals.push(  {
          val: val,
          time: time - this.startTime
        }  )
    //  console.log(this.vals)
       this.endTime = time
       this.length = this.endTime - this.startTime
      // if (val < this.min) this.min = val
      // if (val > this.max) this.max = val
    }
  }

  draw(ctx, time, width, height, xStart, yStart) {
  //  console.log(height, yStart)
  //  console.log('drawing', this.startTime, this.endTime, time)
    ctx.strokeStyle = 'white'
      ctx.fillStyle = 'white'
  //    let relativeTime = (time - this.startTime)%this.length
    let relativeTime = (time - this.startTime)%this.length
    if(this.isLogging) relativeTime = this.vals[this.vals.length -1 ].time
    if(this.vals.length > 0) {
          // Start a new path

      for(var i = 0; i < this.vals.length - 1; i++) {
          ctx.beginPath();
          let startX = map(this.vals[i].time, 0, this.length, xStart, xStart+width)
          let startY = map(this.vals[i].val, this.min, this.max, yStart, yStart+height)
          let endX = map(this.vals[i + 1].time, 0, this.length, xStart, xStart+width)
          let endY = map(this.vals[i + 1].val, this.min, this.max, yStart, yStart+height)
      //    console.log('time', this.vals[i].time)
        ctx.moveTo(startX, startY);    // Move the pen to (30, 50)
        ctx.lineTo(endX, endY)  // Draw a line to (150, 100)
      ctx.stroke();
      if(relativeTime >= this.vals[i].time && relativeTime <= this.vals[i+1].time) {
        ctx.fillRect((startX+endX)/2 - 5, startY - 5, 10, 10)
      }
    }
    }

  }


  stop(time) {
    this.endTime = time
    this.isLogging = false
    this.length = this.endTime - this.startTime
  }

  get(_time, min, max, speed, palindrome) {
    var time = _time * speed
    let val = 0
    if(this.vals.length > 0) {
      if(this.isLogging) {
        val = this.vals[this.vals.length -1].val
      } else {
        var index
        let relativeTime = (time - this.startTime)%this.length
        //  console.log('p', (time-this.startTime)/this.length, (time-this.startTime)/this.length)
        if(palindrome && Math.floor((time-this.startTime)/this.length) % 2 == 0) {

          relativeTime = this.length - relativeTime
        }
          index = 0
          var time = this.vals[index].time
          while(relativeTime > time && index < this.vals.length - 1) {
            index++
            time = this.vals[index].time
          }
      //  }
        val = this.vals[index].val
      }
  //   console.log(this.min, this.max, min, max)
      //return val
      val = map(val, this.min, this.max, min, max)
    }
  //  let offset = time - this.startTime
  //  this.lastValue = val
    return val
  }
}
