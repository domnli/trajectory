/**
 * Created by domnli on 16/4/1.
 */
(function(trajectory){
    var Emitter = trajectory.inheritance.Emitter;
    trajectory.Atom = Atom;

    function Atom(option){
        this.option = option;
        this.x = option.x||0;
        this.y = option.y||0;
        this.destination = option.destination||{x:this.x,y:this.y};
        this.vel = option.vel||1;
        this.r = option.r||0;
        this.g = option.g||0;
        this.b = option.b||0;
        this.alpha = option.alpha||1;
        this.radius = option.radius||1;
    }

    Emitter(Atom.prototype);
    
    Atom.prototype.getRGBA = function(){
        return 'rgba('+this.r+','+this.g+','+this.b+','+this.alpha+')';
    }

})(trajectory);