/**
 * Created by domnli on 16/3/31.
 */
(function(){
    var trajectory = window.trajectory||(window.trajectory = {});

    trajectory.random = random;

    function random(min,max){
        return Math.floor(Math.random()*(max - min)) + min;
    }

})();
