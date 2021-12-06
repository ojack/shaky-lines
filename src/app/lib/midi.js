module.exports = class Midi {
    constructor (){
        this.connect()

        this.inputs = []
        this.outputs = []
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

        if(this.outputs.length > 0) {
            this.currDevice = this.outputs[0]
        }

        const midiMessageReceived = (e, input) => {
            console.log(e, input)
        }

        // start listening
        for (const input of this.inputs) {
            input.addEventListener('midimessage', (e) => midiMessageReceived(e, input));
          }

        console.log('midi outputs', this.outputs)
    }

    send(pitch = 60, velocity = 100, duration = 100) {
        if(this.currDevice) {
            const NOTE_ON = 0x90;
            const NOTE_OFF = 0x80;
            
            const msgOn = [NOTE_ON, pitch, velocity];
            const msgOff = [NOTE_OFF, pitch, velocity];
            
            // First send the note on;
           this.currDevice.send(msgOn); 
                
            // Then send the note off. You can send this separately if you want 
            // (i.e. when the button is released)
           this.currDevice.send(msgOff, performance.now() + duration); 
        }
    }

    connect() {
        navigator.requestMIDIAccess()
        .then(
        (midi) => {
           // midi.addEventListener('statechange', (event) => this.initDevices(event.target));
            this.initDevices(midi)
        },
          (err) => console.log('Something went wrong', err))

         
    }
}