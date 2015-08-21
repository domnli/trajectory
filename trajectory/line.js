define(function(require,exports,module){
	var Emitter = require("./util/emitter"),
		Renderer = require("./util/renderer"),
		Atom = require("./atom"),
		random = require("./util/random");

	function Line(conf){
		this.atoms = [];
		conf = conf||{};
		this.vel = conf.vel||1;
	}

	Emitter(Line.prototype);
	Renderer(Line.prototype);

	Line.prototype.addAtom = function(atoms){
		if(atoms instanceof Array){
			for(var i = 0; i<atoms.length; i++){
				add(atoms[i],this);
			}
		}else{
			add(atoms,this);
		}

		function add(atom,line){
			if(!(atom instanceof Atom) && atom.x && atom.y){
				atom = new Atom(atom);
			}
			atom.set('vel',line.vel);
			line.atoms.push(atom);
		}
	};

	Line.prototype.next = function(){
		var i = 0,atom,rest = true;
		for(;i<this.atoms.length;i++){
			atom = this.atoms[i];
			if(!atom.rest){
				_next(atom);
				rest = false;
			}
		}
		if(rest){
			this.emit("rest");
		}

		function _next(atom){
			if(this.rest){return;}
			var px = atom.get('x'),
				py = atom.get('y'),
				dest = atom.get('destination'),
				dx = dest.x - px,
				dy = dest.y - py,
				vel = atom.get('vel'),
				distance,tx,ty;

			distance = Math.sqrt(Math.pow(Math.abs(dx),2) + Math.pow(Math.abs(dy),2));
			if(distance === 0){
				atom.rest = true;
				atom.emit('rest');
				return;
			}
			tx = dx*vel/distance;
			ty = dy*vel/distance;
			if(Math.abs(tx) >= Math.abs(dx)){
				atom._attr.x = dest.x;
			}else{
				atom._attr.x += tx;
			}
			if(Math.abs(ty) >= Math.abs(dy)){
				atom._attr.y = dest.y;
			}else{
				atom._attr.y += ty;
			}
		}
	};

	/**
		把atom随机放到指定区域
	*/
	Line.prototype.random = function(x,y,width,height){
		x = x||0;
		y = y||0;
		width = width || 100;
		height = height || 100;

		for(var i = 0;i<this.atoms.length;i++){
			this.atoms[i].set("x",random(x,width));
			this.atoms[i].set("y",random(y,height));
		}
	};
	/**
		随机分配atom的目的地
	*/
	Line.prototype.randomDestination = function(x,y,width,height){
		x = x||0;
		y = y||0;
		width = width || 100;
		height = height || 100;

		for(var i = 0;i<this.atoms.length;i++){
			this.atoms[i].set('destination',{x:random(0,width),y:random(0,height)});
		}
	};

	/**
		设置速度
	*/
	Line.prototype.setVel = function(v){
		if(!isNaN(v)){
			for(var i = 0;i<this.atoms.length;i++){
				this.atoms[i].set("vel",v);
			}
		}
	};

	/**
	 	批量设置atom目的地 不足则新建
	 */
	 Line.prototype.setDestinations = function(coors){
	 	if(coors instanceof Array){
	 		var i = 0;
	 		for(;i<this.atoms.length;i++){
	 			if(coors[i] === undefined){
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

	 };

	module.exports = Line;

});