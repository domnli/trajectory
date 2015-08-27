/**
	atom.attr = {
		x:1,
		y:1,
		destination:{x:5,y:5}, 终点坐标
		vel:0.5, 速度
		moveStyle:'', shake
		rgba:'', rgba(0,0,0,1)
		radius:1
	}
*/
define("trajectory/atom-debug", [ "./util/emitter-debug" ], function(require, exports, module) {
    var Emitter = require("./util/emitter-debug");
    function Atom(options) {
        this.option = options;
        this._attr = {};
        this._attr.x = options.x || 0;
        this._attr.y = options.y || 0;
        this._attr.destination = options.destination || {
            x: this.get("x"),
            y: this.get("y")
        };
        this._attr.vel = options.vel || 1;
        this._attr.rgba = options.rgba || "rgba(0,0,0,1)";
        this._attr.r = options.r || 0;
        this._attr.g = options.g || 0;
        this._attr.b = options.b || 0;
        this._attr.alpha = 1;
        this._attr.radius = options.radius || 1;
        this.on("destinationAlter", function() {
            this.rest = false;
        });
    }
    Emitter(Atom.prototype);
    Atom.prototype.get = function(p) {
        return this._attr[p];
    };
    Atom.prototype.set = function(p, v) {
        this._attr[p] = v;
        this.emit(p + "Alter");
    };
    Atom.prototype.rgba = function() {
        var rgba = "rgba(%r%,%g%,%b%,%alpha%)";
        rgba = rgba.replace("%r%", this.get("r")).replace("%g%", this.get("g")).replace("%b%", this.get("b")).replace("%alpha%", this.get("alpha"));
        return rgba;
    };
    module.exports = Atom;
});

define("trajectory/util/emitter-debug", [], function(require, exports, module) {
    /**
     * Expose `Emitter`.
     */
    module.exports = Emitter;
    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */
    function Emitter(obj) {
        if (obj) return mixin(obj);
    }
    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */
    function mixin(obj) {
        for (var key in Emitter.prototype) {
            obj[key] = Emitter.prototype[key];
        }
        return obj;
    }
    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        (this._callbacks[event] = this._callbacks[event] || []).push(fn);
        return this;
    };
    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    Emitter.prototype.once = function(event, fn) {
        function on() {
            this.off(event, on);
            fn.apply(this, arguments);
        }
        on.fn = fn;
        this.on(event, on);
        return this;
    };
    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */
    Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
        this._callbacks = this._callbacks || {};
        // all
        if (0 == arguments.length) {
            this._callbacks = {};
            return this;
        }
        // specific event
        var callbacks = this._callbacks[event];
        if (!callbacks) return this;
        // remove all handlers
        if (1 == arguments.length) {
            delete this._callbacks[event];
            return this;
        }
        // remove specific handler
        var cb;
        for (var i = 0; i < callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
                callbacks.splice(i, 1);
                break;
            }
        }
        return this;
    };
    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */
    Emitter.prototype.emit = function(event) {
        this._callbacks = this._callbacks || {};
        var args = [].slice.call(arguments, 1), callbacks = this._callbacks[event];
        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, args);
            }
        }
        return this;
    };
    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */
    Emitter.prototype.listeners = function(event) {
        this._callbacks = this._callbacks || {};
        return this._callbacks[event] || [];
    };
    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */
    Emitter.prototype.hasListeners = function(event) {
        return !!this.listeners(event).length;
    };
});

