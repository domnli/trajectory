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

	var imageInfo,allAtoms,atoms;

	img.onload = function(){
		ctx.drawImage(img,0,0);
		imageInfo = ctx.getImageData(0,0,img.width,img.height);

		allAtoms = collectAtomsWithRGBA(imageInfo);
	};


	(function(){
		var tpl = '<div style=""><span style="display:block">抽取率</span><input type="range" min=1 max=100 class="item rate" /></div>'
				+ '<div style=""><span style="display:block">打乱顺序</span><input type="checkbox" class="item disorder" /></div>'
				+ '<div style=""><span style="display:block">渲染颜色</span><input type="checkbox" class="item colorful" /></div>'
				+ '<div style=""><span style="display:block">颜色过滤</span>R><input type="text" value="0" style="width:25px" class="item r" />&nbsp;G><input type="text" value="0" style="width:25px" class="item g" />&nbsp;B><input type="text" value="0" style="width:25px" class="item b" />&nbsp;A><input type="text" value="0" style="width:25px" class="item a" /></div>';
		var panl = document.createElement('div'),
			mask = document.createElement('div');
		panl.id = "configPanl";
		mask.id = "panlMask";
		panl.style.cssText = "position: fixed; z-index:300; right:0; top:0; margin:50px; font-size:12px";
		mask.style.cssText = "position: fixed; z-index:301; right:0; top:0; width:300px; height:0px; padding-top:250px; background-color:gray; opacity:0.5; display:none";
		mask.innerHTML = "loading...";
		panl.innerHTML = tpl;
		document.body.appendChild(mask);
		document.body.appendChild(panl);
	})();

	$('#configPanl .item').on('change',function(){
		$('#panlMask').show();
		var config = getConfig();
			allAtoms = collectAtomsWithRGBA(imageInfo);
		atoms = getAtomsByRate(allAtoms,config.rate);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		for(var i=0;i<atoms.length;i++){
			cpi.drawSolidCircle(ctx,atoms[i].x,atoms[i].y,1,config.colorful?atoms[i].rgba:'gray');
		}
		$('#panlMask').hide();
	});

	function getConfig(){
		var config = {};
		config.rate = $('#configPanl .rate').val() ;
		config.disorder = $('#configPanl .disorder').get(0).checked;
		config.colorful = $('#configPanl .colorful').get(0).checked;
		config.r = $('#configPanl .r').val();
		config.g = $('#configPanl .g').val();
		config.b = $('#configPanl .b').val();
		config.a = $('#configPanl .a').val();
		// TODO 检测输入值
		return config;
	}

	function collectAtomsWithRGBA(imageInfo){
		var d = imageInfo.data,allAtoms = [],width = imageInfo.width,config = getConfig();
		for(var i = 0;i<d.length;i+=4){
			var total = d.length/4,
				x,y,rgba;
			
			x = i/4%width;
			y = Math.floor(i/4/width);
			rgba = 'rgba('+d[i]+','+d[i+1]+','+d[i+2]+','+d[i+3]+')';
			if(d[i]>config.r && d[i+1]>config.g && d[i+2]>config.b && d[i+3]>config.a){
				allAtoms.push({x:x,y:y,rgba:rgba});
			}
		}
		return allAtoms;
	}

	function getAtomsByRate(allAtoms,rate){
		var atoms = [],distance,cover,rad=i=0;
		rate = Math.abs(rate < 1 ? rate : rate/100);
		distance = Math.floor(1/rate);
		console.log(distance,rate);
		for(;i+rad<allAtoms.length;i+=cover){
			rad = random(1,distance);
			atoms.push(allAtoms[i+rad]);
			cover = distance*2 - rad;
		}
		console.log(atoms.length);
		return atoms;
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
	exports.getAtoms = function(){
		return atoms;
	}
});