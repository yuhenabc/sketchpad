export default class CanvasStatus {
    constructor() {
        this.last = CanvasStatus.FLAG_PENCEL;
        this.backup = CanvasStatus.FLAG_PENCEL;
        this.current = 0;
        this.startPoint = { x: 0, y: 0 };
        this.endPoint = { x: 0, y: 0 };
        this.points = [];
    }
    startWorking() {
        if (this.current === 0)
            this.current = this.backup;
    }
    endWorking() {
        this.backup = this.current;
        this.current = 0;
    }
    isWorking() {
        return this.current > 0;
    }
    setTool(value) {
        if (value !== CanvasStatus.FLAG_ERASER)
            this.last = value;
        this.backup = value;
        this.current = 0;
    }
    restoreTool() {
        this.backup = this.last;
        this.current = 0;
    }
    setStartPoint(point) {
        const { x, y } = point;
        this.startPoint.x = x;
        this.startPoint.y = y;
    }
    getStartPoint() {
        const { x, y } = this.startPoint;
        return { x, y };
    }
    setEndPoint(point) {
        const { x, y } = point;
        this.endPoint.x = x;
        this.endPoint.y = y;
    }
    getEndPoint() {
        const { x, y } = this.endPoint;
        return { x, y };
    }
    appendPoints(value) {
        this.points.push(value);
    }
    clearPoints() {
        this.points = [];
    }
}
CanvasStatus.FLAG_PENCEL = 1;
CanvasStatus.FLAG_ERASER = 2;
CanvasStatus.FLAG_S_LINE = 3;
CanvasStatus.FLAG_RECTANGLE = 4;
CanvasStatus.FLAG_CIRCLE = 5;
CanvasStatus.FLAG_S_RECTANGLE = 6;
CanvasStatus.FLAG_ROUND = 7;
