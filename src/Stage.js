/**
 * Created by domnli on 16/4/1.
 */
(function(trajectory){

    trajectory.inheritance.Stage = Stage;

    function Stage(obj){
        if(obj) return trajectory.mixin(obj,Stage);

        this.canvas = trajectory.createCanvas();;
        this.ctx = this.canvas.getContext("2d");
        this.atoms = [];
    }

    Stage.prototype.render = function(){
        if(this.atoms){
            for(var i = 0;i<this.atoms.length;i++){
                var atom = this.atoms[i];
                trajectory.drawSolidCircle(this.ctx,atom.x,atom.y,atom.radius,atom.getRGBA());
            }
        }
    }

})(trajectory);
