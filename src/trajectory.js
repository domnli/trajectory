/**
 * Created by domnli on 16/3/31.
 */
(function(window){

    var document = window.document,
        trajectory = window.trajectory||(window.trajectory = {});

    trajectory.random = random;
    trajectory.mixin = mixin;
    trajectory.createCanvas = createCanvasFullScreen;
    trajectory.drawSolidCircle = drawSolidCircle;

    function random(min,max){
        return Math.floor(Math.random()*(max - min)) + min;
    }

    function mixin(to,from) {
        for (var key in from.prototype) {
            to[key] = from.prototype[key];
        }
    }

    function createCanvasFullScreen(){
        return createCanvas(window.innerWidth,window.innerHeight-5);
    }

    function createCanvas(width,height){
        var canvas = document.createElement('canvas');
        canvas.style.margin =
            canvas.style.padding =
                canvas.style.border =0;
        canvas.width = width,
            canvas.height  = height;

        document.body.style.margin =
            document.body.style.padding =
                document.body.style.border = 0;
        document.body.style.textAlign = 'center';

        document.body.appendChild(canvas);
        return canvas;
    }

    function drawSolidCircle(ctx,x,y,r,fillStyle){
        ctx.beginPath();
        ctx.arc(x,y,r,0,2*Math.PI);
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }

})(window);
