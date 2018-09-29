"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasStatus = (function () {
    function CanvasStatus() {
        this.last = CanvasStatus.FLAG_PENCEL;
        this.backup = CanvasStatus.FLAG_PENCEL;
        this.current = 0;
        this.startPoint = { x: 0, y: 0 };
        this.endPoint = { x: 0, y: 0 };
        this.points = [];
    }
    CanvasStatus.prototype.startWorking = function () {
        if (this.current === 0)
            this.current = this.backup;
    };
    CanvasStatus.prototype.endWorking = function () {
        this.backup = this.current;
        this.current = 0;
    };
    CanvasStatus.prototype.isWorking = function () {
        return this.current > 0;
    };
    CanvasStatus.prototype.setTool = function (value) {
        if (value !== CanvasStatus.FLAG_ERASER)
            this.last = value;
        this.backup = value;
        this.current = 0;
    };
    CanvasStatus.prototype.restoreTool = function () {
        this.backup = this.last;
        this.current = 0;
    };
    CanvasStatus.prototype.setStartPoint = function (point) {
        var x = point.x, y = point.y;
        this.startPoint.x = x;
        this.startPoint.y = y;
    };
    CanvasStatus.prototype.getStartPoint = function () {
        var _a = this.startPoint, x = _a.x, y = _a.y;
        return { x: x, y: y };
    };
    CanvasStatus.prototype.setEndPoint = function (point) {
        var x = point.x, y = point.y;
        this.endPoint.x = x;
        this.endPoint.y = y;
    };
    CanvasStatus.prototype.getEndPoint = function () {
        var _a = this.endPoint, x = _a.x, y = _a.y;
        return { x: x, y: y };
    };
    CanvasStatus.prototype.appendPoints = function (value) {
        this.points.push(value);
    };
    CanvasStatus.prototype.clearPoints = function () {
        this.points = [];
    };
    CanvasStatus.FLAG_PENCEL = 1;
    CanvasStatus.FLAG_ERASER = 2;
    CanvasStatus.FLAG_S_LINE = 3;
    CanvasStatus.FLAG_RECTANGLE = 4;
    CanvasStatus.FLAG_CIRCLE = 5;
    CanvasStatus.FLAG_S_RECTANGLE = 6;
    CanvasStatus.FLAG_ROUND = 7;
    return CanvasStatus;
}());
exports.default = CanvasStatus;
