/**
自定义图形转atom 工具
*/
define(function(require,exports,module){
	var cpi = require('./cpi'),
		$ = jQuery,
		canvas = cpi.createCanvasFullScreen(),
		ctx = canvas.getContext('2d');

	var atoms = [],crtAtom;
	canvas.oncontextmenu=function(){return false;};
	$(document).on('keydown',function(e){
		switch(e.keyCode){
			case 38:
				crtAtom.y -= 1;
				break;
			case 40:
				crtAtom.y += 1;
				break;
			case 37:
				crtAtom.x -= 1;
				break;
			case 39:
				crtAtom.x += 1;
				break;
		}
		console.log(e);
		draw();
	});
	$(document).on('keyup',function(e){
		draw();
		console.log(e);
	});
	$(document).on('mousedown',function(e){
		crtAtom = {x:e.clientX,y:e.clientY};
		draw();
	});

	function draw(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		cpi.drawSolidCircle(ctx,crtAtom.x,crtAtom.y,3,'black');
	}
});