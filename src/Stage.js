/**
 * Created by domnli on 16/4/1.
 */
(function(trajectory){
    var canvas = trajectory.createCanvas();
    trajectory.Stage = Stage;

    function Stage(obj){
        if(obj){return trajectory.mixin(obj)};

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.atoms = [];
    }

    Stage.prototype.render = function(){
        if(this.atoms){
            for(var i = 0;i<this.atoms.length;i++){
                var atom = this.atoms[i];
                trajectory.drawSolidCircle(ctx,atom.get("x"),atom.get("y"),atom.get('radius'),atom.get('rgba'));
            }
        }
    }

})(trajectory);
