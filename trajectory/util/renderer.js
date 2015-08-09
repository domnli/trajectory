define(function(require,exports,module){

	var cpi = require("./cpi");
	function Renderer(obj){
		if(obj){return mixin(obj)};
	}

	function mixin(obj) {
      for (var key in Renderer.prototype) {
        obj[key] = Renderer.prototype[key];
      }
      return obj;
    }

	Renderer.prototype.renderTo = function(canvas){
		var ctx = canvas.getContext("2d");
		if(this.atoms){
			for(var i = 0;i<this.atoms.length;i++){
				var atom = this.atoms[i];
				cpi.drawSolidCircle(ctx,atom.get("x"),atom.get("y"),atom.get('radius'),atom.get('rgba'));
			}
		}
	}

	module.exports = Renderer;
});