import {
	baseUrl
} from "@/static/siteinfo/index.js"



import _class from "../utils/class.js"
import _func from "../utils/functional.js"

const http = (params = {}) => {
	const Point = new _class.Point()
	let obj = {
		successText: "数据请求成功",
		fileText: "服务器连接失败",
		text: "数据请求中"
	}
	Point.start(6000, obj)
	params.header = params.header || {}

	return new Promise((resolve, reject) => {
		const obj = {
			0: "application/x-www-form-urlencoded",
			1: "application/json"
		}
		uni.request({
			url: baseUrl() + params.url,
			data: params.data,
			header: {
				"Content-Type": params.type && params.type == 1 ? obj[1] : obj[0],
				"token": uni.getStorageSync("token") || ''
			},
			method: params.method || 'POST',
			success: function(res) {
				if (res.statusCode == 200) {
					Point.end()
					if (res.data.status == 401) {
						// uni.showToast({
						// 	icon: "none",
						// 	title: res.data.msg
						// })
						resolve(false)
					} else if (res.data.status == 0) {
						resolve(res.data.data ? res.data.data : res.data)
					} else if (res.data.status == 500) {
						Point.end()
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
						resolve(false)
					} else if (res.data.status == 1 || res.data.status == 10001) {
						uni.showToast({
							icon: "none",
							title: res.data.msg
						})
						resolve(false)
					} else {
						resolve(false)
					}
				} else if (res.statusCode === 400 || res.statusCode === 500) {
					Point.end()
					uni.showToast({
						icon: "none",
						title: res.data.errmsg || res.data.msg
					})
					resolve(false)
				} else {
					Point.file()
					resolve(false)
				}
			},
			fail: function(e) {
				Point.end()
				resolve(false)
			}
		})
	})
}
async function subMsg(temps) {
	return new Promise((resolve, reject) => {
		wx.requestSubscribeMessage({
			tmplIds: temps,
			success(res) {
				console.log(res)
				resolve(res)
			},
			fail(res) {
				console.log(res)
				resolve(res)
			}
		});
	})
}
async function getCode() {
	return new Promise((resolve, reject) => {
		uni.login({
			success(res) {
				resolve(res.code)
			}
		})
	})
}
async function getUserInfo() {
	const code = await getCode()
	uni.setStorageSync("code", code)
	let data = await http({
		url: `/zuul/gp-center-auth/uaa/wxMiniAppLogin/authorize/${code}`,
		method: "get"
	})
	var pages = getCurrentPages(); //获取加载的页面
	var currentPage = pages[pages.length - 1]; //获取当前页面的对象
	var url = currentPage.route; //当前页面url
	if (data) {
		uni.setStorageSync('userInfo', data);
		if (data.token) {
			uni.setStorageSync('token', data.token);
		} else {
			uni.setStorageSync('token', "");
		}
	}
	return data
}
async function createUser(detail) {
	const create = await http({
		url: '/zuul/gp-center-enterprise/enterprise//user/anonymity/createUser',
		data: {
			code: uni.getStorageSync('code'),
			encryptedData: detail.encryptedData,
			iv: detail.iv
		}
	});
	uni.setStorageSync('token', create.token);
	if (create) {
		const bindWechat = await http({
			url: "/zuul/gp-center-upms/upms/userAccount/bindWxMiniApp",
			data: {
				openId: uni.getStorageSync('userInfo').openId,
				sign: uni.getStorageSync('userInfo').sign
			}
		})
	}
	return create
}
export default {
	http,
	getUserInfo,
	subMsg,
	getCode,
	createUser
}
