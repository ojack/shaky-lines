class Grain {
  constructor(context, {
    attack = 0.4,
    release = 0.4,
    duration = 0.1,
    // spread = 0.2,
    // reverb = 0.5,
    pan = 0.1,
    trans = 1,
    buffer,
    dest,
    start = 0, // point within sample to start grain, in seconds this.positionx * (buffer.duration / w);
    gain = 0.5 // position / heig
  } = {}) {
    this.context = this.context
  //  console.log('context', context)
    this.now = context.currentTime

  //  console.log(trans)
    // init source
    this.source = context.createBufferSource()
  //  this.source.playbackRate.value = this.source.playbackRate.value * trans;
    this.source.playbackRate.value = trans
    this.source.buffer = buffer;

    //create the gain for enveloping
  	this.gain = context.createGain();

    //experimenting with adding a panner node - not all the grains will be panned for better performance
  	var yes = parseInt(Math.random() * 3,10);
  	if( yes === 1){
  		this.panner = context.createPanner();
  		this.panner.panningModel = "equalpower";
  		this.panner.distanceModel = "linear";
  		this.panner.setPosition(Math.random()*(pan * -1,pan),0,0);
  		//connections
  		this.source.connect(this.panner);
  		this.panner.connect(this.gain);
  	}else{
  		this.source.connect(this.gain);
  	}

    this.gain.connect(dest);


    //parameters
    this.attack = attack
     this.release = release
   // this.attack = attack * 0.4;
   //  this.release = release * 1.5;
   //
   //  if(this.release < 0){
  	// 	this.release = 0.1; // 0 - release causes mute for some reason
  	// }
  	//this.spread = spread;

//    this.randomoffset = (Math.random() * this.spread) - (this.spread / 2); //in seconds
  	///envelope

    var offsetSeconds = start % buffer.duration

//    var start = offsetSeconds + this.randomoffset
  //  if(start <= 0) start = 1
  //  console.log('start', start, offsetSeconds, buffer.duration)
  //  console.log('starting', this.now, offset + this.randomoffset,this.attack + this.release)
  	this.source.start(this.now, offsetSeconds,this.attack + duration + this.release); //parameters (when,offset,duration)
  	this.gain.gain.setValueAtTime(0.0, this.now);
  	this.gain.gain.linearRampToValueAtTime(gain,this.now + this.attack);
  	this.gain.gain.linearRampToValueAtTime(0,this.now + (this.attack +  duration + this.release) );

    //garbage collection
  	this.source.stop(this.now + this.attack + duration + this.release + 0.1);
  	var tms = (this.attack + duration + this.release) * 1000; //calculate the time in miliseconds

    var self = this
    setTimeout(function(){
  		self.gain.disconnect();
  		if(yes === 1){
  			self.panner.disconnect();
  		}
  	},tms + 200);
  }
}

module.exports = Grain
