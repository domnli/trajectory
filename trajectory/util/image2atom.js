/**
	图片转atom 工具
*/
define(function(require,exports,module){
	var cpi = require('./cpi'),
		random = require('./random');

	function createConfigDialog(){
		var tpl = '<div style=""><span style="display:block"></span><input type="range" class="" /></div>'
				+ '<div style=""><span style="display:block"></span><input type="checkbox" class="" /></div>';
		var dialog = document.createElement('div');
		dialog.style.cssText = "position: absolute; z-index:300; right:0; top:0; margin:50px; font-size:12px";
		dialog.innerHTML = tpl;
		document.body.appendChild(dialog);
	}
	
	var canvas = cpi.createCanvasFullScreen();
	createConfigDialog();
});