//
module.exports = {
  init: () => {
    var midi = null;  // global MIDIAccess object

    function onMIDISuccess( midiAccess ) {
      console.log( "MIDI ready!" );
      midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
      midi.outputs.forEach((out) => console.log(out))
      var portId = '6FF5590044F4859ED50C5167BCFE9700A1798E39AA55A628E86D39011FAECD5D'

      window.out = midiAccess.outputs.get(portId)
    }

    function onMIDIFailure(msg) {
      console.log( "Failed to get MIDI access - " + msg );
    }

    navigator.requestMIDIAccess( { sysex: true } ).then( onMIDISuccess, onMIDIFailure );

    // MIDI docs
    //
    // // midi output
    //
    // function sendMiddleC( midiAccess, portID ) {
    //   var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
    //   var output = midiAccess.outputs.get(portID); // 6FF5590044F4859ED50C5167BCFE9700A1798E39AA55A628E86D39011FAECD5D
    //   output.send( noteOnMessage );  //omitting the timestamp means send immediately.
    //   output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,
    //                                                                       // release velocity = 64, timestamp = now + 1000ms.
    // }
  }
}
