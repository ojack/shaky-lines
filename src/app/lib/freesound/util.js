//calculate a euclidean rhythm
function euclid(steps,  pulses){
    const storedRhythm = []; //empty array which stores the rhythm.
    //the length of the array is equal to the number of steps
    //a value of 1 for each array element indicates a pulse

    var bucket = 0; //out variable to add pulses together for each step

    //fill array with rhythm
    for( var i=0 ; i < steps ; i++){ 
        bucket += pulses; 
            if(bucket >= steps) {
            bucket -= steps;
            storedRhythm.push(1); //'1' indicates a pulse on this beat
        } else {
            storedRhythm.push(0); //'0' indicates no pulse on this beat
        }
    }
    const pat = storedRhythm.reverse()
  //  console.log('pattern', pat)
    const dur = []
    let curr = 0
    let chunk = window.cycle / pat.length
    pat.forEach((val, i) => {
       
        if(val === 1 && i != 0) {
            dur.push(curr)
            curr = 0
        } 
        curr += chunk
    })
    dur.push(curr)
 //   console.log(dur)
    return dur
}

// window.euclid = euclid

function rotateSeq(seq, rotate){
    var output = new Array(seq.length); //new array to store shifted rhythm
    var val = seq.length - rotate;

    for( var i=0; i < seq.length ; i++){
        output[i] = seq[ Math.abs( (i+val) % seq.length) ];
    }

    return output;
}

// trans liberation / frequency to midi
const ftm = (freq = 440) => 69 + 12 * Math.log2(freq / 440)

const seq = (arr = [], dur = 1) => {
    let i = 0
    return (v) => {
      const curr = i
      i+= 1/dur
      if(i >= arr.length) i = 0
      return arr[Math.floor(curr)]
    }
  }

  // weighted random
const wrand = (outcomes = [], _prob = []) => {
    const probabilities = outcomes.map((_, i) => _prob[i] ? _prob[i] : 1)
  //  console.log('WRAND', probabilities, outcomes)
    const sum = probabilities.reduce((a, b) => a + b, 0)
    const scaledProbs = probabilities.map((p) => p/sum)
    const r = Math.random()
    let index = outcomes.length - 1
    let thresh = 0
    scaledProbs.forEach((p, i) => {
        if( r < p + thresh && i < index) {
            index = i
        }
        thresh += p
    })
    return outcomes[index]
}

// const seq = (arr = [], start = 0) => {
//     let i = start
//     /*arr.forEach((val, i) => {
//       if(typeof val == 'function') {
//         arr[i] = val()
//       }
//     })
//     console.log('arr', arr)*/
//     return (v) => {
//       const curr = i
//       i++
//       if(i >= arr.length) i = 0
//       let r = arr[i]
//       if(typeof r == 'function') {
//         r = r()
//       } else {
//        // console.log(r, arr, i)
//         return r
//       }
//     }
//   }

module.exports = { wrand, ftm, euclid, seq: seq }