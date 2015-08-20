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
		var tpl = '<div style=""><span style="display:block">颜色</span><input type="color"class="item rgb" /></div>'
				+ '<div style=""><span style="display:block">透明</span><input type="input"  style="width:25px;" value="1" class="item alpha" /></div>'
				+ '<div style=""><span style="display:block;margin-top:3px">半径</span><input type="input" style="width:25px;" value="3" class="item radius" /></div>';
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
		var config = {},
			hex = $('#configPanl .rgb').val(),
			alpha = $('#configPanl .alpha').val();
		// TODO 检测输入值
		config.rgba = 'rgba(' + parseInt(hex.substr(1,2),16) + ',' + parseInt(hex.substr(3,2),16) + ',' + parseInt(hex.substr(5,2),16) + ',' + alpha + ')';
		config.radius = $('#configPanl .radius').val();
		console.log(config);
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
		draw();
	});
	$(document).on('keyup',function(e){

	});
	$(canvas).on('mousedown',function(e){
		var config = getConfig();
		crtAtom = {x:e.clientX,y:e.clientY,radius:config.radius,rgba:config.rgba};
		atoms.push(crtAtom);
		draw();
	});

	function draw(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(var i=0; i<atoms.length; i++){
			var atom = atoms[i];
			cpi.drawSolidCircle(ctx,atom.x,atom.y,atom.radius,atom.rgba);
		}
	}

	exports.getAtoms = function(){
		return atoms;
	}
});