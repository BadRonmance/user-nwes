"use strict";

module.exports.__esModule = true;
module.exports = {
	deepClone
};

var _deepAssign = require("./deep-assign");

function deepClone(obj) {
	var objClone = Array.isArray(obj) ? [] : {};
	if (obj && typeof obj === "object") {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (obj[key] && typeof obj[key] === "object") {
					objClone[key] = deepClone(obj[key]);
				} else {
					objClone[key] = obj[key];
				}
			}
		}
	}
	return objClone;
}
