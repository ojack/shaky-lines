const ipc = require('node-ipc')

// send messages to faust running in electron via node-ipc

class Faust {
  constructor () {
    console.log('started!')
    ipc.config.id   = 'hydra';
    ipc.config.retry= 1500;

    ipc.connectTo(
      'faust',
      function(){
        ipc.of.faust.on(
          'connect',
          function(){
            ipc.log('## connected to world ##'.rainbow, ipc.config.delay);
            ipc.of.faust.emit(
              'message',  //any event or message type your server listens for
              'hello'
            )
          }
        );
        ipc.of.faust.on(
          'disconnect',
          function(){
            ipc.log('disconnected from world'.notice);
          }
        );
        ipc.of.faust.on(
          'message',  //any event or message type your server listens for
          function(data){
            ipc.log('got a message from world : '.debug, data);
          }
        );
      }
    );
  }

  setParam(path, value) {
    ipc.of.faust.emit(
      'param',
      { path: path,   //any event or message type your server listens for
        value: value}
    )
  }
}

module.exports = Faust
