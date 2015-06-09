/**
	图片转atom 工具
*/
define(function(require,exports,module){
	var cpi = require('./cpi'),
		random = require('./random');

	function createConfigDialog(){
		function createItem(title){
			var div = document.createElement('div'),
				span = document.createElement('span'),
				input = document.createElement('input');
			div.style.cssText = "";
			span.innerText = title;
			input.style.cssText = "";
			div.appendChild(span);
			div.appendChild(input);

			return div;
		}
		var tpl = '<div style="width: 100%; left: 0px; top: 0px; height: 100%; position: fixed; z-index: 299; display: block; background-color: #333333; opacity: 0.5"></div>'
					+'<div style="position: absolute; z-index:300">'
						+'<div style="">图片路径:<input type="text" class="" /><div>'
						+'<div style="">atom个数:<input type="text" class="" /><div>'
					+'</div>';
		var dg_w = 500,dg_h = 600,
			mask = document.createElement('div'),
			dialog = document.createElement('div');
		mask.style.cssText = "width: 100%; left: 0px; top: 0px; height: 100%; position: fixed; z-index: 299; display: block; background-color: #333333; opacity: 0.5";
		dialog.style.cssText = "position: absolute; z-index:300;width:500px;height:600px";
		dialog.style.width = dg_w;
		dialog.style.height = dg_h;
		dialog.style.left = window.innerWidth/2 - dg_w/2;
		dialog.style.top = window.innerHeight/2 - dg_h/2;
		dialog.appendChild(createItem("图片路径："));


		document.body.appendChild(mask);
		document.body.appendChild(dialog);
	}
	
	var canvas = cpi.createCanvasFullScreen();
	createConfigDialog();
});