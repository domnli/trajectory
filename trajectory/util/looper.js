(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/**
	timerEvents = {
		100:{   // 时间间隔
				lastest:new Date(), // 最后执行时间
				events:[] // 执行函数数组
			}
	}
		{interval:100,latest:timestamp}:[functions]}
*/
define(function(require,exports,module){
	var events = [],stop = false,timerEvents={};

	function loop(){
		if(stop){return;}
		for(var i = 0; i<events.length; i++){
			events[i]();
		}
		for(var interval in timerEvents){
			if(timerEvents.hasOwnProperty(interval)){
				// TODO
			}
		}
		window.requestAnimationFrame(loop);
	}

	function addEvent(fn){
		if(fn instanceof Function){
			events.push(fn);
		}
		if(fn instanceof Array){
			for(var i = 0; i<fn.length; i++){
				events.push(fn[i]);
			}
		}
	}

	function removeEvent(fn){
		var index = 0;
		for(;index<events.length;index++){
			if(events[index] === fn){
				break;
			}
		}
		events.splice(index,1);
	}

	function stop(){
		stop = true;
	}

	function run(){
		stop = false;
		loop();
	}

	exports.run = run;
	exports.add = addEvent;
	exports.remove = removeEvent;
	exports.stop = stop;
});