define("trajectory/circle-debug", [ "./util/emitter-debug", "./util/renderer-debug", "./util/cpi-debug", "./atom-debug" ], function(require, exports, module) {
    var Emitter = require("./util/emitter-debug"), Renderer = require("./util/renderer-debug"), Atom = require("./atom-debug");
    function Circle(conf) {
        this.atoms = [];
        conf = conf || {};
        this.center = {
            x: conf.x || 10,
            y: conf.y || 10
        };
        this.vel = conf.vel || .01;
    }
    Emitter(Circle.prototype);
    Renderer(Circle.prototype);
    Circle.prototype.addAtom = function(atoms) {
        if (atoms instanceof Array) {
            for (var i = 0; i < atoms.length; i++) {
                add(atoms[i], this);
            }
        } else {
            add(atoms, this);
        }
        function add(atom, circle) {
            if (!(atom instanceof Atom) && atom.x && atom.y) {
                atom = new Atom(atom);
            }
            circle.atoms.push(atom);
            atom.radius = Math.sqrt(Math.pow(Math.abs(circle.center.x - atom.get("x")), 2) + Math.pow(Math.abs(circle.center.y - atom.get("y")), 2));
            if (atom.radius === 0) {
                atom.radian = 0;
            } else if (atom.get("x") > circle.center.x && atom.get("y") <= circle.center.y) {
                // 第一象限
                atom.radian = Math.asin((circle.center.y - atom.get("y")) / atom.radius);
            } else if (atom.get("x") <= circle.center.x && atom.get("y") < circle.center.y) {
                //第二象限
                atom.radian = Math.PI - Math.asin((circle.center.y - atom.get("y")) / atom.radius);
            } else if (atom.get("x") < circle.center.x && atom.get("y") >= circle.center.y) {
                //第三象限
                atom.radian = Math.asin((atom.get("y") - circle.center.y) / atom.radius) + Math.PI;
            } else if (atom.get("x") >= circle.center.x && atom.get("y") > circle.center.y) {
                //第四象限
                atom.radian = -Math.asin((atom.get("y") - circle.center.y) / atom.radius);
            }
        }
    };
    Circle.prototype.next = function() {
        for (var i = 0; i < this.atoms.length; i++) {
            var atom = this.atoms[i], radius = Math.sqrt(Math.pow(Math.abs(this.center.x - atom.get("x")), 2) + Math.pow(Math.abs(this.center.y - atom.get("y")), 2));
            atom.radian = atom.radian + this.vel;
            if (atom.radian > Math.PI * 2) {
                atom.radian = atom.radian - Math.PI * 2;
            }
            atom.set("x", Math.cos(atom.radian) * radius + this.center.x);
            atom.set("y", -Math.sin(atom.radian) * radius + this.center.y);
        }
    };
    module.exports = Circle;
});

define("trajectory/util/renderer-debug", [ "trajectory/util/cpi-debug" ], function(require, exports, module) {
    var cpi = require("trajectory/util/cpi-debug");
    function Renderer(obj) {
        if (obj) {
            return mixin(obj);
        }
    }
    function mixin(obj) {
        for (var key in Renderer.prototype) {
            obj[key] = Renderer.prototype[key];
        }
        return obj;
    }
    Renderer.prototype.renderTo = function(canvas) {
        var ctx = canvas.getContext("2d");
        if (this.atoms) {
            for (var i = 0; i < this.atoms.length; i++) {
                var atom = this.atoms[i];
                cpi.drawSolidCircle(ctx, atom.get("x"), atom.get("y"), atom.get("radius"), atom.get("rgba"));
            }
        }
    };
    module.exports = Renderer;
});

/**
	cpi : canvas api 
*/
define("trajectory/util/cpi-debug", [], function(require, exports, module) {
    /**
		创建全屏canvas
	*/
    function createCanvasFullScreen() {
        return createCanvas(window.innerWidth, window.innerHeight - 5);
    }
    /**
		创建指定尺寸的canvas;
	*/
    function createCanvas(width, height) {
        var canvas = document.createElement("canvas");
        canvas.style.margin = canvas.style.padding = canvas.style.border = 0;
        canvas.width = width, canvas.height = height;
        document.body.style.margin = document.body.style.padding = document.body.style.border = 0;
        document.body.style.textAlign = "center";
        document.body.appendChild(canvas);
        return canvas;
    }
    /**
		空心圆
	*/
    function drawHollowCircle(ctx, x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.stroke();
    }
    /**
		实心圆
	*/
    function drawSolidCircle(ctx, x, y, r, fillStyle) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }
    /**
		操作像素点,默认黑色(循环操作时性能极差)
	*/
    function pixelSetDark(ctx, x, y, r, g, b, a) {
        var imgData = ctx.getImageData(x, y, 1, 1);
        imgData.data[0] = r || 0;
        imgData.data[1] = g || 0;
        imgData.data[2] = b || 0;
        imgData.data[3] = a || 255;
        ctx.putImageData(imgData, x, y);
    }
    exports.createCanvasFullScreen = createCanvasFullScreen;
    exports.createCanvas = createCanvas;
    exports.drawHollowCircle = drawHollowCircle;
    exports.drawSolidCircle = drawSolidCircle;
    exports.pixelSetDark = pixelSetDark;
});

