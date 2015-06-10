define(function(require,exports,module){
	var Emitter = require("./util/emitter"),
		Atom = require("./atom"),
		random = require("./util/random"),
		cpi = require("./util/cpi");

	/**
		配置项 {
			atomsORcoors : Array[Atom|{x,y}],
			canvas : dom
			ctx : object
		}
	*/
	function Motion(conf){
		this.atoms = [];
		if(conf.atomsORcoors){
			this.setAtoms(conf.atomsORcoors);
		}
		this.canvas = conf.canvas||(function(){throw "必须含有配置项canvas"})();
		this.ctx = conf.ctx||conf.canvas.getContext("2d");
	}

	Emitter(Motion.prototype);

	module.exports = Motion;

	/**
		设置atoms
	*/
	Motion.prototype.setAtoms = function(atomsORcoors){
		if(atomsORcoors && atomsORcoors instanceof Array){
			for(var i=0;i<atomsORcoors.length;i++){
				if(atomsORcoors[i] instanceof Atom){
					this.atoms.push(atomsORcoors[i]);
				}else{
					this.atoms.push(
						new Atom({
							x:atomsORcoors[i].x,
							y:atomsORcoors[i].y,
							rgba:atomsORcoors[i].rgba||'black'
						}));
				}
			}
		}
	}
	
	/**
		把atom随机放到指定区域,默认为整个画布
	*/
	Motion.prototype.randomCoors = function(x,y,width,height){
		x = x||0;
		y = y||0;
		width = width || this.canvas.width;
		height = height || this.canvas.height;

		for(var i = 0;i<this.atoms.length;i++){
			this.atoms[i].set("x",random(x,width));
			this.atoms[i].set("y",random(y,height));
		}
	}

	/**
		下一帧
	*/
	Motion.prototype.next = function(){
		var i = 0,atom,rest = true;
		for(;i<this.atoms.length;i++){
			atom = this.atoms[i];
			if(!atom.rest){
				atom.move();
				rest = false;
			}
			cpi.drawSolidCircle(this.ctx,atom.get("x"),atom.get("y"),1,atom.get('rgba'));
		}
		if(rest){
			this.emit("rest");
		}
	}

	/**
		获取所有atom
	*/
	Motion.prototype.getAtoms = function() {
		return this.atoms;
	}

	/**
		设置速度
	*/
	Motion.prototype.setVel = function(v){
		if(!isNaN(v)){
			for(var i = 0;i<this.atoms.length;i++){
				this.atoms[i].set("vel",v);
			}
		}
	}

	/**
		设置偏移量
	*/
	 Motion.prototype.setOffset = function(x,y){
	 	if(!isNaN(x)){
	 		var i = 0, dest;
	 		y = isNaN(y) ? 0 : y;
	 		for(var i = 0;i<this.atoms.length;i++){
	 			dest = this.atoms[i].get("destination");
	 			this.atoms[i].set("destination",{x:dest.x+x,y:dest.y+y});
	 		}
	 	}
	 }

	 /**
	 	切换形状
	 */
	 Motion.prototype.switchShape = function(coors){
	 	if(coors instanceof Array){
	 		var i = 0;
	 		for(;i<this.atoms.length;i++){
	 			if(coors[i] == undefined){
	 				break;
	 			}
	 			this.atoms[i].set("destination",coors[i]);
	 		}
	 		if(i<this.atoms.length-1){
	 			this.atoms.splice(i);
	 		}else{
	 			for(;i<coors.length;i++){
	 				this.atoms.push(new Atom(coors[i]));
	 			}
	 		}
	 	}

	 }
});