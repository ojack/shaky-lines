
const dgram = require('dgram')


class Pilot{
    constructor() {
      this.client = dgram.createSocket('udp4');

      // console.log('sending', message)
      // client.send(message, 49161, 'localhost', (err) => {
      //   console.log('ERR', err)
      //   client.close();
      // });
    }



    play(channel, octave, note, velocity, length) {
      var msg = '' + channel + octave + note
      if(velocity) msg+=velocity
      if(length) msg+= length

      const message = Buffer.from(msg);
      this.client.send(message, 49161, 'localhost', (err) => {
        if(err !== null) console.log('UDP ERROR', errR)
        //this.client.close();
      });
    }

    send(msg) {
      const message = Buffer.from(msg);
      this.client.send(message, 49161, 'localhost', (err) => {
        if(err !== null) console.log('UDP ERROR', errR)
        //this.client.close();
      });
    }

}
// osc(100, 0).rotate(-0.2, 0.1).scrollX(0, 0.1).out()
//
// scale = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
//
// p1 = pixel({
//   count: 5,
//   x: 200,
//   y: ({i}) => 100 + i *80,
//   trigger: ({i}) => pilot.play(5, 2, scale[i+2], 'f', Math.floor(Math.sin(time)*10 + 10))
// })
//
// p2 = pixel({
//   count: 5,
//   x: 320,
//   y: ({i}) => 100 + i *80,
//  // trigger: ({i}) => pilot.play(3, 1, scale[i+1], 'f', 'e')
// })
//
//
// p1 = pixel({
//   x: 200,
//   y: ({i}) => 100 + i *100,
//   trigger: ({i}) => pilot.send(`3${i}Cf2`)
// })



  module.exports = Pilot
