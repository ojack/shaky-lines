
import {
  keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
  rectangularSelection, crosshairCursor, placeholder,
  lineNumbers, highlightActiveLineGutter, EditorView,
} from "@codemirror/view"
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
// import { hydraSnippets } from "./hydra-cm6/hydra-autocomplete/hydra-snippets.js"
// import Linter from "eslint4b-prebuilt";

import { flashTheme } from './hydra-cm6/flash-code/flashTheme.js';
import { commentKeymap } from '@codemirror/comment';
import { javascript, javascriptLanguage/*esLint */ } from "@codemirror/lang-javascript"
import { oneDark, oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
// import { solarizedDark } from 'cm6-theme-solarized-dark';

import { getAll } from './hydra-cm6/flash-code/flashKeymaps.js'
import { flash } from './hydra-cm6/flash-code'
import hydraKeymaps from './hydra-cm6/hydra-keymaps.js'
import { hydraSyntaxStyle, hydraEditorTheme } from "./hydra-cm6/theme.js";
import { jsLinter } from "./hydra-cm6/hydra-lint/lint.js"
import { js_beautify } from 'js-beautify'

import { hydraEval as evaluation } from "./hydra-cm6/hydra-eval.js";

// import EventEmitter from 'events'

export default class Editor extends EventEmitter {
  constructor({ parent = document.body, autocompleteOptions = [] } = {}) {
    super()
    //  console.log('LOADING EDITOR', autocompleteOptions)
    const self = this

    let evalLinter = new Compartment

    this.cm = new EditorView({
      // lineWrapping: true,
      state: EditorState.create({
        // doc: "osc()",
        lineWrapping: true,
        extensions: [
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
                  const newVal = Number(text) + e.movementX + e.movementY / 100;
                  if (isNaN(newVal)) return;

                  setText(newVal.toString());
                  const editorContents = getAll(self.cm, false)
                  self.emit('editor:evalAll', editorContents)
                },
              }
            ],
          }),
          flash(),
          EditorView.domEventHandlers({
            click: (event, view) => { },
            touchstart: (event, view) => {
              startCompletion(view)
            }
          }),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          syntaxHighlighting(hydraSyntaxStyle),
          syntaxHighlighting(oneDarkHighlightStyle, { fallback: true }),
          bracketMatching(),
          autocompletion({ override: [autocompleteOptions], closeOnBlur: false}),
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
          //  ...hydraKeymaps
          ]),
          javascript(),
          // javascriptLanguage.data.of({
          //   autocomplete: [
          //    // snippetCompletion('mySnippet(${one}, ${two})', {label: 'mySnippet'})
          //   // autocompleteOptions,
          //    ...hydraSnippets
          //   ]
          // }),
          evaluation((code) => { 
            self.emit('editor:eval', code)
            // @todo !! need access to current vie in order to pass info to linter
          //   view.dispatch({
          //     effects: evalLinter.reconfigure(linter(jsLinter()))
          // })
          }),
          hydraEditorTheme,
          flashTheme,
          oneDark,
          evalLinter.of(linter(jsLinter()))
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
      , { indent_size: 2, "break_chained_methods": true /*"indent_with_tabs": true*/ })
    // this.cm.setValue(formatted)

    this.cm.dispatch({
      changes: { from: 0, to: cm.state.doc.length, insert: formatted }
    })
  }

  setValue(val = '') {
    this.cm.dispatch({
      changes: { from: 0, to: cm.state.doc.length, insert: val }
    })
  }

  toggle() {
    // console.log('TOGGLING', this.cm, this.cm.dom, this.cm.dom.style.opacity)
    if (this.cm.dom.style.opacity == 0) {
      this.cm.dom.style.opacity = 1
    } else {
      this.cm.dom.style.opacity = 0
    }
  }
}



