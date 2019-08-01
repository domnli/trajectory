define(function(require,exports,module){

	function random(min,max){
		return Math.floor(Math.random()*(max - min)) + min;
	}
	module.exports = random;
});