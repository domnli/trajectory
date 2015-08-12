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
				lastest:new Date().getTime(), // 最后执行时间
				events:[] // 执行函数数组
			}
	}
		{interval:100,latest:timestamp}:[functions]}
*/
define(function(require,exports,module){
	var stop = false,timerEvents={},numberReg = /^[0-9]*$/;

	function loop(){
		if(stop){return;}
		var i,interval,
			now = new Date().getTime();
		// for(var i = 0; i<events.length; i++){
		// 	events[i]();
		// }
		for(interval in timerEvents){
			if(timerEvents.hasOwnProperty(interval)){
				var events = timerEvents[interval];
				if(events.lastest + parseInt(interval) <= now){
					for(i = 0; i<events.events.length; i++){
						events.events[i]();
					}
					events.lastest = now;
				}
			}
		}
		window.requestAnimationFrame(loop);
	}

	function addEvent(interval,fn){
		if(fn == undefined){
			fn = interval;
			interval = 0;
		}
		if(!numberReg.test(interval)){
			throw new Error("时间间隔应为整数");
		}
		if(timerEvents[interval] == undefined){
			timerEvents[interval] = {
				lastest:new Date().getTime(),
				events:[]
			};
		}
		if(fn instanceof Function){
			timerEvents[interval].events.push(fn);
		}
		if(fn instanceof Array){
			for(var i = 0; i<fn.length; i++){
				timerEvents[interval].events.push(fn[i]);
			}
		}
	}

	function removeEvent(fn){
		var index,interval,events;
		for(interval in timerEvents){
			if(timerEvents.hasOwnProperty(interval)){
				events = timerEvents[interval].events;
				for(index = 0;index<events.length;index++){
					if(events[index] === fn){
						events.splice(index,1);
					}
				}
			}
		}
	
	}

	function stop(){
		stop = true;
	}

	function run(){
		stop = false;
		loop();
	}
window.timerEvents = timerEvents;
	exports.run = run;
	exports.add = addEvent;
	exports.remove = removeEvent;
	exports.stop = stop;
});