export default {
    minValue: 1, // min argument value possible
    maxValue: 10, // max argument value possible
    minBoundedValue: 0,   // min argument value possible for small range
    maxBoundedValue: 1, // max argument value possible for small range
    minFunctions: 2, // min amount of functions possible
    maxFunctions: 5, // max amount of functions possible,
    // mouseProbability: 0.28,
    mouseProbability: 0,
    sources: [
      "gradient",
      "osc",
       "noise",
      "shape",
      // "voronoi",
      "osc"
    ],
    colorTransforms: [
      //"invert",
      "contrast",
      //"brightness",
      //"luma",
      //"thresh",
      "color",
      "saturate",
      "hue",
      "colorama"
    ],
    coordTransforms: [
      "rotate",
      "scale",
      "pixelate",
      // "repeatX",
      // "repeatY",
      "repeat",
      "kaleid",
      "scrollX",
      "scrollY"
    ],
    modulateTransforms: [
      "modulate",
       "diff",
      // "modulateHue",
      "modulateKaleid",
      "modulatePixelate",
      "modulateRotate",
      "modulateScale",
      "modulateRepeat",
    //  "blend"
       // "layer"
      //"modulateRepeatX",
      //"modulateRepeatY",
      //"modulateScrollX",
      //"modulateScrollY",
    ]
  }
  