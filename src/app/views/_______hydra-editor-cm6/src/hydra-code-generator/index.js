import hydraFunctions from 'hydra-synth/src/glsl/glsl-functions.js'
import config from './config.js'

console.log('CONFIG IS', config)
const { colorTransforms, coordTransforms, modulateTransforms } = config

const getMouseFunction = (min, max, dir) => `() => ${min.toFixed(2)} + mouse.${dir}*(${(max - min).toFixed(2)}/width)`

const map = (val, in1, out1, in2, out2) => out1 + (val - in1) * (out2 - out1) / (in2 - in1)

const allTransforms = [...colorTransforms, ...coordTransforms, ...modulateTransforms]

const rng = Math.random
const extraCode = ''



const templates = {
    gradient: () => `gradient(${r(-0.2, 0.2)})`
    // , osc: () => `osc(${genRandomValue(false)}, ${genRandomValue(false)}, ${genRandomValue(false)})`
    , osc: () => `osc(${rInt(2, 15)}, ${r(-0.1, 0.1)}, ${r(-3, 3)})`
    , noise: () => `noise(${r(1.5, 5)}, ${r(-0.1, 0.1)})`
    , shape: () => `shape(${genRandomValue(false)+2}, ${r(0.15, 0.85)}, ${r(0, 0.4)})`
    , voronoi: () => `voronoi(${genRandomValue(false)}, ${r(-0.2, 0.2)}, ${genRandomValue(true)})`
    , feedback: () =>  `src(o0)`
  
    , invert: () => `.invert(${genRandomValue(false)})`
    , contrast: () => `.contrast(${r(1, 5)})`
    , brightness: () => `.brightness(${genRandomValue(true)})`
    , luma: () => `.luma(${genRandomValue(true)})`
    , thresh: () => `.thresh(${genRandomValue(true)}, ${genRandomValue(true)})`
    , color: () => `.color(${r(-2.0, 2.0)}, ${r(-2.0, 2.0)}, ${r(-2.0, 2.0)})`
    //, color: () => `.color(${rInt(-2.0, 2.0)}, ${rInt(-2.0, 2.0)}, ${rInt(-2.0, 2.0)})`
    , saturate: () => `.saturate(${genRandomValue(false)})`
    , hue: () => `.hue(${genRandomValue(true)})`
    , colorama: () => `.colorama(${r(0, 3)})`
  
   , rotate: () => `.rotate(${genRandomValue(false)}, ${r(-0.5, 0.5)})`
    , scale: () => `.scale(${r(0.1, 4)}, ${r(0.1, 4)}, ${r(0.1, 4)})`
    , pixelate: () => `.pixelate(${r(4, 90)}, ${r(4, 90)})`
    // , repeatX: () => `.repeatX(${genRandomValue(false)}, ${genRandomValue(false)})`
    // , repeatY: () => `.repeatY(${genRandomValue(false)}, ${genRandomValue(false)})`
    , repeat: () => `.repeat(${rInt(1, 4)}, ${rInt(1, 4)}, ${r(0, 1)}, ${r(0, 1)})`
    , kaleid: () => `.scrollY(0.5).kaleid(${genRandomValue(false)})`
    , scrollX: () => `.scrollX(${genRandomValue(false)}, ${r(-0.1, 0.1)})`
    , scrollY: () => `.scrollY(${genRandomValue(false)}, ${r(-0.1, 0.1)})`
    , layer: () =>  `.layer(${generateMultiple(1)}
      .mask(
        ${generateMultiple(1)}.thresh(${r(0.4, 0.6)}, ${r(0, 0.3)})
      )
    )`
    , layerBW: () =>  `.layer(${generateMultiple()}.saturate(0).mask(${generateMultiple(1)}.thresh(${r(0.4, 0.6)}, ${r(0, 0.3)})))`
    , diff: () =>  `.diff(${generateMultiple(3)})`
    , blend: () =>  `.blend(${generateMultiple(1)})`
    , modulate: () => `.modulate(${generateMultiple(1)}, ${genRandomValue(true)})`
    , modulateHue: () => `.modulateHue(${generateMultiple(1)}, ${genRandomValue(true)})`
    , modulateKaleid: () => `.scrollY(0.5).modulateKaleid(${generateElementFrom(config.sources)}, ${r(0.1, 20)})`
    , modulatePixelate: () => `.modulatePixelate(${generateElementFrom(config.sources)}, ${rInt(3, 100)}, ${rInt(3, 100)})`
    , modulateRotate: () => `.modulateRotate(${generateElementFrom(config.sources)}, ${genRandomValue(true)})`
    , modulateScale: () => `.modulateScale(${generateElementFrom(config.sources)}, ${genRandomValue(true)})`
    , modulateRepeat: () => `.modulateRepeat(${generateElementFrom(config.sources)}, ${genRandomValue(true)})`
  }

