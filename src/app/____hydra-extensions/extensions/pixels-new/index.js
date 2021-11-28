// processes attached to an object called p... code iterates through p and updates functions
// if doesn't exist yet, calls constructor, otherwise calls update to maintain internal steta
// p.myP = pixels({
//   sl: asld,
//   s0w: asld
// })

// to do:
// how to make this possible?
// p1.x = 300
//
// API for erasing external canvas

// functions for timing:
// pattern(-1, 100).secs(3).wrap().ramp()
//

// @todo: DIFFERENCE BETWEEN updating existing object and instantiating

// already done
// how to deal with internal variables in arrow functions?
// 1) possibly, pass the pixel to itself ({ px, ctx, gl}) => {
//}




module.exports = function ({ gl, ctx}) {
  var gl = gl

  ctx.fillStyle = "rgb(255, 255, 255)"

  var Pixel = function (opts) {
    // this.x = 0
    // this.y = 0
    if (!(this instanceof Pixel)){
      return new Pixel(opts)
    }
    var args = {}
    var initialArgs = Object.assign({}, {
      count: 3,
      x: Math.random(),
      y: ({ i }) => i*200,
      tick: (dt) => {},
      triggerThresh: 0.5,
      updateInterval: 0,
      trigger: () => {},
      draw: ({ px, ctx }) => {
        ctx.lineWidth = 10;
        var width = 10 + px.red * 100
        ctx.strokeStyle = "#FF0000";
        ctx.strokeRect(px.x - width/2, px.y - width/2, width, width)
        //ctx.strokeRect(px.x - 4, px.y - 4, 4, 4)

        var width = 10 + px.green * 100
        ctx.strokeStyle = "#00FF00";
        ctx.strokeRect(px.x - width/2, px.y - width/2, width, width)
      //  ctx.strokeRect(px.x - 4, px.y - 4, 4, 4)

        var width = 10 + px.blue * 100
        ctx.strokeStyle = "#0000FF";
        ctx.strokeRect(px.x - width/2, px.y - width/2, width, width)
      //  ctx.strokeRect(px.x - 4, px.y - 4, 4, 4)
      }
    }, opts)
    //
    Object.keys(initialArgs).map((key) => {
      var val = initialArgs[key]
      //console.log(val)
      if (typeof val == 'function') {
        args[key] = val
      } else {
        args[key] = () => ( val )
      }
    //  this[key] = try { val() } catch (e) { console.log(e)}
    })

    this.pixels = Array(initialArgs.count).fill(0).map(() => {
      return {
        value: 0,
        x: 0,
        y: 0,
        updateInterval: 0,
        triggerThresh: 0.5,
        trigger: false,
        pixels: new Uint8Array(4*1),
        timeSinceLastUpdate: 0,
        updating: false,
        red: 0,
        blue: 0,
        value: 0,
        green: 0
      }
    })

    this.px = {}
    this.px.value = 0
    this.px.x = 0
    this.px.y = 0
    this.px.updating = false
    this.px.triggerThresh = 0.5
    this.px.trigger = false
    this.px.pixels = new Uint8Array(4*1)

//    this.px.red = this.px.blue = this.px.green = 0
  //  this.px.timeSinceLastUpdate = 0


    // array containing names of user-defined arguments
    this.args = args
  }
  //
  Pixel.prototype.updateHydra = function (dt) {
  //  console.log('updating')

    // this.argRefs.forEach( (arg) => {
    //   this[arg] = try { this.args[arg]({
    //     px: this,
    //     ctx: ctx
    //   }) } catch (e) { console.log(e)}
    // })
    // update x and y position of pixels
    // console.log('updating', this.pixels)
     this.pixels = this.pixels.map(( px, index) => {


         var opts = {
           px: px,
           ctx: ctx,
           i: index
         }

         var newPx = Object.assign({}, px)

         newPx.timeSinceLastUpdate = px.timeSinceLastUpdate + dt
         newPx.x = this.args['x'](opts)
         newPx.y = this.args['y'](opts)
         newPx.updateInterval = this.args['updateInterval'](opts)
         newPx.triggerThresh = this.args['triggerThresh'](opts)
        // this.y = this.args['y'].call(this)
    //   console.log(px)
        newPx.updating = false
        if (newPx.timeSinceLastUpdate >=newPx.updateInterval){
          newPx.updating = true
          newPx.timeSinceLastUpdate = 0
          gl.readPixels(newPx.x, ctx.canvas.height - newPx.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px.pixels)
          newPx.red = px.pixels[0]/255
          newPx.green = px.pixels[1]/255
          newPx.blue = px.pixels[2]/255

          var newVal = (newPx.red + newPx.green + newPx.blue)/3
          //console.log(this.value, newVal, this.triggerThresh)
          if(newPx.value < newPx.triggerThresh && newVal > newPx.triggerThresh) {
            newPx.trigger = true
            console.log(newPx.value, newVal, newPx.triggerThresh)
            newPx.value = newVal
            this.args['trigger'](opts)
          } else {
            newPx.trigger = false
          }
          newPx.value = newVal
          this.args['tick'](opts)
        }


        this.args['draw'](opts)
      //  console.log(newPx.x)
        return newPx
      //this.draw()
      })
     }
  //    var opts = {
  //      px: this.px,
  //      ctx: ctx
  //    }
  //    this.px.x = this.args['x'](opts)
  //    this.px.y = this.args['y'](opts)
  //    this.px.triggerThresh = this.args['triggerThresh'](opts)
  //   // this.y = this.args['y'].call(this)
  //
  //   gl.readPixels(this.px.x, ctx.canvas.height - this.px.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, this.px.pixels)
  //   this.px.red = this.px.pixels[0]/255
  //   this.px.green = this.px.pixels[1]/255
  //   this.px.blue = this.px.pixels[2]/255
  //
  //   var newVal = (this.px.red + this.px.green + this.px.blue)/3
  //   //console.log(this.value, newVal, this.triggerThresh)
  //   if(this.px.value < this.px.triggerThresh && newVal > this.px.triggerThresh) {
  //     this.px.trigger = true
  //     this.px.value = newVal
  //     this.args['trigger'](opts)
  //   } else {
  //     this.px.trigger = false
  //   }
  //   this.px.value = newVal
  //   this.args['tick'](opts)
  //   this.args['draw'](opts)
  //   //this.draw()
  // }

  // var update = function (dt) {
  // //  args['tick'].bind(this)
  //
  // //  console.log(this)
  // //  console.log(args)
  // }
  //
  // return {
  //   x: x,
  //   y: y,
  //   update: update
  // }
  //}

  return { pixel: Pixel}
}
