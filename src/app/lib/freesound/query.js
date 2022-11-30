//var filter = "duration:[0%20TO%201.5]";
// var page_size = 5 //10;
// available fields: https://freesound.org/docs/api/resources_apiv2.html#sound-instance-response
var fields = "id,name,previews,license,username,description,created,analysis,ac_analysis";
var descriptors = "lowlevel.spectral_centroid.mean,lowlevel.pitch.mean,rhythm.bpm";

freesound.setToken("d31c795be3f70f7f04b21aeca4c5b48a599db6e9");

// @todo: add pitch, duration, etc.
module.exports.query =  function ({query = "bell", minDuration, maxDuration, pageSize = 5},callback) {
    console.log('querying', query)
    let filter = ''
    if(minDuration !== null) {
        filter += `duration:[${minDuration}%20TO%20${maxDuration}]`
        // filter+= `%20ac_note_midi:60`
    }
    freesound.textSearch(query, {page:1, filter:filter, 
        fields:fields, 
        // descriptors_filter:
    //    descriptors_filter: 'lowlevel.pitch.mean:[219.9 TO 220.1]',
        // target: "lowlevel.pitch.mean:1200",
        descriptors: descriptors, 
         page_size:pageSize, 
         group_by_pack:0},
         callback
         ,function(err){ console.log("Error while searching...", err)}
     );
}

module.exports.loadSimilar = ({sound, minDuration, maxDuration, pageSize = 5}, success, error) => {
    let filter = ''
    if(minDuration !== null) {
        filter += `duration:[${minDuration}%20TO%20${maxDuration}]`
        // filter+= `%20ac_note_midi:60`
    }
    console.log('filter is', filter)
    sound.getSimilar(success, error, {
        fields: fields,
        filter: filter,
        descriptors: descriptors,
        page_size: pageSize
    })
}



// window.search = (query = "hello") => {
//     console.log('searching', query)
//     freesound.textSearch(query, {page:1, filter:filter, 
//        fields:fields, descriptors: descriptors, 
//         page_size:page_size, group_by_pack:1},
//         function(sounds){
//             console.log('got sounds', sounds)
//             // sounds.results = shuffle(sounds.results); // randomize
//                 for (var i in sounds.results){
//                     const sound = sounds.results[i]
//                     const audioEl = document.createElement('audio')
//                     document.body.appendChild(audioEl)
//                     audioEl.src = sound.previews[audio_preview_key]
//                     audioEl.play()
//                 }
//                 const urls = {}
//                 sounds.results.forEach((sound) => {
//                     const midi = Math.floor(ftm(sound.analysis.lowlevel.pitch.mean))
//                     urls[midi] = sound.previews[audio_preview_key]
//                 })
//                 console.log('urls', urls)
//                 const sampler = new Tone.Sampler({
//                     urls,
//                     baseUrl: "",
//                     onload: () => {
//                         sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
//                     }
//                 }).toDestination()
//                 window.sampler = sampler
//             //     if (i < 16){
//             //         var sound = sounds.results[i];
//             //         NEW_TRIGGERS_SOUND_INFORMATION.push({'id':sound.id,
//             //                                          'preview': sound.previews[audio_preview_key],
//             //                                          'name':sound.name,
//             //                                          'license':sound.license,
//             //                                          'username':sound.username,
//             //                                          'description':sound.description,
//             //                                          'created':sound.created
//             //         });
//             //         load_sound(i, sound.previews[audio_preview_key]); 
//             //     }
//             // }
//             // TRIGGERS_SOUND_INFORMATION = NEW_TRIGGERS_SOUND_INFORMATION;
//             // destroy_popovers();
//             // for (var i = 0; i < 16; i++) {
//             //     set_popover_content("trigger_" + i);
//             // }
//             // set_progress_bar_value(100);

//         },function(err){ console.log("Error while searching...", err)}
//     );
// }