define("trajectory/line-debug", [ "./util/emitter-debug", "./util/renderer-debug", "./util/cpi-debug", "./atom-debug", "./util/random-debug" ], function(require, exports, module) {
    var Emitter = require("./util/emitter-debug"), Renderer = require("./util/renderer-debug"), Atom = require("./atom-debug"), random = require("./util/random-debug");
    function Line(conf) {
        this.atoms = [];
        conf = conf || {};
        this.vel = conf.vel || 1;
    }
    Emitter(Line.prototype);
    Renderer(Line.prototype);
    Line.prototype.addAtom = function(atoms) {
        if (atoms instanceof Array) {
            for (var i = 0; i < atoms.length; i++) {
                add(atoms[i], this);
            }
        } else {
            add(atoms, this);
        }
        function add(atom, line) {
            if (!(atom instanceof Atom) && atom.x && atom.y) {
                atom = new Atom(atom);
            }
            atom.set("vel", line.vel);
            line.atoms.push(atom);
        }
    };
    Line.prototype.next = function() {
        var i = 0, atom, rest = true;
        for (;i < this.atoms.length; i++) {
            atom = this.atoms[i];
            if (!atom.rest) {
                _next(atom);
                rest = false;
            }
        }
        if (rest) {
            this.emit("rest");
        }
        function _next(atom) {
            if (this.rest) {
                return;
            }
            var px = atom.get("x"), py = atom.get("y"), dest = atom.get("destination"), dx = dest.x - px, dy = dest.y - py, vel = atom.get("vel"), distance, tx, ty;
            distance = Math.sqrt(Math.pow(Math.abs(dx), 2) + Math.pow(Math.abs(dy), 2));
            if (distance === 0) {
                atom.rest = true;
                atom.emit("rest");
                return;
            }
            tx = dx * vel / distance;
            ty = dy * vel / distance;
            if (Math.abs(tx) >= Math.abs(dx)) {
                atom._attr.x = dest.x;
            } else {
                atom._attr.x += tx;
            }
            if (Math.abs(ty) >= Math.abs(dy)) {
                atom._attr.y = dest.y;
            } else {
                atom._attr.y += ty;
            }
        }
    };
    /**
		把atom随机放到指定区域
	*/
    Line.prototype.random = function(x, y, width, height) {
        x = x || 0;
        y = y || 0;
        width = width || 100;
        height = height || 100;
        for (var i = 0; i < this.atoms.length; i++) {
            this.atoms[i].set("x", random(x, width));
            this.atoms[i].set("y", random(y, height));
        }
    };
    /**
		随机分配atom的目的地
	*/
    Line.prototype.randomDestination = function(x, y, width, height) {
        x = x || 0;
        y = y || 0;
        width = width || 100;
        height = height || 100;
        for (var i = 0; i < this.atoms.length; i++) {
            this.atoms[i].set("destination", {
                x: random(0, width),
                y: random(0, height)
            });
        }
    };
    /**
		设置速度
	*/
    Line.prototype.setVel = function(v) {
        if (!isNaN(v)) {
            for (var i = 0; i < this.atoms.length; i++) {
                this.atoms[i].set("vel", v);
            }
        }
    };
    /**
	 	批量设置atom目的地 不足则新建
	 */
    Line.prototype.setDestinations = function(coors) {
        if (coors instanceof Array) {
            var i = 0;
            for (;i < this.atoms.length; i++) {
                if (coors[i] === undefined) {
                    break;
                }
                this.atoms[i].set("destination", coors[i]);
            }
            if (i < this.atoms.length - 1) {
                this.atoms.splice(i);
            } else {
                for (;i < coors.length; i++) {
                    this.atoms.push(new Atom(coors[i]));
                }
            }
        }
    };
    module.exports = Line;
});

