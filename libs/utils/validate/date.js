"use strict";

exports.__esModule = true;
module.exports = {
	isDate
}

var _number = require("./number");

function isDate(val) {
  return Object.prototype.toString.call(val) === '[object Date]' && !(0, _number.isNaN)(val.getTime());
}