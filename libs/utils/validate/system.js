"use strict";

exports.__esModule = true;
module.exports = {
	systemInfo,
	canvasProportion
}


async function systemInfo() {
	return new Promise((resolve, reject) => {
		uni.getSystemInfo({
			//获取系统信息成功，将系统窗口的宽高赋给页面的宽高
			success: function(res) {
				resolve(res)
			}
		});
	})
}


async function canvasProportion(width, height, padding = 20) {
	width = Number(width)
	height = Number(height)
	padding = Number(padding)
	let system = await systemInfo()
	let canvasWidth = system.windowWidth - padding;
	const canvasProportion = width / height;
	const canvasHeight = canvasWidth / canvasProportion;
	const widthProportion = canvasWidth / width
	const heightProportion = canvasHeight / height
	return {
		width: canvasWidth,
		height: canvasHeight,
		widthProportion: widthProportion,
		heightProportion: heightProportion,
	}
}
