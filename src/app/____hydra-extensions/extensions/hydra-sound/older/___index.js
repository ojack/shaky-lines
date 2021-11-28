const Kit = require('./kit.js')

var currentKit, context, kits;
var convolver;
var compressor;
var masterGainNode;
var effectLevelNode;
var filterNode;

// Each effect impulse response has a specific overall desired dry and wet volume.
// For example in the telephone filter, it's necessary to make the dry volume 0 to correctly hear the effect.
var effectDryMix = 1.0;
var effectWetMix = 1.0;

var kitNames = [
    "R8",
    "CR78",
    "KPR77",
    "LINN",
    "Kit3",
    "Kit8",
    "Techno",
    "Stark",
    "breakbeat8",
    "breakbeat9",
    "breakbeat13",
    "acoustic-kit",
    "4OP-FM",
    "TheCheebacabra1",
    "TheCheebacabra2"
    ];

var kitNamePretty = [
    "Roland R-8",
    "Roland CR-78",
    "Korg KPR-77",
    "LinnDrum",
    "Kit 3",
    "Kit 8",
    "Techno",
    "Stark",
    "Breakbeat 8",
    "Breakbeat 9",
    "Breakbeat 13",
    "Acoustic Kit",
    "4OP-FM",
    "The Cheebacabra 1",
    "The Cheebacabra 2"
    ];

window.onload = () => {
  context = new AudioContext();

  kits = kitNames.map ( (name) => new Kit({ name: name, context: context }))

  kits.forEach( (kit) => kit.load())

  currentKit = kits[0]
  // kits = new Array(numKits);
  // for (var i  = 0; i < numKits; i++) {
  //     kits[i] = new Kit(kitName[i]);
  // }

  createEffectNodes()
}

window.onclick = () => {
  setInterval( () =>
  playNote(kits[Math.floor(Math.random()*kits.length)].kickBuffer, true, 0,0,-2, 0.5, 1.0, 1.0, 1.0), 300 )
}

function playNote(buffer, pan, x, y, z, sendGain, mainGain, playbackRate, noteTime) {
    // Create the note
    var voice = context.createBufferSource();
    voice.buffer = buffer;
    voice.playbackRate.value = playbackRate;

  //  voice.connect( context.destination)
    // Optionally, connect to a panner
    var finalNode;
    if (pan) {
        var panner = context.createPanner();
        panner.panningModel = "HRTF";
        panner.setPosition(x, y, z);
        voice.connect(panner);
        finalNode = panner;
    } else {
        finalNode = voice;
    }

    // Connect to dry mix
    var dryGainNode = context.createGain();
    dryGainNode.gain.value = mainGain * effectDryMix;
    finalNode.connect(dryGainNode);
    dryGainNode.connect(masterGainNode);

    // Connect to wet mix
    var wetGainNode = context.createGain();
    wetGainNode.gain.value = sendGain;
    finalNode.connect(wetGainNode);
    wetGainNode.connect(convolver);

     voice.start(noteTime);
}

function createEffectNodes () {
  var finalMixNode;
  if (context.createDynamicsCompressor) {
      // Create a dynamics compressor to sweeten the overall mix.
      compressor = context.createDynamicsCompressor();
      compressor.connect(context.destination);
      finalMixNode = compressor;
  } else {
      // No compressor available in this implementation.
      finalMixNode = context.destination;
  }

  // create master filter node
  filterNode = context.createBiquadFilter();
  filterNode.type = "lowpass";
  filterNode.frequency.value = 0.5 * context.sampleRate;
  filterNode.Q.value = 1;
  filterNode.connect(finalMixNode);

  // Create master volume.
  masterGainNode = context.createGain();
  masterGainNode.gain.value = 0.7; // reduce overall volume to avoid clipping
  masterGainNode.connect(filterNode);

  // Create effect volume.
  effectLevelNode = context.createGain();
  effectLevelNode.gain.value = 1.0; // effect level slider controls this
  effectLevelNode.connect(masterGainNode);

  // Create convolver for effect
  convolver = context.createConvolver();
  convolver.connect(effectLevelNode);
}
