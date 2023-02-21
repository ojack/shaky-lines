import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
// import { NgmiPolyfill } from "vite-plugin-ngmi-polyfill";

export default {
    define: { global: {} },
    plugins: [
        viteCommonjs({
            //  include: ["./src/index.js"]
            exclude: ["./esprima.js"]
        }),
        // NgmiPolyfill()
    ]
}