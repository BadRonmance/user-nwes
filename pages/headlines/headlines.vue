<template>
	<view>
		<register :needAuthorization="needAuthorization" @updateUser="getUser"></register>
		<canvas
			class="canvas"
			:style="{ width: width + 'px', height: height + 'px' }"
			canvas-id="ctx"
		></canvas>
		<image mode="widthFix" src="../../static/headline/pic.png" class="fixed-bg"></image>
		<view class="headline-box">
			<view class="day-text rel">
				<view class="day-text-box">{{ articleData.articleWy.content }}</view>
				<image
					mode="widthFix"
					class="page-fix-img-0"
					v-if="type === 'morning'"
					src="../../static/headline/day-morning.png"
				></image>
				<image
					mode="widthFix"
					class="page-fix-img-0"
					v-if="type === 'night'"
					src="../../static/headline/day-n.png"
				></image>
				<image
					mode="widthFix"
					class="page-fix-img-1"
					src="../../static/headline/pic_nianfen.png"
				></image>
				<image
					mode="widthFix"
					class="page-fix-img-2"
					v-if="type === 'morning'"
					src="../../static/headline/pic_zaoan.png"
				></image>
				<image
					mode="widthFix"
					class="page-fix-img-2"
					v-if="type === 'night'"
					src="../../static/headline/pic_wanan.png"
				></image>
				<view class="headline-box-date">{{ date }}</view>
			</view>
			<view class=" pa_20">
				<image
					mode="widthFix"
					class="wid"
					style="display: block;"
					src="../../static/headline/pic_xinwengaiyao.png"
				></image>
				<view class="headline-list">
					<view class="headline-list-box">
						<view
							class="headline-list-box-item"
							:key="index"
							v-for="(item, index) in articleData.articleList"
						>
							<text>{{ item.content }}</text>
						</view>
						<view class="textarea-box">
							<textarea
								v-model="articleValue"
								maxlength="100"
								style="padding:20upx"
								@blur="setArticleValue"
								placeholder-class="textarea-class"
								placeholder="在这里添加您的业务，然后分享客户或者朋友圈 您的联系方式"
							/>
						</view>
					</view>
				</view>
			</view>
			<view class="flex flex-bet btn-list">
				<image
					class="flex-img"
					mode="widthFix"
					src="../../static/headline/copy.png"
					@click="getCopyText()"
				></image>
				<image
					class="flex-img"
					mode="widthFix"
					src="../../static/headline/poster.png"
					@click="setCanvas"
				></image>
				<view class="flex-img">
					<button class="reset_btn" open-type="share">
						<image
							mode="widthFix"
							class="wid"
							src="../../static/headline/share.png"
						></image>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
