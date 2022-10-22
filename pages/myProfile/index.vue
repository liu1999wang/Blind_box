<template>
	<view class="container safe-area-bottom">
		<!-- <view class="exit-btn" hover-class="hover" @tap="handleLogout">
			退出登陆
		</view> -->
		<view class="headimg-c">
			<image :src="userInfo.headimg"></image>
		</view>
		<view class="info-c">
			<view class="item">
				<view class="key">姓名</view>
				<input v-model="form.name"></input>
			</view>
			<view class="item">
				<view class="key">姓别</view>
				<picker mode="selector" @change="selectGender" :range="gender">
					<view class="uni-input">{{gender[genderIndex]}}</view>
				</picker>
				<!-- <input v-model="form.gender"  placeholder="未填写"></input> -->
			</view>
			<view class="item">
				<view class="key">城市</view>
				<input v-model="form.city"></input>
			</view>
			<view class="item">
				<view class="key">手机</view>

				<!-- #ifdef MP-WEIXIN -->
				<view v-if="userInfo.phone" class="phone-c">
					<button class="get-phone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
						hover-class="hover">
						更换
					</button>
					{{userInfo.phone}}
				</view>
				<button v-else class="get-phone-btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
					hover-class="hover">
					授权
				</button>
				<!-- #endif -->

				<!-- 使用自定义实现的弹窗 -->
				<!-- #ifndef MP-WEIXIN -->
				<view v-if="userInfo.phone" class="phone-c">
					<button class="get-phone-btn" @tap="startGetPhone" hover-class="hover">
						更换
					</button>
					{{userInfo.phone}}
				</view>
				<button v-else class="get-phone-btn" @tap="startGetPhone" hover-class="hover">
					绑定
				</button>
				<!-- #endif -->
				<!-- <input v-model="form.phone" placeholder="未填写"></input> -->
			</view>
			<view class="item">
				<view class="key">邀请码</view>
				<view>
					{{userInfo.invite_code}}
					<text style="color:#1890FF; margin-left: 10rpx; font-size: 80%;" @tap="copyText(userInfo.invite_code)">复制</text>
				</view>
			</view>
			
			<view class="item">
				<view class="key">我的上级</view>
				<view>
					<view style="color:#1890FF; margin-left: 10rpx; font-size: 80%;" @tap="bindInviter" v-if="!userInfo.inviter">点击绑定</view>
					<view v-else>{{userInfo.inviter.name}}</view>
				</view>
			</view>

		</view>
		<view class="button-c">
			<button class="submit-btn" @click="updateProfile">
				<text>保存</text>
			</button>
		</view>

		<view class="footer safe-area-bottom">

			<view @tap="handleDeleteAccount" class="footer-button delete-btn">
				<text>注销帐号</text>
			</view>
			<view @tap="handleLogout" class="footer-button">
				<text>退出登陆</text>
			</view>

		</view>

		<GetPhonePopup v-if="isShowPhonePopup" @success="getPhoneNumberSuccess" @cancel="isShowPhonePopup=false">
		</GetPhonePopup>

	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	// import IButton from "@/components/Button/index.vue"
	export default {
		components: {
			// IButton
		},
		data() {
			return {
				gender: ['男', '女'],
				genderIndex: 0,
				code: '',
				isShowPhonePopup: false,
				form: {
					name: '',
					phone: '',
					city: '',
					gender: '',
					email: '',
					birthday: '',
				},
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		watch: {
			userInfo() {
				this.initForm()
			}
		},
		created() {

			// #ifndef APP-PLUS || H5
			uni.login({
				success: res => {
					this.code = res.code
				},
				fail: err => {}
			})
			// #endif

		},
		async onLoad() {

			this.$store.dispatch("getUserInfo")

			this.initForm()
		},
		methods: {
			bindInviter() {
				uni.showModal({
					title: '请输入邀请码',
					editable: true,
					success: (res) => {
						if (res.confirm) {
							// console.log(res)
							if (!res.content) {
								return false
							}
							this.$http('/user/bind-inviter', 'POST', {
								invite_code: res.content
							}).then(res => {
								uni.showToast({
									title: '绑定成功~',
									icon: 'none'
								})
								this.$store.dispatch("getUserInfo")
							})
						}
					}
				})
			},
			handleDeleteAccount() {
				uni.showModal({
					title: '确定要删除帐号吗?',
					content: '删除帐号后所有帐号资料将无法找回，请谨慎操作!',
					confirmText: '仍然删除',
					cancelText: '暂不删除',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '申请中...'
							})
							this.$http('/user', 'DELETE').then(res => {
								uni.hideLoading()
								uni.showModal({
									title: '申请成功',
									content: '已为您申请删除帐号，待客服审核通过后帐号即会被删除~'
								})
							})
						}
					}
				})
			},
			handleLogout() {
				uni.showModal({
					title: '确定要退出登录吗?',
					confirmText: '退出登录',
					cancelText: '暂不',
					success: (res) => {
						if (res.confirm) {
							this.$store.dispatch("logout")
							uni.showToast({
								title: '已退出登陆，跳转中~',
								icon: 'none'
							})

							setTimeout(() => {
								uni.switchTab({
									url: '/pages/index/index'
								})
								// this.toLoginPage()
							}, 1800)
						}
					}
				})
			},
			startGetPhone() {
				this.isShowPhonePopup = true
			},
			getPhoneNumberSuccess(data) {
				this.$http('/phone-update/with-code', 'POST', {
					phone: data.phone,
					phone_code: data.phone_code
				}).then(res => {
					this.$store.dispatch("getUserInfo")

					uni.showToast({
						title: '手机号更新成功~',
						icon: 'none'
					})

					this.isShowPhonePopup = false
				})
			},
			initForm() {
				this.form.name = this.userInfo.name
				this.form.phone = this.userInfo.phone
				this.form.city = this.userInfo.city
				this.form.gender = this.userInfo.gender
				this.form.email = this.userInfo.email
				this.form.birthday = this.userInfo.birthday

				this.genderIndex = this.userInfo.gender === '男' ? 0 : 1
			},
			updateProfile() {
				// if (!this.form.birthday) {
				// 	uni.showModal({
				// 		'title': '提示',
				// 		'content': '请填写生日'
				// 	})
				// 	return false
				// }
				uni.showLoading({
					title: "更新中"
				})
				this.$http({
					url: '/user',
					method: 'PUT',
					data: this.form
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '更新成功，跳转中~',
						icon: 'none'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1300)
				})
			},
			selectBirthday(e) {
				this.form.birthday = e.detail.value
			},
			selectGender(e) {
				this.genderIndex = e.detail.value
				this.form.gender = this.gender[this.genderIndex]
			},
			getPhoneNumber(e) {
				if (!e.detail.encryptedData) return

				console.log('eeee', e)
				this.$http('/phone-update/with-miniapp', 'POST', {
					encrypt_data: e.detail.encryptedData,
					iv: e.detail.iv,
					code: this.code
				}).then(res => {
					this.$store.dispatch("getUserInfo")

					uni.showModal({
						title: '手机号更新成功~',
						icon: 'none'
					})

					uni.login({
						success: res => {
							this.code = res.code
						},
						fail: err => {}
					})
				})
			},
		},
		onShow() {},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		}
	}
