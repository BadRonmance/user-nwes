
class Point {
	timeer = null
	type = "none"
	textObj = {}
	start(wait = 10000, data) {
		this.type = "start"
		this.textObj = data
		clearTimeout(this.timeer)
		clearTimeout(this.timeer1)
		this.timeer = setTimeout(() => {
			if (this.type === "start") {
				uni.showLoading({
					title: data.text || '',
				})
				this.watchTime(wait)
			}
		}, 1000)
	}
	watchTime(wait) {
		this.type = "watch"
		this.timeer1 = setTimeout(() => {
			this.loopStatu()
		}, wait)
	}
	loopStatu() {
		if (this.type === 'watch') {
			this.file()
		}
		if (this.type === 'file') {
			return false
		}
	}
	end() {
		uni.hideLoading()
		uni.hideToast()
		this.type = "end"
		clearTimeout(this.timeer1)
		clearTimeout(this.timeer)
	}
	success() {
		this.type = "success"
		clearTimeout(this.timeer)
		clearTimeout(this.timeer1)
		uni.showToast({
			icon: "success",
			mask: true,
			duration: 2000,
			title: this.textObj.successText || '',
		})
		setTimeout(() => {
			this.end()
		}, 2000)
	}
	file() {
		this.type = "file"
		uni.hideLoading()
		uni.showToast({
			icon: "none",
			mask: true,
			duration: 2000,
			title: this.textObj.fileText || '',
		})
		setTimeout(() => {
			this.end()
		}, 2000)
	}
}
class checkAuth {
	async check() {
		if (projectType() === 'h5') return false
		return new Promise((resolve, reject) => {
			this.getSetting(res => {
				if (res) {
					this._getCityLocation(res => {
						resolve(res)
					})
				} else {
					resolve(false)
				}
			})
		})
	}
	_getCityLocation(callback) {
		uni.getLocation({
			success: (res) => {
				uni.request({
					url: 'https://restapi.amap.com/v3/geocode/regeo?parameters',
					data: {
						key: '82930930d7b3340d5127596055c4c893', //高德key
						location: res.longitude + "," + res.latitude,
						extensions: "all",
						s: "rsx",
						sdkversion: "sdkversion",
						logversion: "logversion"
					},
					success: function(data) {
						let areaCode = data.data.regeocode.addressComponent.adcode;
						callback(data.data.regeocode.addressComponent)
					}
				});
			},
			fail: (error) => {
				callback(false)
			}
		})
	}
	getSetting(callback) {
		// return new Promise((resolve,reject)=>{
		uni.getSetting({
			success: (res) => {
				if (res.authSetting['scope.userLocation'] != undefined && res.authSetting[
						'scope.userLocation'] != true) {
					uni.openSetting({
						success: (dataAu) => {
							if (dataAu.authSetting["scope.userLocation"] == true) {
								callback(true);
							} else {
								uni.showLoading({
									title: '授权提示',
									content: '您暂未开启授权，请前往设置授权',
									success: function(res) {
										uni.openSetting({
											withSubscriptions: true,
										})
									},
									fail: function(error) {
										uni.showToast({
											icon: 'none',
											title: '由于您未开启授权，系统默认为您切换至陕西省西安市',
										})
									}
								})
								callback(false);
							}
						},
						fail: (error) => {
							callback(false);
						}
					})
				} else {
					callback(true);
				}
			}
		})
		// })
	}
}
export default {
	Point,
	checkAuth
};