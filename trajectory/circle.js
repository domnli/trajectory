define(function(require,exports,module){
	var Emitter = require("./util/emitter"),
		Renderer = require("./util/renderer"),
		Atom = require("./atom");

	function Circle(conf){
		this.atoms = [];
		conf = conf||{};
		this.center = {x:conf.x||10,y:conf.y||10};
		this.vel = conf.vel||0.01;
	}

	Emitter(Circle.prototype);
	Renderer(Circle.prototype);

	Circle.prototype.addAtom = function(atoms){
		if(atoms instanceof Array){
			for(var i = 0; i<atoms.length; i++){
				add(atoms[i],this);
			}
		}else{
			add(atoms,this);
		}

		function add(atom,circle){
			if(atom.x && atom.y){
				if(!(atom instanceof Atom)){
					atom = new Atom(atom);
				}
				atom.radius = Math.sqrt(Math.pow(Math.abs(circle.center.x-atom.get('x')),2) + Math.pow(Math.abs(circle.center.y-atom.get('y')),2));
				if(atom.get('x')>circle.center.x && atom.get('y')>circle.center.y){ // 第一象限
					atom.radian = Math.asin((atom.get('y')-circle.center.y)/atom.radius)
				}else if(atom.get('x')<circle.center.x && atom.get('y')>circle.center.y){//第二象限
					atom.radian = Math.asin((atom.get('y')-circle.center.y)/atom.radius) + Math.PI/2;
				}else if(atom.get('x')<circle.center.x && atom.get('y')<circle.center.y){//第三象限
					atom.radian = Math.asin((atom.get('y')-circle.center.y)/atom.radius) + Math.PI*3/2;
				}else if(atom.get('x')>circle.center.x && atom.get('y')<circle.center.y){//第四象限
					atom.radian = Math.asin((atom.get('y')-circle.center.y)/atom.radius) + Math.PI*2;
				}
				circle.atoms.push(atom);
				// circle.queue.push({x:circle.center.x+circle.radius,y:circle.center.y});
			}
		}
	}

	Circle.prototype.next = function(){
		for(var i = 0;i<this.atoms.length;i++){

			var atom = this.atoms[i],
				radius = Math.sqrt(Math.pow(Math.abs(this.center.x-atom.get('x')),2) + Math.pow(Math.abs(this.center.y-atom.get('y')),2));

			atom.radian = atom.radian + this.vel;
			if(atom.radian > Math.PI*2){atom.radian=atom.radian-Math.PI*2;}
			atom.set('x',Math.cos(atom.radian)*radius + this.center.x);
			atom.set('y',Math.sin(atom.radian)*radius + this.center.y);
		}
	}

	module.exports = Circle;
});