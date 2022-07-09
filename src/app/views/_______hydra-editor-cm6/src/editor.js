
import {
  keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
  rectangularSelection, crosshairCursor, placeholder,
 lineNumbers, highlightActiveLineGutter, EditorView, 
} from "@codemirror/view"
import {tags as t} from "@lezer/highlight"
import { EditorState, Compartment } from "@codemirror/state"
import interact from '@replit/codemirror-interact';
import EventEmitter from 'nanobus'

import {
  /*defaultHighlightStyle,*/ syntaxHighlighting, indentOnInput, bracketMatching,
 /* foldGutter,*/ foldKeymap, HighlightStyle
} from "@codemirror/language"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, /*completeFromList,*/ completionKeymap, snippetKeymap, snippetCompletion, closeBrackets, closeBracketsKeymap, startCompletion } from "@codemirror/autocomplete"
import { lintKeymap, linter, lintGutter, openLintPanel, forceLinting } from "@codemirror/lint"
import { jsLinter } from "./lint.js"
import { hydraSnippets } from "./hydra-environment/hydra-snippets.js"
// import Linter from "eslint4b-prebuilt";

import { flashTheme } from './hydra-environment/flash-code/flashTheme.js';
import { commentKeymap } from '@codemirror/comment';
import { javascript, javascriptLanguage/*esLint */ } from "@codemirror/lang-javascript"
import { oneDark, oneDarkHighlightStyle} from '@codemirror/theme-one-dark';
// import { solarizedDark } from 'cm6-theme-solarized-dark';

import { getLine, getBlock, getSelection, getAll } from './hydra-environment/flash-code/flashKeymaps.js'
import { flash } from './hydra-environment/flash-code'

import hydraKeys from './hydra-environment/keymaps.js'

import { js_beautify } from 'js-beautify'

// import EventEmitter from 'events'

