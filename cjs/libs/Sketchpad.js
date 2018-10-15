"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasStatus_1 = require("./CanvasStatus");
var utils_1 = require("./utils");
var Sketchpad = (function () {
    function Sketchpad(options) {
        this.status = new CanvasStatus_1.default();
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.onDrawEnd = null;
        var lineWidth = 2;
        if (typeof options.lineWidth === 'number') {
            lineWidth = options.lineWidth;
        }
        if (typeof options.onDrawEnd === 'function') {
            this.onDrawEnd = options.onDrawEnd;
        }
        this.canvas.width = options.width;
        this.canvas.height = options.height;
        this.canvas.style.backgroundRepeat = 'no-repeat';
        this.canvas.style.backgroundPosition = 'center';
        this.canvas.style.backgroundSize = 'cover';
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = lineWidth;
        this.vcanvas = document.createElement('canvas');
        this.vcanvas.style.position = 'fixed';
        this.resize();
        this.vctx = this.vcanvas.getContext('2d');
        this.vctx.globalCompositeOperation = 'source-over';
        this.vctx.lineCap = 'round';
        this.vctx.lineJoin = 'round';
        this.vctx.lineWidth = lineWidth;
        this.canvas.parentElement.appendChild(this.vcanvas);
        this.vcanvas.ontouchstart = this.touchStartHandler.bind(this);
        this.vcanvas.ontouchmove = this.touchMoveHandler.bind(this);
        this.vcanvas.ontouchend = this.touchEndHandler.bind(this);
        this.vcanvas.onmousedown = this.touchStartHandler.bind(this);
        this.vcanvas.onmousemove = this.touchMoveHandler.bind(this);
        this.vcanvas.onmouseup = this.touchEndHandler.bind(this);
        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
    }
    Sketchpad.prototype.resize = function () {
        var rect = this.canvas.getBoundingClientRect();
        this.vcanvas.width = rect.width;
        this.vcanvas.height = rect.height;
        this.vcanvas.style.top = rect.top + 'px';
        this.vcanvas.style.left = rect.left + 'px';
    };
    Sketchpad.prototype.destroy = function () {
        this.canvas.parentElement.removeChild(this.vcanvas);
        this.vcanvas = null;
        window.removeEventListener('resize', this.resize);
    };
    Sketchpad.prototype.send = function (event, data) {
        if (typeof this.onDrawEnd === 'function') {
            this.onDrawEnd(event, data);
        }
    };
    Sketchpad.prototype.touchStartHandler = function (e) {
        console.log('START');
        this.status.startWorking();
        var point = utils_1.getRealPoint(this.canvas, e);
        this.status.setStartPoint(point);
        console.log("start at [" + point.x + ", " + point.y + "]");
        switch (this.status.current) {
            case CanvasStatus_1.default.FLAG_PENCEL:
            case CanvasStatus_1.default.FLAG_ERASER:
                this.status.clearPoints();
                this.status.appendPoints(point);
                break;
            default:
                break;
        }
    };
    Sketchpad.prototype.touchMoveHandler = function (e) {
        if (!this.status || !this.status.isWorking())
            return;
        console.log('MOVE');
        var point = utils_1.getRealPoint(this.canvas, e);
        this.status.setEndPoint(point);
        this.status.appendPoints(point);
        var start = this.status.getStartPoint();
        var points = [start, point];
        switch (this.status.current) {
            case CanvasStatus_1.default.FLAG_PENCEL:
                utils_1.drawLine(this.vctx, this.status.points);
                break;
            case CanvasStatus_1.default.FLAG_S_LINE:
                this.clearVCanvas();
                utils_1.drawSLine(this.vctx, points);
                break;
            case CanvasStatus_1.default.FLAG_RECTANGLE:
                this.clearVCanvas();
                utils_1.drawRectangle(this.vctx, points);
                break;
            case CanvasStatus_1.default.FLAG_CIRCLE:
                this.clearVCanvas();
                utils_1.drawCircle(this.vctx, points);
                break;
            case CanvasStatus_1.default.FLAG_S_RECTANGLE:
                this.clearVCanvas();
                utils_1.drawSRectangle(this.vctx, points);
                break;
            case CanvasStatus_1.default.FLAG_ROUND:
                this.clearVCanvas();
                utils_1.drawRound(this.vctx, points);
                break;
            case CanvasStatus_1.default.FLAG_ERASER:
                utils_1.drawEraserOnce(this.ctx, point.x, point.y);
                break;
            default:
                break;
        }
    };
    Sketchpad.prototype.touchEndHandler = function () {
        console.log('END');
        var start = this.status.getStartPoint();
        var end = this.status.getEndPoint();
        var points = [start, end];
        switch (this.status.current) {
            case CanvasStatus_1.default.FLAG_PENCEL:
                this.clearVCanvas();
                if (this.status.points.length > 0) {
                    this.drawLineDirectly(this.status.points);
                    this.send('line', utils_1.convertToIntegerPoints(this.canvas, this.status.points));
                }
                break;
            case CanvasStatus_1.default.FLAG_S_LINE:
                this.clearVCanvas();
                this.drawSLineDirectly(points);
                this.send('s-line', utils_1.convertToIntegerPoints(this.canvas, points));
                break;
            case CanvasStatus_1.default.FLAG_RECTANGLE:
                this.clearVCanvas();
                this.drawRectangleDirectly(points);
                this.send('rectangle', utils_1.convertToIntegerPoints(this.canvas, points));
                break;
            case CanvasStatus_1.default.FLAG_CIRCLE:
                this.clearVCanvas();
                this.drawCircleDirectly(points);
                this.send('circle', utils_1.convertToIntegerPoints(this.canvas, points));
                break;
            case CanvasStatus_1.default.FLAG_S_RECTANGLE:
                this.clearVCanvas();
                this.drawSRectangleDirectly(points);
                this.send('s-rectangle', utils_1.convertToIntegerPoints(this.canvas, points));
                break;
            case CanvasStatus_1.default.FLAG_ROUND:
                this.clearVCanvas();
                this.drawRoundDirectly(points);
                this.send('round', utils_1.convertToIntegerPoints(this.canvas, points));
                break;
            case CanvasStatus_1.default.FLAG_ERASER:
                if (this.status.points.length > 0) {
                    this.send('eraser', utils_1.convertToIntegerPoints(this.canvas, this.status.points));
                }
                break;
            default:
                break;
        }
        this.status.endWorking();
    };
    Sketchpad.prototype.toBeRounded = function () {
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.vctx.lineCap = 'round';
        this.vctx.lineJoin = 'round';
    };
    Sketchpad.prototype.toBeRected = function () {
        this.ctx.lineCap = 'butt';
        this.ctx.lineJoin = 'miter';
        this.vctx.lineCap = 'butt';
        this.vctx.lineJoin = 'miter';
    };
    Sketchpad.prototype.setDrawWay = function (way) {
        this.ctx.globalCompositeOperation = way;
        this.vctx.globalCompositeOperation = way;
    };
    Sketchpad.prototype.usePencil = function () {
        this.toBeRounded();
        this.setDrawWay('source-over');
        this.status.setTool(CanvasStatus_1.default.FLAG_PENCEL);
    };
    Sketchpad.prototype.useSLine = function () {
        this.toBeRounded();
        this.setDrawWay('source-over');
        this.status.setTool(CanvasStatus_1.default.FLAG_S_LINE);
    };
    Sketchpad.prototype.useRectangle = function () {
        this.toBeRected();
        this.setDrawWay('source-over');
        this.status.setTool(CanvasStatus_1.default.FLAG_RECTANGLE);
    };
    Sketchpad.prototype.useCircle = function () {
        this.toBeRounded();
        this.setDrawWay('source-over');
        this.status.setTool(CanvasStatus_1.default.FLAG_CIRCLE);
    };
    Sketchpad.prototype.useSRectangle = function () {
        this.toBeRected();
        this.setDrawWay('source-over');
        this.status.setTool(CanvasStatus_1.default.FLAG_S_RECTANGLE);
    };
    Sketchpad.prototype.useRound = function () {
        this.toBeRounded();
        this.setDrawWay('source-over');
        this.status.setTool(CanvasStatus_1.default.FLAG_ROUND);
    };
    Sketchpad.prototype.useEraser = function () {
        this.setDrawWay('destination-out');
        this.status.setTool(CanvasStatus_1.default.FLAG_ERASER);
    };
    Sketchpad.prototype.changeColor = function (color) {
        this.setDrawWay('source-over');
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
        this.vctx.strokeStyle = color;
        this.vctx.fillStyle = color;
        this.status.restoreTool();
        if (this.status.current === CanvasStatus_1.default.FLAG_RECTANGLE
            || this.status.current === CanvasStatus_1.default.FLAG_S_RECTANGLE) {
            this.toBeRected();
        }
        console.log("set color to \"" + color + "\"");
    };
    Sketchpad.prototype.changeLineWidth = function (width) {
        this.ctx.lineWidth = width;
        this.vctx.lineWidth = width;
        console.log("set line width to \"" + width + "\"");
    };
    Sketchpad.prototype.changeBackground = function (url) {
        if (url) {
            this.canvas.style.backgroundImage = "url(" + url + ")";
        }
        else {
            this.canvas.style.backgroundImage = 'none';
        }
    };
    Sketchpad.prototype.drawLineDirectly = function (points) {
        utils_1.drawLine(this.ctx, points);
    };
    Sketchpad.prototype.drawSLineDirectly = function (points) {
        utils_1.drawSLine(this.ctx, points);
    };
    Sketchpad.prototype.drawRectangleDirectly = function (points) {
        utils_1.drawRectangle(this.ctx, points);
    };
    Sketchpad.prototype.drawSRectangleDirectly = function (points) {
        utils_1.drawSRectangle(this.ctx, points);
    };
    Sketchpad.prototype.drawCircleDirectly = function (points) {
        utils_1.drawCircle(this.ctx, points);
    };
    Sketchpad.prototype.drawRoundDirectly = function (points) {
        utils_1.drawRound(this.ctx, points);
    };
    Sketchpad.prototype.drawEraserDirectly = function (points) {
        utils_1.drawEraser(this.ctx, points);
    };
    Sketchpad.prototype.drawLine = function (points) {
        points = utils_1.convertToFloatPoints(this.canvas, points);
        this.drawLineDirectly(points);
    };
    Sketchpad.prototype.drawSLine = function (points) {
        points = utils_1.convertToFloatPoints(this.canvas, points);
        this.drawSLineDirectly(points);
    };
    Sketchpad.prototype.drawRectangle = function (points) {
        points = utils_1.convertToFloatPoints(this.canvas, points);
        this.drawRectangleDirectly(points);
    };
    Sketchpad.prototype.drawSRectangle = function (points) {
        points = utils_1.convertToFloatPoints(this.canvas, points);
        this.drawSRectangleDirectly(points);
    };
    Sketchpad.prototype.drawCircle = function (points) {
        points = utils_1.convertToFloatPoints(this.canvas, points);
        this.drawCircleDirectly(points);
    };
    Sketchpad.prototype.drawRound = function (points) {
        points = utils_1.convertToFloatPoints(this.canvas, points);
        this.drawRoundDirectly(points);
    };
    Sketchpad.prototype.drawEraser = function (points) {
        points = utils_1.convertToFloatPoints(this.canvas, points);
        this.drawEraserDirectly(points);
    };
    Sketchpad.prototype.clearCanvas = function () {
        utils_1.clearAll(this.canvas);
    };
    Sketchpad.prototype.clearVCanvas = function () {
        utils_1.clearAll(this.vcanvas);
    };
    return Sketchpad;
}());
exports.default = Sketchpad;
