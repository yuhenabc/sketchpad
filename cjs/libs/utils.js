"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getRealPoint(canvas, e) {
    var ex = e.clientX || e.touches[0].clientX;
    var ey = e.clientY || e.touches[0].clientY;
    return {
        x: ex - canvas.offsetLeft,
        y: ey - canvas.offsetTop
    };
}
exports.getRealPoint = getRealPoint;
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
exports.drawLine = drawLine;
function drawSLine(context, points) {
    context.beginPath();
    var start = points[0];
    var end = points[1];
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    console.log("straight line from [" + start.x + ", " + start.y + "] to [" + end.x + ", " + end.y + "]");
}
exports.drawSLine = drawSLine;
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
exports.drawRectangle = drawRectangle;
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
exports.drawCircle = drawCircle;
function drawSRectangle(context, points) {
    drawRectangle(context, points, true);
}
exports.drawSRectangle = drawSRectangle;
function drawRound(context, points) {
    drawCircle(context, points, true);
}
exports.drawRound = drawRound;
function drawEraserOnce(context, x, y) {
    var radius = 8;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.fill();
}
exports.drawEraserOnce = drawEraserOnce;
function drawEraser(context, points) {
    for (var _i = 0, points_2 = points; _i < points_2.length; _i++) {
        var p = points_2[_i];
        drawEraserOnce(context, p.x, p.y);
    }
    console.log("eraser with " + points.length + " points");
}
exports.drawEraser = drawEraser;
function convertToFloatPoints(canvas, points) {
    return points.map(function (point) { return ({
        x: point.x * canvas.width / 10000,
        y: point.y * canvas.height / 10000
    }); });
}
exports.convertToFloatPoints = convertToFloatPoints;
function convertToIntegerPoints(canvas, points) {
    return points.map(function (point) { return ({
        x: Math.round((point.x / canvas.width) * 10000),
        y: Math.round((point.y / canvas.height) * 10000)
    }); });
}
exports.convertToIntegerPoints = convertToIntegerPoints;
function clearAll(canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}
exports.clearAll = clearAll;
