/**
 * Created by domnli on 16/4/1.
 */
(function(trajectory){
    trajectory.inheritance.Renderer = Renderer;

    function Renderer(obj){
        if(obj) return trajectory.mixin(obj,Renderer);
    }

    Renderer.prototype.renderTo = function(canvas){

    };

})(trajectory);
