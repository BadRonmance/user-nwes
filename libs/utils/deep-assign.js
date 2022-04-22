"use strict";

module.exports.__esModule = true;
module.exports = {
	deepAssign
}

var _ = require(".");

var hasOwnProperty = Object.prototype.hasOwnProperty;

function assignKey(to, from, key) {
	var val = from[key];


	if (!hasOwnProperty.call(to, key) || !(0, _.isObject)(val)) {
		to[key] = val;
	} else {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		to[key] = deepAssign(Object(to[key]), from[key]);
	}
}

function deepAssign(to, from) {
	Object.keys(from).forEach(function(key) {
		assignKey(to, from, key);
	});
	return to;
}
