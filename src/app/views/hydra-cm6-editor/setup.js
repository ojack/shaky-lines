import { EditorState, Compartment } from "@codemirror/state"
import {
  keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
  rectangularSelection, crosshairCursor, placeholder, highlightActiveLineGutter, EditorView
} from "@codemirror/view"

import {
  /*defaultHighlightStyle,*/ syntaxHighlighting, indentOnInput, bracketMatching,
 /* foldGutter,*/ foldKeymap, HighlightStyle
} from "@codemirror/language"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search"
import { autocompletion, /*completeFromList,*/ completionKeymap, snippetKeymap, snippetCompletion, closeBrackets, closeBracketsKeymap, startCompletion } from "@codemirror/autocomplete"
import { lintKeymap, linter, lintGutter } from "@codemirror/lint"
import { flashTheme } from './flash-code/flashTheme.js';
import { commentKeymap } from '@codemirror/comment';
import { javascript, javascriptLanguage/*esLint */ } from "@codemirror/lang-javascript"
import { oneDark, oneDarkHighlightStyle } from '@codemirror/theme-one-dark';

import { flash } from './flash-code'
import hydraKeymaps from './hydra-keymaps.js'
import { hydraSyntaxStyle, hydraEditorTheme } from "./theme.js";
import { jsLinter } from "./hydra-lint/lint.js"

// const autocompleteOptions = []

let evalLinter = new Compartment

export const setup = ({ autocompleteOptions = [], emit = () => { } }) => [
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
  autocompletion({ override: [autocompleteOptions], closeOnBlur: false }),
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
    ...hydraKeymaps({ emit })
  ]),
  javascript(),
  // javascriptLanguage.data.of({
  //   autocomplete: [
  //    // snippetCompletion('mySnippet(${one}, ${two})', {label: 'mySnippet'})
  //   // autocompleteOptions,
  //    ...hydraSnippets
  //   ]
  // }),
  // evaluation((code) => {
  //   self.emit('editor:eval', code)
  // }),
  hydraEditorTheme,
  flashTheme,
  oneDark,
  evalLinter.of(linter(jsLinter()))
]