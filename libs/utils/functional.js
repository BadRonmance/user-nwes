module.exports = {
	covertStyle,
	dataType,
	projectType,
	genID,
	getCurrentPage,
	setSwitchTabIndex,
	setNav,
	showToast,
	hideHomeButton,
	setTheme,
	setConsole,
	throttle,
	alert,
	send_code
};

function send_code(code) {
	return new Promise((resolve, reject) => {
		/*code是指图片base64格式数据*/
		//声明文件系统
		const fs = wx.getFileSystemManager();
		//随机定义路径名称
		var times = new Date().getTime();
		var codeimg = wx.env.USER_DATA_PATH + '/' + times + '.png';

		//将base64图片写入
		fs.writeFile({
			filePath: codeimg,
			data: code.slice(22),
			encoding: 'base64',
			success: () => {
				resolve(codeimg)
			},
			fail: () => {
				reject(false)
			}
		});
	})

}

function throttle(fn, wait = 1000) {
	var timer = null;
	return function() {
		var context = this;
		var args = arguments;
		if (!timer) {
			timer = setTimeout(function() {
				fn.apply(context, args);
				timer = null;
			}, wait)
		}
	}
}

function setConsole(message = '', color = '#fc5afcd8', fontSize = '30px') {
	var pages = getCurrentPages()
	var currentPage = pages[pages.length - 1]
	var url = currentPage.route
	console.log("%c " + `${url}========${message}`, `color:${color};font-size:${fontSize}`);
}

function covertStyle(data) {
	if (dataType(data) !== 'Object') return ''
	if (JSON.stringify(data) === '{}') return ''
	let result = []
	Object.entries(data).map(item => {
		result.push(`${item[0]}:${item[1]}`)
	})
	return result.join(";")
}

function dataType(data) {
	return Object.prototype.toString.call(data).replace(/\[|]/g, '').split(" ")[1]
}

function projectType() {
	return window && window.location ? 'h5' : 'mini-program'
}

function genID(length = 18) {
	return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36);
}

function getCurrentPage() {
	var pages = getCurrentPages(); //获取加载的页面
	var currentPage = pages[pages.length - 1]; //获取当前页面的对象
	var url = currentPage.route; //当前页面url
	var options = currentPage.options; //获取url中所带的参数
	//拼接url的参数
	var currentPage = url + '?';
	for (var key in options) {
		var value = options[key]
		currentPage += key + '=' + value + '&';
	}
	currentPage = currentPage.substring(0, currentPage.length - 1);
	return {
		url,
		currentPage
	};
}

function setSwitchTabIndex() {
	const url = getCurrentPage().url
	const tabbar = JSON.parse(uni.getStorageSync("tabbar")) || []
	if (tabbar.length === 0) return 0
	const index = tabbar.findIndex(val => val.pagePath === `/${url}`)
	return index
}


async function setNav(params = null) {
	const url = getCurrentPage().url;
	const navigationBar = params ? params : JSON.parse(uni.getStorageSync("navigationBar"))
	let data = navigationBar[url]
	if (!data) return
	if (data.title !== '') {
		uni.setNavigationBarTitle({
			title: data.title
		});
	}
	uni.setNavigationBarColor({
		frontColor: data.frontColor,
		backgroundColor: data.backgroundColor
	});
}

async function getNavigationBar(theme) {
	// let data = await request.http({
	// 	url: "/advertising/anonymity/page/1000/1",
	// 	method: "post",
	// 	data: {
	// 		code: "fiba_ma_banner",
	// 		showStatus: true
	// 	},
	// })
	// getApp().globalData.themeStyle = covertStyle(theme)
	return navigationBar.default
}


import request from '@/libs/request'

async function setTheme() {
	if (getApp().globalData.themeStyle !== '') {
		return getApp().globalData.themeStyle
	} else {
		let data = await getTheme()
		return data
	}
}

async function getTheme() {
	let data = await request.http({
		url: "/zuul/gp-center-enterprise/enterprise/tenantConfig/anonymity/list",
		method: "post",
		data: {
			clientId: uni.getStorageSync('userInfo').clientId
		},
	})
	let result = []
	data.map(item => {
		if (item.configKey === 'theme') {
			result.push(item)
		}
		if (item.configKey === 'home') {
			uni.setStorageSync('home', item.configValue);
		}
		if (item.configKey === 'personal') {
			uni.setStorageSync('personal', item.configValue);
		}
		if (item.configKey === 'tabbar') {
			uni.setStorageSync('tabbar', item.configValue);
		}
		if (item.configKey === 'navigationBar') {
			uni.setStorageSync('navigationBar', item.configValue);
		}
		if (item.configKey === 'vcCard-placeholder') {
			uni.setStorageSync('vcCard-placeholder', item.configValue);
		}
		if (item.configKey === 'login') {
			uni.setStorageSync('login', item.configValue);
		}

	})
	getApp().globalData.themeStyle = result[0].configValue
	return getApp().globalData.themeStyle
}

function alert(data) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: data.title,
			content: data.content,
			success(res) {
				if (res.confirm) {
					resolve(true)
				} else if (res.cancel) {
					resolve(false)
				}
			}
		})
	})
}

function showToast(title, type, path) {
	title !== '' ? uni.showToast({
		title: title,
		mask: true,
		icon: "none",
		duration: 2000,
	}) : '';
	const timer = title != '' ? 2000 : 0
	setTimeout(() => {
		if (type == -1) {
			uni.navigateBack({
				delta: 1
			})
		} else if (type == 0) {
			uni.navigateTo({
				url: path,
			});
		} else if (type == 1) {
			uni.redirectTo({
				url: path,
			});
		} else if (type == 2) {
			uni.switchTab({
				url: path,
			});
		} else if (type == 3) {
			uni.reLaunch({
				url: path,
			});
		}
	}, timer)
}

function hideHomeButton() {
	// #ifdef  MP-WEIXIN
	uni.hideHomeButton()
	// #endif
}
