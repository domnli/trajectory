/**
	atom.attr = {
		x:1,
		y:1,
		dest:{x:5,y:5}, 终点坐标
		vel:0.5, 速度
		moveStyle:'',
		color:'',
		colorStyle:''
	}
*/
define(function(require,exports,module){

	function Atom(config){
		checkingConfig(config);
		this._init(config);
	}

	function checkingConfig(config){
		var  e = "没有配置项"
		if(config == undefined){
			throw e;
		}
		if(config['x'] == undefined || config['y'] == undefined){
			throw e+"x or y";
		}
	}

	Atom.prototype._init = function(config){
		this.attr = config;

		if(this.attr.dest == undefined){
			this.attr.dest = {x:this.attr.x,y:this.attr.y};
		}
		if(this.attr.vel == undefined){
			this.attr.vel = 1;
		}
	}

	Atom.prototype.get = function(p){
		if(this.attr[p] != undefined){
			return this.attr[p];
		}
	}

	Atom.prototype.set = function(p,v){
		if(this.attr[p] != undefined){
			this.attr[p] = v;
			if(p == "dest"){
				this.standstill = false;
			}
		}
	}

	Atom.prototype.move = function(x,y){
		if(x != undefined && y != undefined){
			this.attr.x = x;
			this.attr.y = y;
			return ;
		}
		if(this.standstill){
			return;
		}
		var px = this.attr.x,
			py = this.attr.y,
			dest = this.attr.dest,
			dx = dest.x - px,
			dy = dest.y - py,
			vel = this.attr.vel,
			distance,tx,ty;

		distance = Math.sqrt(Math.pow(Math.abs(dx),2) + Math.pow(Math.abs(dy),2));
		if(distance == 0){
			this.standstill = true;
			return;
		}
		tx = dx*vel/distance,
		ty = dy*vel/distance;
		if(Math.abs(tx) >= Math.abs(dx)){
			this.attr.x = dest.x;
		}else{
			this.attr.x += tx;
		}
		if(Math.abs(ty) >= Math.abs(dy)){
			this.attr.y = dest.y;
		}else{
			this.attr.y += ty;
		}
	}

	module.exports =  Atom;
});