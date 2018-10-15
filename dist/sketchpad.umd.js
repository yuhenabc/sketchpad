(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.Sketchpad = factory());
}(this, (function () { 'use strict';

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

    function getRealPoint(canvas, e) {
        var ex = e.clientX || e.touches[0].clientX;
        var ey = e.clientY || e.touches[0].clientY;
        return {
            x: ex - canvas.offsetLeft,
            y: ey - canvas.offsetTop
        };
    }
    function drawLine(context, points) {
        context.beginPath();
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var p = points_1[_i];
            if (p === points[0]) {
                context.moveTo(p.x, p.y);
            }
            else {
                context.lineTo(p.x, p.y);
            }
        }
        context.stroke();
        console.log("line with " + points.length + " points");
    }
    function drawSLine(context, points) {
        context.beginPath();
        var start = points[0];
        var end = points[1];
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
        console.log("straight line from [" + start.x + ", " + start.y + "] to [" + end.x + ", " + end.y + "]");
    }
    function drawRectangle(context, points, isSolid) {
        if (isSolid === void 0) { isSolid = false; }
        context.beginPath();
        var start = points[0];
        var end = points[1];
        context.rect(start.x, start.y, end.x - start.x, end.y - start.y);
        if (isSolid) {
            var originLineWidth = context.lineWidth;
            context.lineWidth = 0;
            context.fill();
            context.lineWidth = originLineWidth;
            console.log("solid rectangle from [" + start.x + ", " + start.y + "] to [" + end.x + ", " + end.y + "]");
        }
        else {
            context.stroke();
            console.log("rectangle from [" + start.x + ", " + start.y + "] to [" + end.x + ", " + end.y + "]");
        }
    }
    function drawCircle(context, points, isSolid) {
        if (isSolid === void 0) { isSolid = false; }
        context.beginPath();
        var start = points[0];
        var end = points[1];
        var w = end.x - start.x;
        var h = end.y - start.y;
        context.arc(start.x + w / 2, start.y + h / 2, Math.hypot(w, h) / 2, 0, Math.PI * 2, true);
        if (isSolid) {
            var originLineWidth = context.lineWidth;
            context.lineWidth = 0;
            context.fill();
            context.lineWidth = originLineWidth;
            console.log("round from [" + start.x + ", " + start.y + "] to [" + end.x + ", " + end.y + "]");
        }
        else {
            context.stroke();
            console.log("circle from [" + start.x + ", " + start.y + "] to [" + end.x + ", " + end.y + "]");
        }
    }
    function drawSRectangle(context, points) {
        drawRectangle(context, points, true);
    }
    function drawRound(context, points) {
        drawCircle(context, points, true);
    }
    function drawEraserOnce(context, x, y) {
        var radius = 8;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2, true);
        context.fill();
    }
    function drawEraser(context, points) {
        for (var _i = 0, points_2 = points; _i < points_2.length; _i++) {
            var p = points_2[_i];
            drawEraserOnce(context, p.x, p.y);
        }
        console.log("eraser with " + points.length + " points");
    }
    function convertToFloatPoints(canvas, points) {
        return points.map(function (point) { return ({
            x: point.x * canvas.width / 10000,
            y: point.y * canvas.height / 10000
        }); });
    }
    function convertToIntegerPoints(canvas, points) {
        return points.map(function (point) { return ({
            x: Math.round((point.x / canvas.width) * 10000),
            y: Math.round((point.y / canvas.height) * 10000)
        }); });
    }
    function clearAll(canvas) {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    }

    var Sketchpad = (function () {
        function Sketchpad(options) {
            this.status = new CanvasStatus();
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
            var point = getRealPoint(this.canvas, e);
            this.status.setStartPoint(point);
            console.log("start at [" + point.x + ", " + point.y + "]");
            switch (this.status.current) {
                case CanvasStatus.FLAG_PENCEL:
                case CanvasStatus.FLAG_ERASER:
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
            var point = getRealPoint(this.canvas, e);
            this.status.setEndPoint(point);
            this.status.appendPoints(point);
            var start = this.status.getStartPoint();
            var points = [start, point];
            switch (this.status.current) {
                case CanvasStatus.FLAG_PENCEL:
                    drawLine(this.vctx, this.status.points);
                    break;
                case CanvasStatus.FLAG_S_LINE:
                    this.clearVCanvas();
                    drawSLine(this.vctx, points);
                    break;
                case CanvasStatus.FLAG_RECTANGLE:
                    this.clearVCanvas();
                    drawRectangle(this.vctx, points);
                    break;
                case CanvasStatus.FLAG_CIRCLE:
                    this.clearVCanvas();
                    drawCircle(this.vctx, points);
                    break;
                case CanvasStatus.FLAG_S_RECTANGLE:
                    this.clearVCanvas();
                    drawSRectangle(this.vctx, points);
                    break;
                case CanvasStatus.FLAG_ROUND:
                    this.clearVCanvas();
                    drawRound(this.vctx, points);
                    break;
                case CanvasStatus.FLAG_ERASER:
                    drawEraserOnce(this.ctx, point.x, point.y);
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
                case CanvasStatus.FLAG_PENCEL:
                    this.clearVCanvas();
                    if (this.status.points.length > 0) {
                        this.drawLineDirectly(this.status.points);
                        this.send('line', convertToIntegerPoints(this.canvas, this.status.points));
                    }
                    break;
                case CanvasStatus.FLAG_S_LINE:
                    this.clearVCanvas();
                    this.drawSLineDirectly(points);
                    this.send('s-line', convertToIntegerPoints(this.canvas, points));
                    break;
                case CanvasStatus.FLAG_RECTANGLE:
                    this.clearVCanvas();
                    this.drawRectangleDirectly(points);
                    this.send('rectangle', convertToIntegerPoints(this.canvas, points));
                    break;
                case CanvasStatus.FLAG_CIRCLE:
                    this.clearVCanvas();
                    this.drawCircleDirectly(points);
                    this.send('circle', convertToIntegerPoints(this.canvas, points));
                    break;
                case CanvasStatus.FLAG_S_RECTANGLE:
                    this.clearVCanvas();
                    this.drawSRectangleDirectly(points);
                    this.send('s-rectangle', convertToIntegerPoints(this.canvas, points));
                    break;
                case CanvasStatus.FLAG_ROUND:
                    this.clearVCanvas();
                    this.drawRoundDirectly(points);
                    this.send('round', convertToIntegerPoints(this.canvas, points));
                    break;
                case CanvasStatus.FLAG_ERASER:
                    if (this.status.points.length > 0) {
                        this.send('eraser', convertToIntegerPoints(this.canvas, this.status.points));
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
            this.status.setTool(CanvasStatus.FLAG_PENCEL);
        };
        Sketchpad.prototype.useSLine = function () {
            this.toBeRounded();
            this.setDrawWay('source-over');
            this.status.setTool(CanvasStatus.FLAG_S_LINE);
        };
        Sketchpad.prototype.useRectangle = function () {
            this.toBeRected();
            this.setDrawWay('source-over');
            this.status.setTool(CanvasStatus.FLAG_RECTANGLE);
        };
        Sketchpad.prototype.useCircle = function () {
            this.toBeRounded();
            this.setDrawWay('source-over');
            this.status.setTool(CanvasStatus.FLAG_CIRCLE);
        };
        Sketchpad.prototype.useSRectangle = function () {
            this.toBeRected();
            this.setDrawWay('source-over');
            this.status.setTool(CanvasStatus.FLAG_S_RECTANGLE);
        };
        Sketchpad.prototype.useRound = function () {
            this.toBeRounded();
            this.setDrawWay('source-over');
            this.status.setTool(CanvasStatus.FLAG_ROUND);
        };
        Sketchpad.prototype.useEraser = function () {
            this.setDrawWay('destination-out');
            this.status.setTool(CanvasStatus.FLAG_ERASER);
        };
        Sketchpad.prototype.changeColor = function (color) {
            this.setDrawWay('source-over');
            this.ctx.strokeStyle = color;
            this.ctx.fillStyle = color;
            this.vctx.strokeStyle = color;
            this.vctx.fillStyle = color;
            this.status.restoreTool();
            if (this.status.current === CanvasStatus.FLAG_RECTANGLE
                || this.status.current === CanvasStatus.FLAG_S_RECTANGLE) {
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
            drawLine(this.ctx, points);
        };
        Sketchpad.prototype.drawSLineDirectly = function (points) {
            drawSLine(this.ctx, points);
        };
        Sketchpad.prototype.drawRectangleDirectly = function (points) {
            drawRectangle(this.ctx, points);
        };
        Sketchpad.prototype.drawSRectangleDirectly = function (points) {
            drawSRectangle(this.ctx, points);
        };
        Sketchpad.prototype.drawCircleDirectly = function (points) {
            drawCircle(this.ctx, points);
        };
        Sketchpad.prototype.drawRoundDirectly = function (points) {
            drawRound(this.ctx, points);
        };
        Sketchpad.prototype.drawEraserDirectly = function (points) {
            drawEraser(this.ctx, points);
        };
        Sketchpad.prototype.drawLine = function (points) {
            points = convertToFloatPoints(this.canvas, points);
            this.drawLineDirectly(points);
        };
        Sketchpad.prototype.drawSLine = function (points) {
            points = convertToFloatPoints(this.canvas, points);
            this.drawSLineDirectly(points);
        };
        Sketchpad.prototype.drawRectangle = function (points) {
            points = convertToFloatPoints(this.canvas, points);
            this.drawRectangleDirectly(points);
        };
        Sketchpad.prototype.drawSRectangle = function (points) {
            points = convertToFloatPoints(this.canvas, points);
            this.drawSRectangleDirectly(points);
        };
        Sketchpad.prototype.drawCircle = function (points) {
            points = convertToFloatPoints(this.canvas, points);
            this.drawCircleDirectly(points);
        };
        Sketchpad.prototype.drawRound = function (points) {
            points = convertToFloatPoints(this.canvas, points);
            this.drawRoundDirectly(points);
        };
        Sketchpad.prototype.drawEraser = function (points) {
            points = convertToFloatPoints(this.canvas, points);
            this.drawEraserDirectly(points);
        };
        Sketchpad.prototype.clearCanvas = function () {
            clearAll(this.canvas);
        };
        Sketchpad.prototype.clearVCanvas = function () {
            clearAll(this.vcanvas);
        };
        return Sketchpad;
    }());

    function sketchpad (options) {
        return new Sketchpad(options);
    }

    return sketchpad;

})));