class canvasUtilList {
	constructor(width, height) {
		this.width = width;
		this.height = height;
	}
	setValue(style, text, context) {
		//  当前文本的宽度
		let valWidth = this.getTextLength(style, text);
		style.x = style.x || 0;
		style.y = style.y || 0;
		style = this.setTextAlign(style, valWidth);
		return style;
	}
	getTextLength(style, text) {
		text = String(text);
		var text = text.split('');
		var width = 0;
		text.forEach(function(item) {
			if (/[a-zA-Z]/.test(item)) {
				width += 7;
			} else if (/[0-9]/.test(item)) {
				width += 5.5;
			} else if (/\./.test(item)) {
				width += 2.7;
			} else if (/-/.test(item)) {
				width += 3.25;
			} else if (/[\u4e00-\u9fa5]/.test(item)) {
				//中文匹配
				width += 10;
			} else if (/\(|\)/.test(item)) {
				width += 3.73;
			} else if (/\s/.test(item)) {
				width += 2.5;
			} else if (/%/.test(item)) {
				width += 8;
			} else {
				width += 10;
			}
		});
		return (width * style.size) / 10;
	}
	setTextAlign(style, valWidth) {
		if (style.align === 'center') {
			style.x = (this.width - valWidth) / 2 + style.x;
		}
		if (style.align === 'left') {
			// style.x = style.x;
		}
		if (style.align === 'right') {
			style.x = this.width - valWidth - style.x;
		}
		return style;
	}
}
import register from './components/register.vue';
export default {
	components: {
		register
	},
	data() {
		return {
			needAuthorization: 0,
			date: '',
			width: 320 || wx.getSystemInfoSync().windowWidth,
			height: wx.getSystemInfoSync().windowHeight,
			articleData: {},
			articleValue: '',
			type: '',
			imgs: {
				share:
					'https://szcyy1.oss-cn-beijing.aliyuncs.com/filetest/20220419/1718326576fd6.png',
				copy:
					'https://szcyy1.oss-cn-beijing.aliyuncs.com/filetest/20220419/171857313c0bb9.png',
				poster:
					'https://szcyy1.oss-cn-beijing.aliyuncs.com/filetest/20220419/17184077663564.png'
			}
		};
	},
	onLoad() {
		this.getList();
		this.setTime();
	},

	onShareAppMessage(e) {
		return {
			title: `${uni.getStorageSync('userInfo').nickname}给您分享了一则简讯，请查收`,
			path: `pages/headlines/headlines`
		};
	},
	methods: {
		setTime() {
			let myDate = new Date();
			let month = myDate.getMonth() + 1;
			let day = myDate.getDate();
			let h = myDate.getHours(); // 获取当前小时数(0-23)
			let m = myDate.getMinutes(); // 获取当前分钟数(0-59)
			month = month < 10 ? `0${month}` : `${month}`;
			day = day < 10 ? `0${day}` : `${day}`;
			this.date = `${month}.${day}`;
			let type = 'none';
			if (h >= 5 && h < 8) {
				type = 'morning';
			} else if (h == 8 && m === 0) {
				type = 'morning';
			}
			if (h >= 20 && h < 24) {
				type = 'night';
			} else if (h == 24 && m === 0) {
				type = 'night';
			}
			this.type = type;
		},
		getCopyText() {
			let copyText = '';
			this.articleData.articleList.map((e, index) => {
				copyText += `
${e.content}`;
			});
			let text = `
${this.articleData.title}
${this.articleData.msg || ''}
${this.articleData.tip}
${copyText}
${this.articleValue}
【微语】${this.articleData.articleWy.content}#小程序：我的业务助手
`;
			wx.setClipboardData({
				data: text
			});
		},
		async setArticleValue(e) {
			let data = await this.$http({
				url: '/api/usermessage/save',
				type: 1,
				data: {
					content: this.articleValue
				}
			});
		},
		async getList() {
			getApp().globalData.token === '' && (await this.getUser());
			let data = await this.$http({
				url: '/api/article/list',
				data: {
					pageSize: 10
				},
				method: 'get'
			});
			data.articleList.map((e, index) => {
				e.content = `${index + 1}、${e.content}`;
			});
			this.articleValue = data.userMsg || '';
			this.articleData = data;
		},
		async getUser() {
			const code = await this.$request.getCode();
			let data = await this.$http({
				url: '/api/v1/auth/autoLoginByCode',
				data: {
					code: code
				}
			});
			getApp().globalData.token = data.token;
			uni.setStorageSync('token', data.token);
			this.needAuthorization = data.needAuthorization;
			if (this.needAuthorization === 1) {
				this.$util.showToast('您还未授权', 2, '/pages/index/index');
				return;
			}
			let user = await this.$http({
				url: '/api/wxuser/info',
				method: 'get'
			});
			uni.setStorageSync('userInfo', user);
		},
		downLoadImage(img) {
			return new Promise(function(resolve, reject) {
				uni.downloadFile({
					url: img,
					success: function(res) {
						resolve(res.tempFilePath);
					},
					fail(res) {
						resolve(false);
					}
				});
			});
		},
		async setCanvas() {
			wx.showLoading({
				title: '海报合成中',
				mask: true
			});
			let secondBg = await this.downLoadImage(this.imgs.secondBg);
			let firstBgStyle = {
				x: 20,
				y: 10,
				width: this.width - 40,
				height: 130
			};
			let secondBgStyle = {
				x: 20 + 5,
				y: 10 + 130 + 10,
				width: this.width - 50,
				height: 50
			};
			let length = 0;
			let arr = [];
			let textArr = [];
			let canvasUtil = new canvasUtilList(this.width, this.height);
			this.articleData.articleList.map((ele, index) => {
				this.getText(ele.content, this.width - 120, 4).map((e, index) => {
					textArr.push({
						text: e,
						y: 0,
						x: 40
					});
				});
				arr[index] = {
					content: this.getText(ele.content, this.width - 80, 4),
					style: {
						x: 60,
						y: 0,
						size: 12,
						align: 'left'
					}
				};
				arr[index].style.width = canvasUtil.getTextLength(arr[index].style, ele.content);
			});

			let languageList = this.getText(
				this.articleData.articleWy.content,
				this.width - 120,
				4
			);
			textArr.push({
				text: '',
				x: 40
			});
			this.getText(this.articleValue, this.width - 120, 14).map(e => {
				textArr.push({
					text: e,
					y: 0,
					x: 40
				});
			});
			textArr.map((e, index) => {
				e.y = secondBgStyle.y + 40 + (index + 1) * 20;
			});
			let bgHeight = textArr[textArr.length - 1].y - secondBgStyle.y;
			let canvasHeight = textArr[textArr.length - 1].y + 50;
			let context = uni.createCanvasContext('ctx', this);
			this.height = canvasHeight + 40;
			context.drawImage('../../static/headline/pic.png', 0, 0, this.width, this.height);
			context.drawImage(
				'../../static/headline/firstBg.png',
				firstBgStyle.x,
				firstBgStyle.y,
				firstBgStyle.width,
				firstBgStyle.height
			);
			context.font = `normal normal 12px sans-serif`;
			languageList.map((e, index) => {
				context.fillText(e, 40, index * 20 + 40);
			});
			context.fillText(this.date, this.width - 90, firstBgStyle.y + 78);
			this.type !== 'none' &&
				context.drawImage(
					this.type === 'morning'
						? '../../static/headline/day-morning.png'
						: '../../static/headline/day-n.png',
					firstBgStyle.x + 20,
					firstBgStyle.y + 65,
					80,
					28
				);
			context.drawImage(
				'../../static/headline/pic_nianfen.png',
				firstBgStyle.x + 30,
				firstBgStyle.y + 104,
				50,
				20
			);
			this.type !== 'none' &&
				context.drawImage(
					this.type === 'morning'
						? '../../static/headline/pic_zaoan.png'
						: '../../static/headline/pic_wanan.png',
					(this.width - 80) / 2 + 40,
					firstBgStyle.y + 92,
					100,
					66
				);

			context.drawImage(
				'../../static/headline/secondBg.png',
				secondBgStyle.x,
				secondBgStyle.y,
				secondBgStyle.width,
				secondBgStyle.height
			);
			context.fillStyle = '#F8FCFB';
			context.fillRect(secondBgStyle.x, secondBgStyle.y + 50, secondBgStyle.width, bgHeight);
			context.fillStyle = '#000';
			textArr.map((e, index) => {
				context.fillText(e.text, e.x, e.y);
			});
			context.draw();
			setTimeout(() => {
				this.saveCode();
			}, 1000);
		},
		getText(text, width, line = 2) {
			var context = uni.createCanvasContext('ctx', this);
			var chr = text.split(''); //这个方法是将一个字符串分割成字符串数组
			var temp = '';
			var row = [];
			for (var a = 0; a < chr.length; a++) {
				if (context.measureText(temp).width < width) {
					temp += chr[a];
				} else {
					a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
					row.push(temp);
					temp = '';
				}
			}
			row.push(temp);
			//如果数组长度大于2 则截取前两个
			if (row.length > line) {
				var rowCut = row.slice(0, line);
				var rowPart = rowCut[1];
				var test = '';
				var empty = [];
				for (var a = 0; a < rowPart.length; a++) {
					if (context.measureText(test).width < width - 30) {
						test += rowPart[a];
					} else {
						break;
					}
				}
				empty.push(test);
				var group = empty[0] + '...'; //这里只显示两行，超出的用...表示
				rowCut.splice(1, 1, group);
				row = rowCut;
			}
			return row;
		},
		async saveCode() {
			wx.canvasToTempFilePath({
				canvasId: 'ctx',
				success: function(res) {
					wx.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success(res) {
							wx.hideLoading();
							wx.showToast({
								title: '已保存到相册',
								icon: 'success',
								duration: 3000
							});
						}
					});
				},
				fail: function(res) {
					console.log(res);
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	font-size: 30upx;
}
.canvas {
	position: fixed;
	top: -10000px;
}

.fixed-bg {
	position: fixed;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	z-index: 1;
}

.headline-box {
	position: relative;
	z-index: 10;
	padding: 20upx;
}

.day-text {
	background: url('https://szcyy1.oss-cn-beijing.aliyuncs.com/filetest/20220419/1719181794dd08.png')
		no-repeat;
	background-size: 100%;
	width: 100%;
	height: 400upx;
}

.day-text-box {
	width: 85%;
	margin: 0 auto 0;
	padding-top: 50upx;
	line-height: 1.6;
}

.headline-list {
	// background: url('https://szcyy1.oss-cn-beijing.aliyuncs.com/filetest/20220419/172321529821b0.png')
	// 	no-repeat;
	// background-size: 100%;
	// min-height: 300upx;
	background: #fff;
	padding-top: 20upx;
	padding-bottom: 20upx;
	border-bottom-left-radius: 30upx;
	border-bottom-right-radius: 30upx;
}

.headline-list-box {
	width: 90%;
	margin: 0 auto 0;
	// padding-top: 120upx;
}

.headline-box-date {
	position: absolute;
	width: 200upx;
	height: 50upx;
	right: 50upx;
	bottom: 184upx;
	text-align: right;
}

.date-icon {
	width: 30upx;
	height: 40upx;
	padding: 0 6upx;
}

.headline-list-box-item {
	padding: 10upx 0;
	line-height: 1.5;
}

.circular {
	display: inline-block;
	width: 10upx;
	height: 10upx;
	background: red;
	border-radius: 50%;
}
.textarea-box {
	margin-top: 50upx;
	padding: 20upx;
	background: #edf1f4;
	border-radius: 10upx;
}
textarea {
	width: auto;
	height: 160upx;
	min-height: 100upx;
	background: none;
	color: #000;
	line-height: 1.5;
}

.textarea-class {
	color: #000;
	padding: 20upx;
}

.flex-img {
	width: 32%;
}

.btn-list {
	margin-top: 50upx;
}

.reset_btn {
	width: 100%;
	padding-left: 0 !important;
	padding-right: 0 !important;
	line-height: inherit !important;
	height: auto !important;
	margin: 0 !important;
	font-weight: 500 !important;
	border-radius: none !important;
	background-color: transparent !important;
}

.reset_btn::after {
	border: none !important;
	padding: 0 !important;
	margin: 0 !important;
}

.page-fix-img-0 {
	position: absolute;
	width: 246upx;
	height: 62upx;
	left: 40upx;
	bottom: 170upx;
}

.page-fix-img-1 {
	position: absolute;
	width: 120upx;
	height: 52upx;
	left: 80upx;
	bottom: 84upx;
}

.page-fix-img-2 {
	position: absolute;
	width: 220upx;
	height: 140upx;
	right: 80upx;
	bottom: 24upx;
}
</style>