define("trajectory/util/random-debug", [], function(require, exports, module) {
    function random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    module.exports = random;
});

define("trajectory/shape-debug", [ "./util/emitter-debug", "./util/renderer-debug", "./util/cpi-debug", "./atom-debug", "./util/random-debug" ], function(require, exports, module) {
    var Emitter = require("./util/emitter-debug"), Renderer = require("./util/renderer-debug"), Atom = require("./atom-debug"), random = require("./util/random-debug");
    function Shape(conf) {
        conf = conf || {};
    }
    // TODO
    module.exports = Shape;
});

/**
	图片转atom 工具
*/
define("trajectory/util/image2atom-debug", [ "./cpi-debug", "./random-debug" ], function(require, exports, module) {
    var cpi = require("./cpi-debug"), random = require("./random-debug"), $ = jQuery, canvas = cpi.createCanvasFullScreen(), ctx = canvas.getContext("2d"), img = new Image();
    var imageInfo, allAtoms, atoms;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        imageInfo = ctx.getImageData(0, 0, img.width, img.height);
        allAtoms = collectAtomsWithRGBA(imageInfo);
    };
    (function() {
        var tpl = '<div style=""><span style="display:block">抽取率</span><input type="range" min=1 max=100 class="item rate" /></div>' + '<div style=""><span style="display:block">打乱顺序</span><input type="checkbox" class="item disorder" /></div>' + '<div style=""><span style="display:block">渲染颜色</span><input type="checkbox" class="item colorful" /></div>' + '<div style=""><span style="display:block">颜色过滤</span>' + '<div style="margin-top:3px"><input type="text" value="0" style="width:25px" class="item rmin" />&lt;=R&lt;=<input type="text" value="255" style="width:25px" class="item rmax" /></div>' + '<div style="margin-top:3px"><input type="text" value="0" style="width:25px" class="item gmin" />&lt;=G&lt;=<input type="text" value="255" style="width:25px" class="item gmax" /></div>' + '<div style="margin-top:3px"><input type="text" value="0" style="width:25px" class="item bmin" />&lt;=B&lt;=<input type="text" value="255" style="width:25px" class="item bmax" /></div>' + '<div style="margin-top:3px"><input type="text" value="0" style="width:25px" class="item amin" />&lt;=A&lt;=<input type="text" value="255" style="width:25px" class="item amax" /></div>' + "</div>" + '<div style="margin-top:10px"><button id="executeBtn">执行</button></div>';
        var panl = document.createElement("div"), mask = document.createElement("div");
        panl.id = "configPanl";
        mask.id = "panlMask";
        panl.style.cssText = "position: fixed; z-index:300; right:0; top:0; margin:50px; font-size:12px";
        mask.style.cssText = "position: fixed; z-index:301; right:0; top:0; width:300px; height:0px; padding-top:300px; background-color:gray; opacity:0.5; display:none";
        mask.innerHTML = "loading...";
        panl.innerHTML = tpl;
        document.body.appendChild(mask);
        document.body.appendChild(panl);
    })();
    $("#configPanl #executeBtn").on("click", function() {
        $("#panlMask").show();
        var config = getConfig();
        allAtoms = collectAtomsWithRGBA(imageInfo);
        console.log(config);
        atoms = getAtomsByRate(allAtoms, config.rate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < atoms.length; i++) {
            cpi.drawSolidCircle(ctx, atoms[i].x, atoms[i].y, 1, config.colorful ? atoms[i].rgba : "gray");
        }
        $("#panlMask").hide();
    });
    function getConfig() {
        var config = {};
        config.rate = $("#configPanl .rate").val();
        config.disorder = $("#configPanl .disorder").get(0).checked;
        config.colorful = $("#configPanl .colorful").get(0).checked;
        config.rmin = $("#configPanl .rmin").val();
        config.gmin = $("#configPanl .gmin").val();
        config.bmin = $("#configPanl .bmin").val();
        config.amin = $("#configPanl .amin").val();
        config.rmax = $("#configPanl .rmax").val();
        config.gmax = $("#configPanl .gmax").val();
        config.bmax = $("#configPanl .bmax").val();
        config.amax = $("#configPanl .amax").val();
        // TODO 检测输入值 >=0 && <= 255
        return config;
    }
    function collectAtomsWithRGBA(imageInfo) {
        var d = imageInfo.data, allAtoms = [], width = imageInfo.width, config = getConfig();
        for (var i = 0; i < d.length; i += 4) {
            var total = d.length / 4, x, y, rgba, r, g, b, alpha;
            x = i / 4 % width;
            y = Math.floor(i / 4 / width);
            r = d[i];
            g = d[i + 1];
            b = d[i + 2];
            alpha = (d[i + 3] / 255).toFixed(2);
            rgba = "rgba(" + d[i] + "," + d[i + 1] + "," + d[i + 2] + "," + (d[i + 3] / 255).toFixed(2) + ")";
            if (config.rmin <= d[i] && d[i] <= config.rmax && config.gmin <= d[i + 1] && d[i + 1] <= config.gmax && config.bmin <= d[i + 2] && d[i + 2] <= config.bmax && config.amin <= d[i + 3] && d[i + 3] <= config.amax) {
                allAtoms.push({
                    x: x,
                    y: y,
                    rgba: rgba,
                    r: r,
                    g: g,
                    b: b,
                    alpha: alpha
                });
            }
        }
        return allAtoms;
    }
    function getAtomsByRate(allAtoms, rate) {
        var atoms = [], distance, cover, rad = i = 0;
        rate = Math.abs(rate < 1 ? rate : rate / 100);
        distance = Math.floor(1 / rate);
        console.log(distance, rate);
        for (;i + rad < allAtoms.length; i += cover) {
            rad = random(1, distance);
            if (allAtoms[i + rad]) {
                atoms.push(allAtoms[i + rad]);
            }
            cover = distance * 2 - rad;
        }
        console.log(atoms.length);
        return atoms;
    }
    // function upsetAtomsSequence(fullAtoms,atoms,atomsLength){
    // 	var start,end,rads = [],
    // 		atomsLength = atomsLength || fullAtoms.length;
    // 	start = new Date().getTime();
    // 	while(atoms.length < atomsLength){
    // 		var rad = random(0,fullAtoms.length);
    // 		if(rads.indexOf(rad) == -1){
    // 			atoms.push(fullAtoms[rad]);
    // 			rads.push(rad);
    // 		}
    // 	}
    // 	end = new Date().getTime();
    // 	console.log((end - start)/1000);
    // }
    function setImgSrc(imgSrc) {
        img.src = imgSrc;
    }
    exports.setImgSrc = setImgSrc;
    exports.getAtoms = function() {
        return atoms;
    };
});

