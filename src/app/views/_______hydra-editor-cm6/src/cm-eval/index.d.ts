import { EditorView, KeyBinding, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { Extension } from "@codemirror/state";
export const evalEffect: import("@codemirror/state").StateEffectType<{
    from: number;
    to: number;
}>;
export type evalHandler = (code: string) => void;
export function evalAction(action: evalHandler): import("@codemirror/state").Extension;
export const evalKeymap: KeyBinding[];
export function evalSelection({ state, dispatch }: EditorView): boolean;
export function evalLine({ state, dispatch }: EditorView): boolean;
export function evalBlock({ state, dispatch }: EditorView): boolean;
export function evalDecoration(): ViewPlugin<{
    decorations: import("@codemirror/view").DecorationSet;
    update({ transactions }: ViewUpdate): void;
}>;
export const evalTheme: import("@codemirror/state").Extension;
export function evaluation(action: evalHandler): Extension;

//# sourceMappingURL=index.d.ts.map
