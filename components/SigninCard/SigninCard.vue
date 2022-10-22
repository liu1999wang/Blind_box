<template>
	<view class="container" v-if="isInit">
		<view class="day-c">
			<view v-for="(item, n) in days" class="item">
				<view class="round" :class="{completed: days[n].is_completed}">
					<text class="new-iconfont icon-right"></text>
				</view>
				<view class="score">+{{days[n].score}}</view>
				<view class="day">第{{days[n].number}}天</view>
			</view>
		</view>
		<view class="signin-btn" hover-class="hover" @tap="signIn" v-if="!isSignIn">签到</view>
		<view class="signin-btn completed" v-else>今天已签到</view>
		<view class="signin-total">累计签到{{signinTotal}}天</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	export default {
		props: {
			refreshCount: {
				type: Number
			}
		},
		computed: {
			...mapGetters(["token"])
		},
		data() {
			return {
				list: [],
				signinTotal: 0,
				isSignIn: false,
				days: [],
				isInit: false
			}
		},
		watch: {
			token() {
				this.initData()
			}
		},
		mounted() {
			this.initData()
		},
		methods: {
			initData() {
				this.$http('/sign-in-card-info').then(res => {
					// let obj = res.data.list
					// this.signInDays = Object.keys(obj).map(item => {
					// 	return {
					// 		'day': item,
					// 		'score': obj[item].score,
					// 		'continuous_days': obj[item].continuous_days
					// 	}
					// })
					this.days = res.data.days
					this.isSignIn = res.data.is_sign_in
					this.signinTotal = res.data.sign_in_total
					this.isInit = true
				})
			},
			signIn() {
				uni.showLoading({
					title: '签到中'
				})
				this.$http('/sign-in', 'POST').then(res => {
					uni.hideLoading()
					uni.showModal({
						title: `连续签到${res.data.continuous_days}天了哦~ ${this.scoreAlias}+${res.data.award_score}`,
						confirmText: '朕知道了'
					})

					this.initData()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background: #FFFFFF;
		border-radius: 20rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;

		box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);

		.day-c {
			display: flex;
			justify-content: space-between;

			.item {
				.round {
					width: 72rpx;
					height: 72rpx;
					background: #F0F0F0;
					border-radius: 50%;

					text-align: center;
					line-height: 72rpx;
					color: gray;

					&.completed {
						background: #FFCC09;
						color: #231815;
					}
				}
			}

			.score,
			.day {
				text-align: center;
				font-size: 20rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #999999;
				line-height: 26rpx;
			}
		}

		.signin-btn {
			margin: 30rpx auto 10rpx auto;
			width: 560rpx;
			height: 74rpx;
			background: #FFCC09;
			border-radius: 38rpx;
			font-size: 28rpx;
			font-family: PingFang SC;
			font-weight: bold;
			color: #FFFFFF;
			text-align: center;
			line-height: 74rpx;

			&.completed {
				background: #2BA246;
				font-size: 26rpx;
			}
		}

		.signin-total {

			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 500;
			color: #999999;
			line-height: 26rpx;
			text-align: center;
		}
	}
</style>