(function() {
    var lastTime = 0;
    var vendors = [ "ms", "moz", "webkit", "o" ];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
})();

/**
	timerEvents = {
		100:{   // 时间间隔
				lastest:new Date().getTime(), // 最后执行时间
				events:[] // 执行函数数组
			}
	}
		{interval:100,latest:timestamp}:[functions]}
*/
define("trajectory/util/looper-debug", [], function(require, exports, module) {
    var stoped = false, timerEvents = {}, numberReg = /^[0-9]*$/;
    function loop() {
        if (stoped) {
            return;
        }
        var i, interval, now = new Date().getTime();
        // for(var i = 0; i<events.length; i++){
        // 	events[i]();
        // }
        for (interval in timerEvents) {
            if (timerEvents.hasOwnProperty(interval)) {
                var events = timerEvents[interval];
                if (events.lastest + parseInt(interval) <= now) {
                    for (i = 0; i < events.events.length; i++) {
                        events.events[i]();
                    }
                    events.lastest = now;
                }
            }
        }
        window.requestAnimationFrame(loop);
    }
    function addEvent(interval, fn) {
        if (fn == undefined) {
            fn = interval;
            interval = 0;
        }
        if (!numberReg.test(interval)) {
            throw new Error("时间间隔应为整数");
        }
        if (timerEvents[interval] == undefined) {
            timerEvents[interval] = {
                lastest: new Date().getTime(),
                events: []
            };
        }
        if (fn instanceof Function) {
            timerEvents[interval].events.push(fn);
        }
        if (fn instanceof Array) {
            for (var i = 0; i < fn.length; i++) {
                timerEvents[interval].events.push(fn[i]);
            }
        }
    }
    function removeEvent(fn) {
        var index, interval, events;
        for (interval in timerEvents) {
            if (timerEvents.hasOwnProperty(interval)) {
                events = timerEvents[interval].events;
                for (index = 0; index < events.length; index++) {
                    if (events[index] === fn) {
                        events.splice(index, 1);
                    }
                }
            }
        }
    }
    function stop() {
        stoped = true;
    }
    function run() {
        stoped = false;
        loop();
    }
    window.timerEvents = timerEvents;
    exports.run = run;
    exports.add = addEvent;
    exports.remove = removeEvent;
    exports.stop = stop;
});

