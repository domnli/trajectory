define(function(require,exports,module){
	var Emitter = require("./util/emitter"),
		Atom = require("./atom"),
		queue = [];

	function Circle(conf){
		this.atoms = [];
		this.radius = conf.radius||10;
		this.center = {x:conf.x||10,y:conf.y||10};
		this.vel = conf.vel||0.001;
	}

	Circle.prototype.addAtom = function(atom){
		if(atom.x && atom.y){
			if(atom instanceof Atom){
				this.atoms.push(atom);
			}else{
				this.atoms.push(new Atom({x:atom.x,y:atom.y}));
			}
			queue.push({this.center.x+this.radius,this.center.y});
		}
		
	}

	Circle.prototype.next = function(){
		
	}
});