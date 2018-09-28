import Sketchpad from "./libs/Sketchpad"

interface Options {
    canvas: HTMLCanvasElement
    width?: number
    height?: number
}

export default function (options: Options) {
    return new Sketchpad(options)
}
