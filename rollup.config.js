import typescript from 'rollup-plugin-typescript'
import {uglify} from "rollup-plugin-uglify"

const isPro = process.env.BUILD === 'production'
let config

const config1 = {
    input: 'src/sketchpad.ts',
    output: {
        file: 'dist/sketchpad.umd.js',
        format: 'umd',
        name: 'Sketchpad'
    },
    plugins: [
        typescript()
    ]
}

const config2 = {
    input: 'src/sketchpad.ts',
    output: {
        file: 'dist/sketchpad.production.umd.js',
        format: 'umd',
        name: 'Sketchpad'
    },
    plugins: [
        uglify({
            compress: {
                drop_console: true
            },
            output: {
                comments: false
            }
        }),
        typescript()
    ]
}

if (isPro) {
    config = config2
} else {
    config = config1
}

export default config
