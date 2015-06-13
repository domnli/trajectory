/**
	图片转atom 工具
*/
define(function(require,exports,module){
	var cpi = require('./cpi'),
		random = require('./random'),
		$ = require('jquery'),
		canvas = cpi.createCanvasFullScreen(),
		ctx = canvas.getContext('2d'),
		img = new Image();

	var imageInfo,allAtoms;

	img.onload = function(){
		ctx.drawImage(img,0,0);
		imageInfo = ctx.getImageData(0,0,img.width,img.height);

		allAtoms = collectAtomsWithRGBA(imageInfo);
	};



	$('#configPanl .item').on('change',function(){
		console.log(getConfig());
	});

	(function(){
		var tpl = '<div style=""><span style="display:block">抽取率</span><input type="range" class="item extract" /></div>'
				+ '<div style=""><span style="display:block">乱序</span><input type="checkbox" class="item disorder" /></div>';
		var panl = document.createElement('div');
		panl.id = "configPanl";
		panl.style.cssText = "position: fixed; z-index:300; right:0; top:0; margin:50px; font-size:12px";
		panl.innerHTML = tpl;
		document.body.appendChild(panl);
	})();

	function getConfig(){
		var config = {};
		config.extract = $('#configPanl .extract').val();
		config.disorder = $('#configPanl .disorder').check();
		return config;
	}

	function collectAtomsWithRGBA(imageInfo){
		var d = imageInfo.data,fullAtoms = [],width = imageInfo.width;
		for(var i = 0;i<d.length;i+=4){
			var total = d.length/4,
				x,y,rgba;
			
			x = i/4%width;
			y = Math.floor(i/4/width);
			rgba = 'rgba('+d[i]+','+d[i+1]+','+d[i+2]+','+d[i+3]+')';
			fullAtoms.push({x:x,y:y,rgba:rgba});
		}
		return fullAtoms;
	}

	// function upsetAtomsSequence(fullAtoms,atoms,atomsLength){
	// 	var start,end,rads = [],
	// 		atomsLength = atomsLength || fullAtoms.length;
	// 	start = new Date().getTime();
	// 	while(atoms.length < atomsLength){
	// 		var rad = random(0,fullAtoms.length);
	// 		if(rads.indexOf(rad) == -1){
	// 			atoms.push(fullAtoms[rad]);
	// 			rads.push(rad);
	// 		}
	// 	}
	// 	end = new Date().getTime();
	// 	console.log((end - start)/1000);
	// }

	function setImgSrc(imgSrc){
		img.src = imgSrc;
	}
	exports.setImgSrc = setImgSrc;
});