/**
自定义图形转atom 工具
*/
define("trajectory/util/userdefined2atom-debug", [ "./cpi-debug" ], function(require, exports, module) {
    var cpi = require("./cpi-debug"), $ = jQuery, canvas = cpi.createCanvasFullScreen(), ctx = canvas.getContext("2d");
    var atoms = [], crtAtom;
    (function() {
        var tpl = '<div style=""><span style="display:block">颜色</span><input type="color"class="item rgb" /></div>' + '<div style=""><span style="display:block">透明</span><input type="input"  style="width:25px;" value="1" class="item alpha" /></div>' + '<div style=""><span style="display:block;margin-top:3px">半径</span><input type="input" style="width:25px;" value="3" class="item radius" /></div>';
        var panl = document.createElement("div"), mask = document.createElement("div");
        panl.id = "configPanl";
        mask.id = "panlMask";
        panl.style.cssText = "position: fixed; z-index:300; right:0; top:0; margin:50px; font-size:12px";
        mask.style.cssText = "position: fixed; z-index:301; right:0; top:0; width:300px; height:0px; padding-top:300px; background-color:gray; opacity:0.5; display:none";
        mask.innerHTML = "loading...";
        panl.innerHTML = tpl;
        document.body.appendChild(mask);
        document.body.appendChild(panl);
    })();
    function getConfig() {
        var config = {}, hex = $("#configPanl .rgb").val(), alpha = $("#configPanl .alpha").val();
        // TODO 检测输入值
        config.rgba = "rgba(" + parseInt(hex.substr(1, 2), 16) + "," + parseInt(hex.substr(3, 2), 16) + "," + parseInt(hex.substr(5, 2), 16) + "," + alpha + ")";
        config.r = parseInt(hex.substr(1, 2), 16);
        config.g = parseInt(hex.substr(3, 2), 16);
        config.b = parseInt(hex.substr(5, 2), 16);
        config.alpha = alpha;
        config.radius = $("#configPanl .radius").val();
        console.log(config);
        return config;
    }
    canvas.oncontextmenu = function() {
        return false;
    };
    $(document).on("keydown", function(e) {
        switch (e.keyCode) {
          case 38:
            crtAtom.y -= 1;
            break;

          case 40:
            crtAtom.y += 1;
            break;

          case 37:
            crtAtom.x -= 1;
            break;

          case 39:
            crtAtom.x += 1;
            break;
        }
        draw();
    });
    $(document).on("keyup", function(e) {});
    $(canvas).on("mousedown", function(e) {
        var config = getConfig();
        crtAtom = {
            x: e.clientX,
            y: e.clientY,
            radius: config.radius,
            rgba: config.rgba,
            r: config.r,
            g: config.g,
            b: config.b,
            alpha: config.alpha
        };
        atoms.push(crtAtom);
        draw();
    });
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < atoms.length; i++) {
            var atom = atoms[i];
            cpi.drawSolidCircle(ctx, atom.x, atom.y, atom.radius, atom.rgba);
        }
    }
    exports.getAtoms = function() {
        return atoms;
    };
});