export default class Editor extends EventEmitter {
  constructor({ parent = document.body, autocompleteOptions = [] } = {}) {
    super()
  //  console.log('LOADING EDITOR', autocompleteOptions)
    const self = this

    let evalLinter = new Compartment
    const hydraKeymaps = Object.entries(hydraKeys).map(([key, val]) => ({
      key: key,
      run: (opts) => {
        // console.log('called', val, opts)
        let text = ''
        if(val === 'editor:evalLine') {
          text = getLine(opts)
        } else if (val === 'editor:evalBlock') {
          text = getBlock(opts)
        } else if (val === 'editor:evalAll') {
          text = getAll(opts)
        } else if (val === 'hideAll') {
          // self.toggle()
        } else if (val === 'editor:formatCode') {
          // console.log('format code!')
          self.formatCode()
        } else if (val == 'editor:saveToLocalStorage') {
          this.emit('editor:save', this.cm.state.doc.toString()) 
        }
        self.emit(val, text)
       // setTimeout(() => { 
          self.cm.dispatch({
            effects: evalLinter.reconfigure(linter(jsLinter()))
          })
         // forceLinting(self.cm) 
        //}, 100)
      }
    }))
    this.cm = new EditorView({
      // lineWrapping: true,
      state: EditorState.create({
        // doc: "osc()",
        lineWrapping: true,
        extensions: [
          interact({
            rules: [
              // a rule for a number dragger
              {
                // the regexp matching the value
                regexp: /-?\b\d+\.?\d*\b/g,
                // set cursor to "ew-resize" on hover
                cursor: "ew-resize",
                // change number value based on mouse X movement on drag
                // @ todo: calculate how many decimal places, use that to determin sensitivity
                onDrag: (text, setText, e) => {
                  console.log(e)
                  const newVal = Number(text) + e.movementX + e.movementY/100;
                  if (isNaN(newVal)) return;

                  setText(newVal.toString());
                  const editorContents = getAll(self.cm, false)
                  self.emit('editor:evalAll', editorContents)
                },
              }
            ],
          }),
          flash(),
        //  lineNumbers(),
         highlightActiveLineGutter(),
          placeholder('//'),
          // lineWrapping(),
          highlightSpecialChars(),
          history(),
          lintGutter(),
        // foldGutter(),
          drawSelection(),
          dropCursor(),
          EditorView.lineWrapping,
          EditorView.domEventHandlers({
            click: (event, view) => {
            //  console.log('click', event, view)
              // startCompletion(view)
            },
            touchstart: (event, view) => {
              startCompletion(view)
            }
          }),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          syntaxHighlighting(HighlightStyle.define([
            {tag: t.keyword,
              color: 'white'},
            {tag: t.name, color: 'pink'},
              {tag: [ t.deleted, t.character, t.propertyName, t.macroName],
                color: 'white'},
               {tag: [t.function(t.variableName), t.labelName],
                color: 'white'},
               {tag: [t.color, t.constant(t.name), t.standard(t.name)],
                color: '#ff0'},
               {tag: [t.definition(t.name), t.separator],
                color: 'white'},
          ])),
          syntaxHighlighting(oneDarkHighlightStyle, { fallback: true }),
          bracketMatching(),
          autocompletion({ 
           override: [autocompleteOptions], 
           closeOnBlur: false
          }),
          closeBrackets(),
          rectangularSelection(),
          crosshairCursor(),
          highlightActiveLine(),
          highlightSelectionMatches(),
          keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap,
            ...commentKeymap,
            ...snippetKeymap.default,
            // ...evalKeymap
             ...hydraKeymaps
          ]),
          javascript(),
          // javascriptLanguage.data.of({
          //   autocomplete: [
          //    // snippetCompletion('mySnippet(${one}, ${two})', {label: 'mySnippet'})
          //   // autocompleteOptions,
          //    ...hydraSnippets
          //   ]
          // }),
         
          EditorView.theme({
            '&': {
              backgroundColor: 'transparent',
              fontSize: '15px',
              // color: 'white',
              fontFamily: `'Roboto Mono', monospace`,
              // mixBlendMode: 'difference'
            },
            '& .cm-scroller': {
              fontFamily: `'Roboto Mono', monospace`
            },
            '& .cm-line': {
              maxWidth: 'fit-content',
              background: 'hsla(50,23%,5%,0.6)',
              padding: '0px'
            ///  background: 'rgba(0, 0, 0, 1)'
            // background: 'blue'
            },
            '& .cm-activeLine': {
              // background: 'red',
              // color: 'black'
            },
            '& .ͼo': {
              color: 'white'
            },
            '& .cm-tooltip.cm-tooltip-autocomplete > ul': {
              minWidth: '80px',
              fontFamily: `'Roboto Mono', monospace`
            },
            '&.cm-focused': {
              outline: 'none',
            },
            '& .cm-gutters': {
              background: 'none'
            },
            '& .cm-tooltip': {
              background: `rgba(0, 0, 0, 0.5)`,
              // color: '#abb2bf'
            },
            '& .cm-tooltip-autocomplete > ul > li[aria-selected]': {
              color: 'white',
              // color: '#abb2bf',
              backgroundColor: 'rgba(255, 0, 0, 0.7)'
            },
            '.cm-completionInfo': {
              // fontFamily: 'monospace',
              fontFamily: `'Roboto Mono', monospace`,
              fontStyle: 'italic',
              // color: '#abb2bf',
              padding: '1.5px 9px'
            },
            '.cm-completionIcon': {
              width: '4px',
              height: '10px',
              opacity: 1,
              paddingRight: '0px',
              marginRight: '6px'
            },
            '.cm-completionIcon-src': {
              backgroundColor: 'orange',
            },
            '.cm-completionIcon-coord': {
              backgroundColor: 'yellow',
            },
            '.cm-completionIcon-color': {
              backgroundColor: 'lightgreen',
            },
            '.cm-completionIcon-combine': {
              backgroundColor: 'lightblue',
            },
            '.cm-completionIcon-combineCoord': {
              backgroundColor: 'purple',
            },
            '.cm-completionIcon-src:after': {
              content: 'ƒ'
            },
            // linter styles
            '.cm-panels': {
              background: 'none',
            },
            '.cm-panels.cm-panels-bottom': {
              border: 'none'
            },
            '.cm-diagnostic-info': {
              border: 'none',
            },
            '.cm-diagnostic-error': {
              background: 'none',
              color: 'red'
            },
            '.cm-panel.cm-panel-lint ul [aria-selected]': {
              backgroundColor: 'rgba(0, 0, 0, 0)'
            },
            '.cm-lint-marker-info': {
              content: 'none'
            },
            '.cm-cursor': {
              borderLeft: '4px solid white',
              borderRight: '4px solid black'
            }
            // '.ͼ1 .cm-panel.cm-panel-lint ul [aria-selected]': {
            //   background: 'none',
            //   color: 'red'
            // }
            // // adds word wrapping
            // '.cm-content': {
            //   whiteSpace: 'pre-wrap'
            // }
          }),
          flashTheme,
          oneDark,
          evalLinter.of(linter(jsLinter()))
        //  linter(esLint(new Linter()))
          // solarizedDark
        ]
      }),
      parent: parent
    })

    openLintPanel(this.cm)

    window.cm = this.cm
    // this.cm.execCommand('openLintPanel')
  }

  formatCode() {
    const formatted = js_beautify(this.cm.state.doc.toString()
    , { indent_size: 2, "break_chained_methods": true /*"indent_with_tabs": true*/})
    // this.cm.setValue(formatted)

    this.cm.dispatch({
      changes: {from: 0, to: cm.state.doc.length, insert: formatted}
    })
  }

  setValue(val = '') {
    this.cm.dispatch({
      changes: {from: 0, to: cm.state.doc.length, insert: val}
    })
  }

  toggle() {
   // console.log('TOGGLING', this.cm, this.cm.dom, this.cm.dom.style.opacity)
    if(this.cm.dom.style.opacity == 0) {
      this.cm.dom.style.opacity = 1
    } else {
      this.cm.dom.style.opacity = 0
    }
  }
}



