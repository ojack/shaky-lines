const Bus = require('nanobus')


module.exports = class Midi extends Bus {
    constructor (){
        super()
        this.connect()

        this.inputs = []
        this.outputs = []
        this.currDevice = null
    }

    initDevices(midi) {
        this.inputs = [];
        this.outputs = [];
        
        // MIDI devices that send you data.
        const inputs = midi.inputs.values();
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            this.inputs.push(input.value);
        }
        
        // MIDI devices that you send data to.
        const outputs = midi.outputs.values();
        for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
          this.outputs.push(output.value);
        }

        this.emit('device update', this.inputs, this.outputs)

        if(this.outputs.length > 0) {
            this.currDevice = 0
        }

        const midiMessageReceived = (e, input) => {
            //console.log(e, input)
        }

        // start listening
        for (const input of this.inputs) {
            input.addEventListener('midimessage', (e) => midiMessageReceived(e, input));
          }

        console.log('midi outputs', this.outputs)
    }

    select(i) {
        if(this.outputs.length > i) {
            this.currDevice = i
        }
    }

    note(pitch = 60, velocity = 100, duration = 100, channel = 0) {
        if(this.currDevice !== null) {
            const NOTE_ON = 0x90;
            const NOTE_OFF = 0x80;

            const channelOn = NOTE_ON + channel
            const channelOff = NOTE_OFF + channel
            
            const msgOn = [channelOn, pitch, velocity];
            const msgOff = [channelOff, pitch, velocity];
            
            // First send the note on;
           this.outputs[this.currDevice].send(msgOn); 
                
            // Then send the note off. You can send this separately if you want 
            // (i.e. when the button is released)
           this.outputs[this.currDevice].send(msgOff, performance.now() + duration); 
        }
    }

    cc(controller = 0, val = 100) {
        if(this.currDevice!== null) {
            this.currDevice.send([0xB0, controller, val])
        }
    }

    connect() {
        if(navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess()
            .then(
            (midi) => {
            // midi.addEventListener('statechange', (event) => this.initDevices(event.target));
                this.initDevices(midi)
            },
            (err) => console.log('Something went wrong', err))
        } else {
            console.warn('this browser does not accept midi')
        }

         
    }
}