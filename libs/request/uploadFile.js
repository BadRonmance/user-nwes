import {
	baseUrl
} from "@/static/siteinfo/index.js"


import _class from "../utils/class.js"

/**
 * 封装promise 上传
 */
function asyncUpload(params) {
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: baseUrl() + `/api/sys/oss/upload`,
			filePath: params,
			name: 'file',
			header: {
				"token": uni.getStorageSync("token") || ''
			},
			success(res) {
				res.data = JSON.parse(res.data)
				if (res.data.status === 0) {
					resolve(res.data.data)
				} else if (res.data.status === 401) {
					uni.navigateTo({
						url: "/pages/index/index"
					})
					resolve(false)
				} else {
					resolve(false)
				}
			},
			fail(res) {
				resolve(false)
			}
		})
	})
}
/**
 * 封装文件上传
 */
const uploadFile = async (tempFilePaths) => {
	for (let i in tempFilePaths) {
		tempFilePaths[i] = await asyncUpload(tempFilePaths[i])
	}
	let fileList = await Promise.all(tempFilePaths)
	return fileList.findIndex(val => val === false) != -1 ? false : Promise.all(tempFilePaths)
}

function downLoadImage(img) {
	return new Promise(function (resolve, reject) {
		uni.downloadFile({
			url: img,
			success: function (res) {
				resolve(res.tempFilePath);
			},
			fail(res) {
				resolve(false);
			},
		});
	});
}

export default {
	uploadFile,
	downLoadImage,
	asyncUpload
}
