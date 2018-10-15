export function getRealPoint(canvas, e) {
    const ex = e.clientX || e.touches[0].clientX;
    const ey = e.clientY || e.touches[0].clientY;
    return {
        x: ex - canvas.offsetLeft,
        y: ey - canvas.offsetTop
    };
}
export function drawLine(context, points) {
    context.beginPath();
    for (const p of points) {
        if (p === points[0]) {
            context.moveTo(p.x, p.y);
        }
        else {
            context.lineTo(p.x, p.y);
        }
    }
    context.stroke();
    console.log(`line with ${points.length} points`);
}
export function drawSLine(context, points) {
    context.beginPath();
    const start = points[0];
    const end = points[1];
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
    console.log(`straight line from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`);
}
export function drawRectangle(context, points, isSolid = false) {
    context.beginPath();
    const start = points[0];
    const end = points[1];
    context.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    if (isSolid) {
        const originLineWidth = context.lineWidth;
        context.lineWidth = 0;
        context.fill();
        context.lineWidth = originLineWidth;
        console.log(`solid rectangle from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`);
    }
    else {
        context.stroke();
        console.log(`rectangle from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`);
    }
}
export function drawCircle(context, points, isSolid = false) {
    context.beginPath();
    const start = points[0];
    const end = points[1];
    const w = end.x - start.x;
    const h = end.y - start.y;
    context.arc(start.x + w / 2, start.y + h / 2, Math.hypot(w, h) / 2, 0, Math.PI * 2, true);
    if (isSolid) {
        const originLineWidth = context.lineWidth;
        context.lineWidth = 0;
        context.fill();
        context.lineWidth = originLineWidth;
        console.log(`round from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`);
    }
    else {
        context.stroke();
        console.log(`circle from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`);
    }
}
export function drawSRectangle(context, points) {
    drawRectangle(context, points, true);
}
export function drawRound(context, points) {
    drawCircle(context, points, true);
}
export function drawEraserOnce(context, x, y) {
    let radius = 8;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.fill();
}
export function drawEraser(context, points) {
    for (const p of points) {
        drawEraserOnce(context, p.x, p.y);
    }
    console.log(`eraser with ${points.length} points`);
}
export function convertToFloatPoints(canvas, points) {
    return points.map(point => ({
        x: point.x * canvas.width / 10000,
        y: point.y * canvas.height / 10000
    }));
}
export function convertToIntegerPoints(canvas, points) {
    return points.map(point => ({
        x: Math.round((point.x / canvas.width) * 10000),
        y: Math.round((point.y / canvas.height) * 10000)
    }));
}
export function clearAll(canvas) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}
