import CanvasStatus from './CanvasStatus'
import {
    getRealPoint,
    drawLine,
    drawSLine,
    drawRectangle,
    drawCircle,
    drawSRectangle,
    drawRound,
    drawEraserOnce,
    drawEraser,
    convertToFloatPoints,
    convertToIntegerPoints,
    clearAll,
} from './utils'


interface Point {
    x: number
    y: number
}

interface Options {
    canvas: HTMLCanvasElement
    width?: number
    height?: number
}

/**
 * Class Sketchpad
 */
export default class Sketchpad {

    status: CanvasStatus
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    vcanvas: HTMLCanvasElement
    vctx: CanvasRenderingContext2D
    onDrawEnd: Function

    constructor(options: Options) {
        this.status = new CanvasStatus()
        this.canvas = options.canvas
        this.ctx = this.canvas.getContext('2d')
        this.onDrawEnd = null

        // 设置画布属性
        this.canvas.width = options.width
        this.canvas.height = options.height
        this.ctx.globalCompositeOperation = 'source-over'
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'

        // 创建虚拟画布
        const rect = this.canvas.getBoundingClientRect()
        this.vcanvas = document.createElement('canvas')
        this.vcanvas.style.position = 'fixed'
        this.vcanvas.width = rect.width
        this.vcanvas.height = rect.height
        this.vcanvas.style.top = rect.top + 'px'
        this.vcanvas.style.left = rect.left + 'px'
        this.vctx = this.vcanvas.getContext('2d')
        this.vctx.globalCompositeOperation = 'source-over'
        this.vctx.lineCap = 'round'
        this.vctx.lineJoin = 'round'
        this.canvas.parentElement.appendChild(this.vcanvas)

        // 添加事件
        this.vcanvas.ontouchstart = this.touchStartHandler.bind(this)
        this.vcanvas.ontouchmove = this.touchMoveHandler.bind(this)
        this.vcanvas.ontouchend = this.touchEndHandler.bind(this)
        this.vcanvas.onmousedown = this.touchStartHandler.bind(this)
        this.vcanvas.onmousemove = this.touchMoveHandler.bind(this)
        this.vcanvas.onmouseup = this.touchEndHandler.bind(this)
    }

    destory() {
        this.canvas.parentElement.removeChild(this.vcanvas)
        this.vcanvas = null
    }

    send(event: string, data: any) {
        if (typeof this.onDrawEnd === 'function') {
            this.onDrawEnd(event, data)
        }
    }

    touchStartHandler(e) {

        console.log('START')
        this.status.startWorking()
        const point = getRealPoint(this.canvas, e)
        this.status.setStartPoint(point)
        console.log(`start at [${point.x}, ${point.y}]`)

        switch (this.status.current) {
            case CanvasStatus.FLAG_PENCEL:
            case CanvasStatus.FLAG_ERASER:
                this.status.clearPoints()
                this.status.appendPoints(point)
                break
            default:
                break
        }
    }

    touchMoveHandler(e) {

        if (!this.status || !this.status.isWorking()) return

        console.log('MOVE')
        const point = getRealPoint(this.canvas, e)
        this.status.setEndPoint(point)
        this.status.appendPoints(point)

        const start = this.status.getStartPoint()
        const points = [start, point]

        switch (this.status.current) {
            case CanvasStatus.FLAG_PENCEL:
                drawLine(this.vctx, this.status.points)
                break
            case CanvasStatus.FLAG_S_LINE:
                this.clearVCanvas()
                drawSLine(this.vctx, points)
                break
            case CanvasStatus.FLAG_RECTANGLE:
                this.clearVCanvas()
                drawRectangle(this.vctx, points)
                break
            case CanvasStatus.FLAG_CIRCLE:
                this.clearVCanvas()
                drawCircle(this.vctx, points)
                break
            case CanvasStatus.FLAG_S_RECTANGLE:
                this.clearVCanvas()
                drawSRectangle(this.vctx, points)
                break
            case CanvasStatus.FLAG_ROUND:
                this.clearVCanvas()
                drawRound(this.vctx, points)
                break
            case CanvasStatus.FLAG_ERASER:
                drawEraserOnce(this.ctx, point.x, point.y)
                break
            default:
                break
        }
    }

    touchEndHandler() {

        console.log('END')
        const start = this.status.getStartPoint()
        const end = this.status.getEndPoint()
        const points = [start, end]

        switch (this.status.current) {
            case CanvasStatus.FLAG_PENCEL:
                this.clearVCanvas()
                if (this.status.points.length > 0) {
                    this.drawLineDirectly(this.status.points)
                    this.send('line', convertToIntegerPoints(this.canvas, this.status.points))
                }
                break
            case CanvasStatus.FLAG_S_LINE:
                this.clearVCanvas()
                this.drawSLineDirectly(points)
                this.send('s-line', convertToIntegerPoints(this.canvas, points))
                break
            case CanvasStatus.FLAG_RECTANGLE:
                this.clearVCanvas()
                this.drawRectangleDirectly(points)
                this.send('rectangle', convertToIntegerPoints(this.canvas, points))
                break
            case CanvasStatus.FLAG_CIRCLE:
                this.clearVCanvas()
                this.drawCircleDirectly(points)
                this.send('circle', convertToIntegerPoints(this.canvas, points))
                break
            case CanvasStatus.FLAG_S_RECTANGLE:
                this.clearVCanvas()
                this.drawSRectangleDirectly(points)
                this.send('s-rectangle', convertToIntegerPoints(this.canvas, points))
                break
            case CanvasStatus.FLAG_ROUND:
                this.clearVCanvas()
                this.drawRoundDirectly(points)
                this.send('round', convertToIntegerPoints(this.canvas, points))
                break
            case CanvasStatus.FLAG_ERASER:
                if (this.status.points.length > 0) {
                    this.send('eraser', convertToIntegerPoints(this.canvas, this.status.points))
                }
                break
            default:
                break
        }

        this.status.endWorking()
    }

