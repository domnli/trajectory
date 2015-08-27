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
		this.option = options;
		this._attr = {};
		this._attr.x = options.x||0;
		this._attr.y = options.y||0;
		this._attr.destination = options.destination||{x:this.get('x'),y:this.get('y')};
		this._attr.vel = options.vel||1;
		this._attr.rgba = options.rgba||'rgba(0,0,0,1)';
		this._attr.r = options.r||0;
		this._attr.g = options.g||0;
		this._attr.b = options.b||0;
		this._attr.alpha = 1;
		this._attr.radius = options.radius||1;
		
		this.on('destinationAlter',function(){
			this.rest = false;
		});
	}

	Emitter(Atom.prototype);

	Atom.prototype.get = function(p){
		return this._attr[p];
	};

	Atom.prototype.set = function(p,v){
		this._attr[p] = v;
		this.emit(p+"Alter");
	};

	Atom.prototype.rgba = function(){
		var rgba = 'rgba(%r%,%g%,%b%,%alpha%)';
		rgba = rgba.replace('%r%',this.get('r'))
					.replace('%g%',this.get('g'))
					.replace('%b%',this.get('b'))
					.replace('%alpha%',this.get('alpha'));
		return rgba;
	}

	module.exports =  Atom;
});