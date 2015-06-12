/**
	图片转atom 工具
*/
define(function(require,exports,module){
	var cpi = require('./cpi'),
		random = require('./random'),
		$ = require('jquery');
		console.log($);

	function createConfigDialog(){
		var tpl = '<div style=""><span style="display:block">抽取率</span><input type="range" class="item extract" /></div>'
				+ '<div style=""><span style="display:block">乱序</span><input type="checkbox" class="item disorder" /></div>';
		var panl = document.createElement('div');
		panl.id = "configPanl";
		panl.style.cssText = "position: absolute; z-index:300; right:0; top:0; margin:50px; font-size:12px";
		panl.innerHTML = tpl;
		document.body.appendChild(panl);
	}

	function getConfig(){
		var config = {};
		config.extract = $('#configPanl .extract').val();
		config.disorder = $('#configPanl .disorder').val();
		return config;
	}
	
	var canvas = cpi.createCanvasFullScreen();
	createConfigDialog();
	console.log(getConfig());
});