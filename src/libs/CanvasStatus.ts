interface Point {
    x: number
    y: number
}

/**
 * Class CanvasStatus
 */
export default class CanvasStatus {

    last: number
    backup: number
    current: number
    startPoint: Point
    endPoint: Point
    points: Array<Point>

    static FLAG_PENCEL: number = 1
    static FLAG_ERASER: number = 2
    static FLAG_S_LINE: number = 3
    static FLAG_RECTANGLE: number = 4
    static FLAG_CIRCLE: number = 5
    static FLAG_S_RECTANGLE: number = 6
    static FLAG_ROUND: number = 7

    constructor() {
        this.last = CanvasStatus.FLAG_PENCEL
        this.backup = CanvasStatus.FLAG_PENCEL
        this.current = 0
        this.startPoint = {x: 0, y: 0}
        this.endPoint = {x: 0, y: 0}
        this.points = []
    }

    startWorking() {
        if (this.current === 0) this.current = this.backup
    }

    endWorking() {
        this.backup = this.current
        this.current = 0
    }

    isWorking(): boolean {
        return this.current > 0
    }

    setTool(value) {
        if (value !== CanvasStatus.FLAG_ERASER) this.last = value
        this.backup = value
        this.current = 0
    }

    restoreTool() {
        this.backup = this.last
        this.current = 0
    }

    setStartPoint(point: Point) {
        const {x, y} = point
        this.startPoint.x = x
        this.startPoint.y = y
    }

    getStartPoint(): Point {
        const {x, y} = this.startPoint
        return {x, y}
    }

    setEndPoint(point: Point) {
        const {x, y} = point
        this.endPoint.x = x
        this.endPoint.y = y
    }

    getEndPoint(): Point {
        const {x, y} = this.endPoint
        return {x, y}
    }

    appendPoints(value) {
        this.points.push(value)
    }

    clearPoints() {
        this.points = []
    }

}
