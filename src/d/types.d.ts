export type Options = {
    canvas: HTMLCanvasElement
    width?: number
    height?: number
    lineWidth?: number
    onDrawEnd?: Function
}

export interface Point {
    x: number
    y: number
}
