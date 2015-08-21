/**
	cpi : canvas api 
*/
define(function(require,exports,module){
	/**
		创建全屏canvas
	*/
	function createCanvasFullScreen(){
		return createCanvas(window.innerWidth,window.innerHeight-5);
	}

	/**
		创建指定尺寸的canvas;
	*/
	function createCanvas(width,height){
		var canvas = document.createElement('canvas');
		canvas.style.margin =
		canvas.style.padding = 
		canvas.style.border =0;
		canvas.width = width,
		canvas.height  = height;

		document.body.style.margin =
	    document.body.style.padding =
	    document.body.style.border = 0;
	    document.body.style.textAlign = 'center';
	    
		document.body.appendChild(canvas);
		return canvas;
	}

	/**
		空心圆
	*/
	function drawHollowCircle(ctx,x,y,r){
		ctx.beginPath();
		ctx.arc(x,y,r,0,2*Math.PI);
		ctx.stroke();
	}

	/**
		实心圆
	*/
	function drawSolidCircle(ctx,x,y,r,fillStyle){
		ctx.beginPath();
		ctx.arc(x,y,r,0,2*Math.PI);
		ctx.fillStyle = fillStyle;
		ctx.fill();
	}

	/**
		操作像素点,默认黑色(循环操作时性能极差)
	*/
	function pixelSetDark(ctx,x,y,r,g,b,a){
		var imgData = ctx.getImageData(x,y,1,1);
		imgData.data[0] = r||0;
		imgData.data[1] = g||0;
		imgData.data[2] = b||0;
		imgData.data[3] = a||255;
		ctx.putImageData(imgData,x,y);
	}


	exports.createCanvasFullScreen = createCanvasFullScreen;
	exports.createCanvas = createCanvas;
	exports.drawHollowCircle = drawHollowCircle;
	exports.drawSolidCircle = drawSolidCircle;
	exports.pixelSetDark = pixelSetDark;
});