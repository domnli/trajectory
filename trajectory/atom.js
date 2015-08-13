/**
	atom.attr = {
		x:1,
		y:1,
		destination:{x:5,y:5}, 终点坐标
		vel:0.5, 速度
		moveStyle:'', shake
		rgba:'', rgba(0,0,0,1)
		radius:1
	}
*/
define(function(require,exports,module){
	var Emitter = require("./util/emitter");

	function Atom(options){
		this._init(options);
	}

	Emitter(Atom.prototype);

	Atom.prototype._init = function(options){
		this.option = options;
		this._attr = {};
		this._attr.x = options.x||0;
		this._attr.y = options.y||0;
		this._attr.destination = options.destination||{x:this.get('x'),y:this.get('y')};
		this._attr.vel = options.vel||1;
		this._attr.radius = options.radius||1;
		
		this.on('destinationAlter',function(){
			this.rest = false;
		});
	}

	Atom.prototype.get = function(p){
		return this._attr[p];
	}

	Atom.prototype.set = function(p,v){
		this._attr[p] = v;
		this.emit(p+"Alter");
	}

	Atom.prototype.move = function(){
		if(this.rest){
			return;
		}
		var px = this.get('x'),
			py = this.get('y'),
			dest = this.get('destination'),
			dx = dest.x - px,
			dy = dest.y - py,
			vel = this.get('vel'),
			distance,tx,ty;

		distance = Math.sqrt(Math.pow(Math.abs(dx),2) + Math.pow(Math.abs(dy),2));
		if(distance == 0){
			this.rest = true;
			return;
		}
		tx = dx*vel/distance,
		ty = dy*vel/distance;
		if(Math.abs(tx) >= Math.abs(dx)){
			this._attr.x = dest.x;
		}else{
			this._attr.x += tx;
		}
		if(Math.abs(ty) >= Math.abs(dy)){
			this._attr.y = dest.y;
		}else{
			this._attr.y += ty;
		}
	}

	Atom.prototype.moveTo = function(x,y){
		isNaN(x)?undefined:this.set('x',x);
		isNaN(y)?undefined:this.set('y',y);
	}

	module.exports =  Atom;
});