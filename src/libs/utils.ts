interface Point {
    x: number
    y: number
}

export function getRealPoint(canvas: HTMLCanvasElement, e: any): Point {
    const ex = e.clientX || e.touches[0].clientX
    const ey = e.clientY || e.touches[0].clientY
    return {
        x: ex - canvas.offsetLeft,
        y: ey - canvas.offsetTop
    }
}

export function drawLine(context: CanvasRenderingContext2D, points: Array<Point>) {
    context.beginPath()
    for (const p of points) {
        if (p === points[0]) {
            context.moveTo(p.x, p.y)
        } else {
            context.lineTo(p.x, p.y)
        }
    }
    context.stroke()
    console.log(`line with ${points.length} points`)
}

export function drawSLine(context: CanvasRenderingContext2D, points: Array<Point>) {
    context.beginPath()
    const start = points[0]
    const end = points[1]
    context.moveTo(start.x, start.y)
    context.lineTo(end.x, end.y)
    context.stroke()
    console.log(`straight line from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`)
}

export function drawRectangle(context: CanvasRenderingContext2D, points: Array<Point>, isSolid: boolean = false) {
    context.beginPath()
    const start = points[0]
    const end = points[1]
    context.rect(start.x, start.y, end.x - start.x, end.y - start.y)
    if (isSolid) {
        context.fill()
        console.log(`solid rectangle from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`)
    } else {
        context.stroke()
        console.log(`rectangle from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`)
    }
}

export function drawCircle(context: CanvasRenderingContext2D, points: Array<Point>, isSolid: boolean = false) {
    context.beginPath()
    const start = points[0]
    const end = points[1]
    const w = end.x - start.x
    const h = end.y - start.y
    context.arc(start.x + w / 2, start.y + h / 2, Math.hypot(w, h) / 2, 0, Math.PI * 2, true)
    if (isSolid) {
        context.fill()
        console.log(`round from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`)
    } else {
        context.stroke()
        console.log(`circle from [${start.x}, ${start.y}] to [${end.x}, ${end.y}]`)
    }
}

export function drawSRectangle(context: CanvasRenderingContext2D, points: Array<Point>) {
    drawRectangle(context, points, true)
}

export function drawRound(context, points) {
    drawCircle(context, points, true)
}

export function drawEraserOnce(context: CanvasRenderingContext2D, x: number, y: number) {
    let radius = 8
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2, true)
    context.fill()
}

export function drawEraser(context: CanvasRenderingContext2D, points: Array<Point>) {
    for (const p of points) {
        drawEraserOnce(context, p.x, p.y)
    }
    console.log(`eraser with ${points.length} points`)
}

export function convertToFloatPoints(canvas: HTMLCanvasElement, points: Array<Point>): Array<Point> {
    return points.map(point => ({
        x: point.x * canvas.width / 10000,
        y: point.y * canvas.height / 10000
    }))
}

export function convertToIntegerPoints(canvas: HTMLCanvasElement, points: Array<Point>): Array<Point> {
    return points.map(point => ({
        x: Math.round((point.x / canvas.width) * 10000),
        y: Math.round((point.y / canvas.height) * 10000)
    }))
}

export function clearAll(canvas: HTMLCanvasElement) {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
}