</script>
<style lang="scss">
	page {
		background: white;
	}
</style>
<style lang="scss" scoped>
	.exit-btn {
		background: #f1f1f1;
		// width: 200rpx;
		text-align: center;
		font-size: 24rpx;
		font-weight: 500;
		position: fixed;
		right: 30rpx;
		top: 30rpx;
		border-radius: 50rpx;
		padding: 6rpx 20rpx;
	}

	.phone-c {
		display: flex;
		align-items: center;

		.get-phone-btn {
			font-size: 24rpx;
			margin-right: 20rpx;
		}
	}

	.submit-btn {
		background: #FFCC00;
		border-radius: 100rpx;
		width: 90%;
		color: white;
	}

	.gray-text {
		color: #979797;
	}

	.get-phone-btn {
		background: #FFCC00;
		font-size: 26rpx;
		border-radius: 100px;
		line-height: 50rpx;
		color: white;
		min-width: 100rpx;
		padding: 0rpx 0rpx;
		height: 50rpx;

		&::after {
			display: none;
		}
	}

	.container {
		background: white;
		position: fixed;
		width: 100%;
		height: 100%;

		.headimg-c {
			height: 200rpx;
			background: white;
			text-align: center;
			padding-top: 30rpx;
			box-sizing: border-box;
			
			/* #ifdef H5 */
			display: none;
			/* #endif */

			image {
				width: 150rpx;
				height: 150rpx;
				border-radius: 50%;
			}
		}

		.info-c {
			padding: 0rpx 30rpx;

			.item {
				background: white;
				margin-top: 10rpx;
				display: flex;
				align-items: center;
				padding: 28rpx 8rpx;
				border-bottom: 1px solid #eee;

				.key {
					flex-grow: 1;
					display: inline-block;
					font-weight: 700;
					min-width: 200rpx;
				}

				input,
				.input-text {
					text-align: right;
					font-weight: 400;
					color: #393939;
				}
			}

			.birthday-input {
				.gray-text {
					color: gray;
					font-weight: 400;
				}
			}
		}

		.button-c {
			width: 100%;
			margin: 100rpx auto;

			.submit-btn {
				margin: 0 auto;

				&::after {
					display: none;
				}
			}

		}
	}

	.footer {
		// display: none;
		position: fixed;
		bottom: 0;
		left: 75rpx;
		width: 100%;
		// background-color: #f5f5f5;
		display: flex;
		width: 600rpx;


		.footer-button {
			flex: 1;
			margin: 0 auto;
			margin-bottom: 10rpx;
			// width: 600rpx;
			height: 40rpx;
			line-height: 40rpx;
			text-align: center;
			font-size: 26rpx;
			font-weight: bold;
			// background-color: #ffcc00;
			// border: 1rpx solid #999;
			// box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			// border-radius: 80rpx;
			text-decoration: underline;

			&.delete-btn {
				border-right: 1rpx solid #999;
				// margin-left: 30rpx;
				color: red;
			}
		}
	}
</style>
