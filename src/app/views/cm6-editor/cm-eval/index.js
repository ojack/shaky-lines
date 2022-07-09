var $2PxG5$codemirrorview = require("@codemirror/view");
var $2PxG5$codemirrorstate = require("@codemirror/state");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
function $parcel$exportWildcard(dest, source) {
  Object.keys(source).forEach(function(key) {
    if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) {
      return;
    }

    Object.defineProperty(dest, key, {
      enumerable: true,
      get: function get() {
        return source[key];
      }
    });
  });

  return dest;
}

$parcel$export(module.exports, "evaluation", () => $173ebc3a70f309ba$export$3c325aded05baed9);
$parcel$export(module.exports, "evalDecoration", () => $4e00bf281f356ff0$export$5e689c64bf3fb584);
$parcel$export(module.exports, "evalTheme", () => $df3dee4b839c7070$export$4b4d3694579b7726);

var $d3a583a1f11f8cb5$exports = {};

$parcel$export($d3a583a1f11f8cb5$exports, "evalEffect", () => $d3a583a1f11f8cb5$export$c2bf470af77e4dd3);
$parcel$export($d3a583a1f11f8cb5$exports, "evalAction", () => $d3a583a1f11f8cb5$export$bb503c03891c2919);

const $d3a583a1f11f8cb5$export$c2bf470af77e4dd3 = (0, $2PxG5$codemirrorstate.StateEffect).define();
function $d3a583a1f11f8cb5$export$bb503c03891c2919(action) {
    return (0, $2PxG5$codemirrorstate.EditorState).transactionExtender.of((tr)=>{
        for (let effect of tr.effects)if (effect.is($d3a583a1f11f8cb5$export$c2bf470af77e4dd3)) {
            let { from: from , to: to  } = effect.value;
            action(tr.newDoc.sliceString(from, to));
        }
        return null;
    });
}


var $f99a460d860f18ea$exports = {};

$parcel$export($f99a460d860f18ea$exports, "evalKeymap", () => $f99a460d860f18ea$export$2155d1d52566256d);
$parcel$export($f99a460d860f18ea$exports, "evalSelection", () => $f99a460d860f18ea$export$1293e1f1c133c1b9);
$parcel$export($f99a460d860f18ea$exports, "evalLine", () => $f99a460d860f18ea$export$ef06a4cf5e011065);
$parcel$export($f99a460d860f18ea$exports, "evalBlock", () => $f99a460d860f18ea$export$2a4f73b290bf21b7);

const $f99a460d860f18ea$export$2155d1d52566256d = [
    {
        key: "Shift-Enter",
        run: $f99a460d860f18ea$export$1293e1f1c133c1b9
    },
    {
        key: "Mod-Enter",
        run: $f99a460d860f18ea$export$1293e1f1c133c1b9
    },
    {
        key: "Shift-Enter",
        run: $f99a460d860f18ea$export$ef06a4cf5e011065
    },
    {
        key: "Mod-Enter",
        run: $f99a460d860f18ea$export$2a4f73b290bf21b7
    }, 
];
function $f99a460d860f18ea$export$1293e1f1c133c1b9({ state: state , dispatch: dispatch  }) {
    if (state.selection.main.empty) return false;
    dispatch({
        effects: (0, $d3a583a1f11f8cb5$export$c2bf470af77e4dd3).of(state.selection.main)
    });
    return true;
}
function $f99a460d860f18ea$export$ef06a4cf5e011065({ state: state , dispatch: dispatch  }) {
    const line = state.doc.lineAt(state.selection.main.from);
    dispatch({
        effects: (0, $d3a583a1f11f8cb5$export$c2bf470af77e4dd3).of(line)
    });
    return true;
}
function $f99a460d860f18ea$export$2a4f73b290bf21b7({ state: state , dispatch: dispatch  }) {
    let { doc: doc , selection: selection  } = state;
    let { text: text , number: number  } = state.doc.lineAt(selection.main.from);
    if (text.trim().length === 0) return true;
    let fromL, toL;
    fromL = toL = number;
    while(fromL > 1 && doc.line(fromL - 1).text.trim().length > 0)fromL -= 1;
    while(toL < doc.lines && doc.line(toL + 1).text.trim().length > 0)toL += 1;
    let { from: from  } = doc.line(fromL);
    let { to: to  } = doc.line(toL);
    dispatch({
        effects: (0, $d3a583a1f11f8cb5$export$c2bf470af77e4dd3).of({
            from: from,
            to: to
        })
    });
    return true;
}





function $4e00bf281f356ff0$export$5e689c64bf3fb584() {
    const lifespan = 500;
    return (0, $2PxG5$codemirrorview.ViewPlugin).fromClass(class {
        decorations = (0, $2PxG5$codemirrorview.Decoration).none;
        update({ transactions: transactions  }) {
            for (let tr of transactions){
                this.decorations = this.decorations.map(tr.changes);
                this.decorations = this.decorations.update({
                    add: tr.effects.filter((e)=>e.is((0, $d3a583a1f11f8cb5$export$c2bf470af77e4dd3)) && e.value.from !== e.value.to).map(({ value: { from: from , to: to  }  })=>(0, $2PxG5$codemirrorview.Decoration).mark({
                            class: "cm-evaluated",
                            time: tr.annotation((0, $2PxG5$codemirrorstate.Transaction).time)
                        }).range(from, to)),
                    sort: true,
                    filter: (_f, _t, { spec: { time: time  }  })=>{
                        return typeof time === "number" && time + lifespan > Date.now();
                    }
                });
            }
        }
    }, {
        decorations: (v)=>v.decorations
    });
}



const $df3dee4b839c7070$export$4b4d3694579b7726 = (0, $2PxG5$codemirrorview.EditorView).theme({
    "@keyframes cm-eval-flash": {
        from: {
            backgroundColor: "#FFFFFF"
        },
        to: {
            backgroundColor: "#FFFFFF00"
        }
    },
    "& .cm-evaluated": {
        animation: "cm-eval-flash 0.5s"
    }
});






function $173ebc3a70f309ba$export$3c325aded05baed9(action) {
    return [
        (0, $d3a583a1f11f8cb5$export$bb503c03891c2919)(action),
        (0, $4e00bf281f356ff0$export$5e689c64bf3fb584)(),
        (0, $df3dee4b839c7070$export$4b4d3694579b7726),
        (0, $2PxG5$codemirrorview.keymap).of((0, $f99a460d860f18ea$export$2155d1d52566256d)), 
    ];
}
$parcel$exportWildcard(module.exports, $d3a583a1f11f8cb5$exports);
$parcel$exportWildcard(module.exports, $f99a460d860f18ea$exports);


//# sourceMappingURL=index.js.map
