/**
自定义图形转atom 工具
*/
define(function(require,exports,module){
	var cpi = require('./cpi'),
		$ = jQuery,
		canvas = cpi.createCanvasFullScreen(),
		ctx = canvas.getContext('2d');

	var atoms = [],crtAtom;

	(function(){
		var tpl = '<div style=""><span style="display:block">rgba</span><input type="color" min=1 max=100 class="item rgba" /></div>'
				+ '<div style=""><span style="display:block">半径</span><input type="checkbox" class="item radius" /></div>'
				+ '<div style="margin-top:10px"><button id="executeBtn">执行</button></div>';
		var panl = document.createElement('div'),
			mask = document.createElement('div');
		panl.id = "configPanl";
		mask.id = "panlMask";
		panl.style.cssText = "position: fixed; z-index:300; right:0; top:0; margin:50px; font-size:12px";
		mask.style.cssText = "position: fixed; z-index:301; right:0; top:0; width:300px; height:0px; padding-top:300px; background-color:gray; opacity:0.5; display:none";
		mask.innerHTML = "loading...";
		panl.innerHTML = tpl;
		document.body.appendChild(mask);
		document.body.appendChild(panl);
	})();

	function getConfig(){
		var config = {};
		config.rgba = $('#configPanl .rgba').val() ;
		config.radius = $('#configPanl .radius').val();
		
		return config;
	}

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
		atoms.push(crtAtom);
		crtAtom = {x:e.clientX,y:e.clientY};
		draw();
	});

	function draw(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		cpi.drawSolidCircle(ctx,crtAtom.x,crtAtom.y,3,'black');
	}
});