    toBeRounded() {
        this.ctx.lineCap = 'round'
        this.ctx.lineJoin = 'round'
        this.vctx.lineCap = 'round'
        this.vctx.lineJoin = 'round'
    }

    toBeRected() {
        this.ctx.lineCap = 'butt'
        this.ctx.lineJoin = 'miter'
        this.vctx.lineCap = 'butt'
        this.vctx.lineJoin = 'miter'
    }

    setDrawWay(way: string) {
        this.ctx.globalCompositeOperation = way
        this.vctx.globalCompositeOperation = way
    }

    usePencil() {
        this.toBeRounded()
        this.setDrawWay('source-over')
        this.status.setTool(CanvasStatus.FLAG_PENCEL)
    }

    useSLine() {
        this.toBeRounded()
        this.setDrawWay('source-over')
        this.status.setTool(CanvasStatus.FLAG_S_LINE)
    }

    useRectangle() {
        this.toBeRected()
        this.setDrawWay('source-over')
        this.status.setTool(CanvasStatus.FLAG_RECTANGLE)
    }

    useCircle() {
        this.toBeRounded()
        this.setDrawWay('source-over')
        this.status.setTool(CanvasStatus.FLAG_CIRCLE)
    }

    useSRectangle() {
        this.toBeRected()
        this.setDrawWay('source-over')
        this.status.setTool(CanvasStatus.FLAG_S_RECTANGLE)
    }

    useRound() {
        this.toBeRounded()
        this.setDrawWay('source-over')
        this.status.setTool(CanvasStatus.FLAG_ROUND)
    }

    useEraser() {
        this.setDrawWay('destination-out')
        this.status.setTool(CanvasStatus.FLAG_ERASER)
    }

    changeColor(color) {
        this.setDrawWay('source-over')
        this.ctx.strokeStyle = color
        this.ctx.fillStyle = color
        this.vctx.strokeStyle = color
        this.vctx.fillStyle = color
        this.status.restoreTool()
        if (this.status.current === CanvasStatus.FLAG_RECTANGLE
            || this.status.current === CanvasStatus.FLAG_S_RECTANGLE) {
            this.toBeRected()
        }
        console.log(`set color to "${color}"`)
    }

    changeLineWidth(width: number) {
        this.ctx.lineWidth = width
        this.vctx.lineWidth = width
        console.log(`set line width to "${width}"`)
    }

    drawLineDirectly(points: Array<Point>) {
        drawLine(this.ctx, points)
    }

    drawSLineDirectly(points: Array<Point>) {
        drawSLine(this.ctx, points)
    }

    drawRectangleDirectly(points: Array<Point>) {
        drawRectangle(this.ctx, points)
    }

    drawSRectangleDirectly(points: Array<Point>) {
        drawSRectangle(this.ctx, points)
    }

    drawCircleDirectly(points: Array<Point>) {
        drawCircle(this.ctx, points)
    }

    drawRoundDirectly(points: Array<Point>) {
        drawRound(this.ctx, points)
    }

    drawEraserDirectly(points: Array<Point>) {
        drawEraser(this.ctx, points)
    }

    drawLine(points: Array<Point>) {
        points = convertToFloatPoints(this.canvas, points)
        this.drawLineDirectly(points)
    }

    drawSLine(points: Array<Point>) {
        points = convertToFloatPoints(this.canvas, points)
        this.drawSLineDirectly(points)
    }

    drawRectangle(points: Array<Point>) {
        points = convertToFloatPoints(this.canvas, points)
        this.drawRectangleDirectly(points)
    }

    drawSRectangle(points: Array<Point>) {
        points = convertToFloatPoints(this.canvas, points)
        this.drawSRectangleDirectly(points)
    }

    drawCircle(points: Array<Point>) {
        points = convertToFloatPoints(this.canvas, points)
        this.drawCircleDirectly(points)
    }

    drawRound(points: Array<Point>) {
        points = convertToFloatPoints(this.canvas, points)
        this.drawRoundDirectly(points)
    }

    drawEraser(points: Array<Point>) {
        points = convertToFloatPoints(this.canvas, points)
        this.drawEraserDirectly(points)
    }

    clearCanvas() {
        clearAll(this.canvas)
    }

    clearVCanvas() {
        clearAll(this.vcanvas)
    }
}
