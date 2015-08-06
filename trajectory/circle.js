define(function(require,exports,module){
	var Emitter = require("./util/emitter"),
		Atom = require("./atom");

	function Circle(conf){
		this.atoms = [],this.queue = [];
		conf = conf||{};
		this.radius = conf.radius||10;
		this.center = {x:conf.x||10,y:conf.y||10};
		this.vel = conf.vel||0.01;
		this.radian = conf.radian||0;
	}

	Circle.prototype.addAtom = function(atom){
		if(atom.x && atom.y){
			if(atom instanceof Atom){
				this.atoms.push(atom);
			}else{
				this.atoms.push(new Atom({x:atom.x,y:atom.y}));
			}
			this.queue.push({x:this.center.x+this.radius,y:this.center.y});
		}
	}

	Circle.prototype.next = function(){
		var i,temp,
			queue = this.queue;
		temp = queue[0];
		if(temp == undefined){return;}
		this.radian = this.radian + this.vel;
		queue[0].x = Math.cos(this.radian) * this.radius + this.center.x;
		queue[0].y = Math.sin(this.radian) * this.radius + this.center.y;
		for(i=queue.length-1;i>1;i--){
			queue[i] = queue[i-1];
		}
		for(i=0;i<this.atoms.length;i++){
			this.atoms[i].set('x',queue[i].x);
			this.atoms[i].set('y',queue[i].y);
		}
	}

	module.exports = Circle;
});