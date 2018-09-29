!function(t,s){"object"==typeof exports&&"undefined"!=typeof module?module.exports=s():"function"==typeof define&&define.amd?define(s):t.Sketchpad=s()}(this,function(){"use strict";var n=function(){function s(){this.last=s.FLAG_PENCEL,this.backup=s.FLAG_PENCEL,this.current=0,this.startPoint={x:0,y:0},this.endPoint={x:0,y:0},this.points=[]}return s.prototype.startWorking=function(){0===this.current&&(this.current=this.backup)},s.prototype.endWorking=function(){this.backup=this.current,this.current=0},s.prototype.isWorking=function(){return 0<this.current},s.prototype.setTool=function(t){t!==s.FLAG_ERASER&&(this.last=t),this.backup=t,this.current=0},s.prototype.restoreTool=function(){this.backup=this.last,this.current=0},s.prototype.setStartPoint=function(t){var s=t.x,i=t.y;this.startPoint.x=s,this.startPoint.y=i},s.prototype.getStartPoint=function(){var t=this.startPoint;return{x:t.x,y:t.y}},s.prototype.setEndPoint=function(t){var s=t.x,i=t.y;this.endPoint.x=s,this.endPoint.y=i},s.prototype.getEndPoint=function(){var t=this.endPoint;return{x:t.x,y:t.y}},s.prototype.appendPoints=function(t){this.points.push(t)},s.prototype.clearPoints=function(){this.points=[]},s.FLAG_PENCEL=1,s.FLAG_ERASER=2,s.FLAG_S_LINE=3,s.FLAG_RECTANGLE=4,s.FLAG_CIRCLE=5,s.FLAG_S_RECTANGLE=6,s.FLAG_ROUND=7,s}();function e(t,s){var i=s.clientX||s.touches[0].clientX,n=s.clientY||s.touches[0].clientY;return{x:i-t.offsetLeft,y:n-t.offsetTop}}function o(t,s){t.beginPath();for(var i=0,n=s;i<n.length;i++){var e=n[i];e===s[0]?t.moveTo(e.x,e.y):t.lineTo(e.x,e.y)}t.stroke()}function a(t,s){t.beginPath();var i=s[0],n=s[1];t.moveTo(i.x,i.y),t.lineTo(n.x,n.y),t.stroke()}function r(t,s,i){void 0===i&&(i=!1),t.beginPath();var n=s[0],e=s[1];t.rect(n.x,n.y,e.x-n.x,e.y-n.y),i?t.fill():t.stroke()}function c(t,s,i){void 0===i&&(i=!1),t.beginPath();var n=s[0],e=s[1],o=e.x-n.x,a=e.y-n.y;t.arc(n.x+o/2,n.y+a/2,Math.hypot(o,a)/2,0,2*Math.PI,!0),i?t.fill():t.stroke()}function h(t,s){r(t,s,!0)}function u(t,s){c(t,s,!0)}function p(t,s,i){t.beginPath(),t.arc(s,i,8,0,2*Math.PI,!0),t.fill()}function s(s,t){return t.map(function(t){return{x:t.x*s.width/1e4,y:t.y*s.height/1e4}})}function i(s,t){return t.map(function(t){return{x:Math.round(t.x/s.width*1e4),y:Math.round(t.y/s.height*1e4)}})}function l(t){t.getContext("2d").clearRect(0,0,t.width,t.height)}var d=function(){function t(t){this.status=new n,this.canvas=t.canvas,this.ctx=this.canvas.getContext("2d"),this.onDrawEnd=null,"function"==typeof t.onDrawEnd&&(this.onDrawEnd=t.onDrawEnd),this.canvas.width=t.width,this.canvas.height=t.height,this.ctx.globalCompositeOperation="source-over",this.ctx.lineCap="round",this.ctx.lineJoin="round";var s=this.canvas.getBoundingClientRect();this.vcanvas=document.createElement("canvas"),this.vcanvas.style.position="fixed",this.vcanvas.width=s.width,this.vcanvas.height=s.height,this.vcanvas.style.top=s.top+"px",this.vcanvas.style.left=s.left+"px",this.vctx=this.vcanvas.getContext("2d"),this.vctx.globalCompositeOperation="source-over",this.vctx.lineCap="round",this.vctx.lineJoin="round",this.canvas.parentElement.appendChild(this.vcanvas),this.vcanvas.ontouchstart=this.touchStartHandler.bind(this),this.vcanvas.ontouchmove=this.touchMoveHandler.bind(this),this.vcanvas.ontouchend=this.touchEndHandler.bind(this),this.vcanvas.onmousedown=this.touchStartHandler.bind(this),this.vcanvas.onmousemove=this.touchMoveHandler.bind(this),this.vcanvas.onmouseup=this.touchEndHandler.bind(this)}return t.prototype.destory=function(){this.canvas.parentElement.removeChild(this.vcanvas),this.vcanvas=null},t.prototype.send=function(t,s){"function"==typeof this.onDrawEnd&&this.onDrawEnd(t,s)},t.prototype.touchStartHandler=function(t){this.status.startWorking();var s=e(this.canvas,t);switch(this.status.setStartPoint(s),this.status.current){case n.FLAG_PENCEL:case n.FLAG_ERASER:this.status.clearPoints(),this.status.appendPoints(s)}},t.prototype.touchMoveHandler=function(t){if(this.status&&this.status.isWorking()){var s=e(this.canvas,t);this.status.setEndPoint(s),this.status.appendPoints(s);var i=[this.status.getStartPoint(),s];switch(this.status.current){case n.FLAG_PENCEL:o(this.vctx,this.status.points);break;case n.FLAG_S_LINE:this.clearVCanvas(),a(this.vctx,i);break;case n.FLAG_RECTANGLE:this.clearVCanvas(),r(this.vctx,i);break;case n.FLAG_CIRCLE:this.clearVCanvas(),c(this.vctx,i);break;case n.FLAG_S_RECTANGLE:this.clearVCanvas(),h(this.vctx,i);break;case n.FLAG_ROUND:this.clearVCanvas(),u(this.vctx,i);break;case n.FLAG_ERASER:p(this.ctx,s.x,s.y)}}},t.prototype.touchEndHandler=function(){var t=[this.status.getStartPoint(),this.status.getEndPoint()];switch(this.status.current){case n.FLAG_PENCEL:this.clearVCanvas(),0<this.status.points.length&&(this.drawLineDirectly(this.status.points),this.send("line",i(this.canvas,this.status.points)));break;case n.FLAG_S_LINE:this.clearVCanvas(),this.drawSLineDirectly(t),this.send("s-line",i(this.canvas,t));break;case n.FLAG_RECTANGLE:this.clearVCanvas(),this.drawRectangleDirectly(t),this.send("rectangle",i(this.canvas,t));break;case n.FLAG_CIRCLE:this.clearVCanvas(),this.drawCircleDirectly(t),this.send("circle",i(this.canvas,t));break;case n.FLAG_S_RECTANGLE:this.clearVCanvas(),this.drawSRectangleDirectly(t),this.send("s-rectangle",i(this.canvas,t));break;case n.FLAG_ROUND:this.clearVCanvas(),this.drawRoundDirectly(t),this.send("round",i(this.canvas,t));break;case n.FLAG_ERASER:0<this.status.points.length&&this.send("eraser",i(this.canvas,this.status.points))}this.status.endWorking()},t.prototype.toBeRounded=function(){this.ctx.lineCap="round",this.ctx.lineJoin="round",this.vctx.lineCap="round",this.vctx.lineJoin="round"},t.prototype.toBeRected=function(){this.ctx.lineCap="butt",this.ctx.lineJoin="miter",this.vctx.lineCap="butt",this.vctx.lineJoin="miter"},t.prototype.setDrawWay=function(t){this.ctx.globalCompositeOperation=t,this.vctx.globalCompositeOperation=t},t.prototype.usePencil=function(){this.toBeRounded(),this.setDrawWay("source-over"),this.status.setTool(n.FLAG_PENCEL)},t.prototype.useSLine=function(){this.toBeRounded(),this.setDrawWay("source-over"),this.status.setTool(n.FLAG_S_LINE)},t.prototype.useRectangle=function(){this.toBeRected(),this.setDrawWay("source-over"),this.status.setTool(n.FLAG_RECTANGLE)},t.prototype.useCircle=function(){this.toBeRounded(),this.setDrawWay("source-over"),this.status.setTool(n.FLAG_CIRCLE)},t.prototype.useSRectangle=function(){this.toBeRected(),this.setDrawWay("source-over"),this.status.setTool(n.FLAG_S_RECTANGLE)},t.prototype.useRound=function(){this.toBeRounded(),this.setDrawWay("source-over"),this.status.setTool(n.FLAG_ROUND)},t.prototype.useEraser=function(){this.setDrawWay("destination-out"),this.status.setTool(n.FLAG_ERASER)},t.prototype.changeColor=function(t){this.setDrawWay("source-over"),this.ctx.strokeStyle=t,this.ctx.fillStyle=t,this.vctx.strokeStyle=t,this.vctx.fillStyle=t,this.status.restoreTool(),this.status.current!==n.FLAG_RECTANGLE&&this.status.current!==n.FLAG_S_RECTANGLE||this.toBeRected()},t.prototype.changeLineWidth=function(t){this.ctx.lineWidth=t,this.vctx.lineWidth=t},t.prototype.drawLineDirectly=function(t){o(this.ctx,t)},t.prototype.drawSLineDirectly=function(t){a(this.ctx,t)},t.prototype.drawRectangleDirectly=function(t){r(this.ctx,t)},t.prototype.drawSRectangleDirectly=function(t){h(this.ctx,t)},t.prototype.drawCircleDirectly=function(t){c(this.ctx,t)},t.prototype.drawRoundDirectly=function(t){u(this.ctx,t)},t.prototype.drawEraserDirectly=function(t){!function(t,s){for(var i=0,n=s;i<n.length;i++){var e=n[i];p(t,e.x,e.y)}}(this.ctx,t)},t.prototype.drawLine=function(t){t=s(this.canvas,t),this.drawLineDirectly(t)},t.prototype.drawSLine=function(t){t=s(this.canvas,t),this.drawSLineDirectly(t)},t.prototype.drawRectangle=function(t){t=s(this.canvas,t),this.drawRectangleDirectly(t)},t.prototype.drawSRectangle=function(t){t=s(this.canvas,t),this.drawSRectangleDirectly(t)},t.prototype.drawCircle=function(t){t=s(this.canvas,t),this.drawCircleDirectly(t)},t.prototype.drawRound=function(t){t=s(this.canvas,t),this.drawRoundDirectly(t)},t.prototype.drawEraser=function(t){t=s(this.canvas,t),this.drawEraserDirectly(t)},t.prototype.clearCanvas=function(){l(this.canvas)},t.prototype.clearVCanvas=function(){l(this.vcanvas)},t}();return function(t){return new d(t)}});