export function getFromName (f) {
    const func = templates[f]
    if(func !== undefined) {
        let str = templates[f]()
        if (str.indexOf('.') === 0) str = str.substring(1, str.length)
        return str
    }
    return `${f}()`
}
  
export function generateRandom () {  
    //if(useSeed) rng = seedrandom(seed)
    let codeString = "";
    codeString += extraCode
    // Generate a source
  
    // Generate some functions
    codeString += generateMultiple()
    codeString += "\n"
    codeString += templates.layer()
    let functionsAmount = getRandomBetween(0, 2, false);
    for (var i = 0; i < functionsAmount; i++) {
      codeString += "\n"
      codeString += generateElementFrom(allTransforms)
    }
    codeString += "\n.out(o0)"
  
    //  this.mouseProbability = 50 // reset it back
    // Return finished code/sketch
    return codeString
  }

  export const testSnippets = [
    {label: 'layer', detail: 'short', apply: 'layer(osc(4, 0.05, 1.2).mask(shape(4, 0.1, 0)))'},
    { label: 'modulate', detail: 'gradient out', apply: `modulate(solid()
    .add(gradient()
      .pixelate(2, 2)
      .brightness(-0.5)
    ),
   -0.08)
    `},
    { label: 'mult', detail: 'mask lines', apply: `.mult(
      osc(40, 0.0).rotate(Math.PI/2).pixelate(10, 10).modulateScale(osc(4).color(0, 1).pixelate(10, 10), -0.9, 1).thresh(0.1))`}
  ]
  
  function generateMultiple(maxFunctions = config.maxFunctions, minFunctions = config.minFunctions) {
    let functionsAmount = getRandomBetween(minFunctions, maxFunctions, false);
    let codeString = "";
    codeString += generateElementFrom(config.sources)
    // Generate some functions
    for (var i = 0; i < functionsAmount; i++) {
      // if((i == functionsAmount-1) && (this.mouseProbability != 0)){ // last iteration and mouse was not generated yet
      //   this.mouseProbability = 100
      // }
      codeString += "\n"
      codeString += generateElementFrom(allTransforms)
    }
    return codeString
  }
  
  function getRandomBetween(min, max, decimal){
    if(decimal){
      return (rng() * (max - min) + min).toFixed(2)
    }
    else{
      return Math.floor(rng() * (max - min + 1)) + min;
    }
  }
  
  function genRandomValue(bounded){ // random number between this.min and this.max
    // if(this.getRandomBetween(0, 100, false) <= this.mouseProbability){
    //   this.mouseProbability = 0
    //   return this.mouseParameters[this.getRandomBetween(0, this.mouseParameters.length-1, false)]
    // }else{
    if(bounded){ // bounded random number, for when smaller values are needed
      return getRandomBetween(config.minBoundedValue, config.maxBoundedValue, true)
    }
    else{
      return getRandomBetween(config.minValue, config.maxValue, false)
    }
    //  }
  }
  
  //const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;
  
  // (value - 0) * (y2 - 1) / (y1 - 0) + 1
  // value * (y2 - 1) / y1 + 1
  function r (min=config.minValue, max=config.maxValue) {
    const m = map(rng(), 0, min, 1, max)
    //.toFixed(2)
    if(rng() < config.mouseProbability) {
      //return `m${rng() > 0.5 ? 'x':'y'}(${m.toFixed(2)}, ${(m + 0.5*m).toFixed(2)})`
      return getMouseFunction(m*0.6, m*1.5, rng() > 0.5 ? 'x':'y')
    } else {
    //  const m = map(rng(), 0, min, 1, max).toFixed(2)
      return m.toFixed(2)
    }
  
    //  return `() => ${min}+(mouse.y/height)*${rng()}*${max-min}`
  }
  
  function rInt (min, max) {
    const m = map(rng(), 0, min, 1, max).toFixed(0)
  //  return Math.floor(m)
    if(rng() < config.mouseProbability) {
      const dir = rng() > 0.5 ? 'x':'y'
      return `() => ${m}+(mouse.${dir}/width)*${4}`
    } else {
      return Math.floor(m)
    }
  }
  
  
  
  function generateElementFrom(array){
    let pos = getRandomBetween(0, array.length-1, false);
    let element = array[pos]
    return templates[element](); // executes method called [element]
  }
  
