<template>
	<view>
		<!-- 用户注册 -->
		<button class="needAuthorization" @click="createUser" v-if="needAuthorization === 1"></button>
	</view>
</template>

<script>
	export default {
		props: {
			needAuthorization: {
				type: Number
			},
		},
		data() {
			return {

			}
		},
		methods: {

			// 用户注册
			createUser(e) {
				wx.getUserProfile({
					desc: '用于完善个人资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: res => {
						this.setuserinfo(res);
					}
				});
			},
			async setuserinfo(e) {
				let data = await this.$http({
					url: '/api/wxuser/authUpdate',
					type: 1,
					data: e
				});
				this.$emit('updateUser');
			},
		}
	}
</script>

<style>
	.needAuthorization {
		width: 100%;
		height: 100%;
		position: fixed;
		left: 0;
		top: 0;
		background: none;
		z-index: 1000;
	}
</style>
