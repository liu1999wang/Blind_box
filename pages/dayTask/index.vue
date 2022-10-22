<template>
	<view class="container" style="background: url('https://cdn2.hquesoft.com/box/day-task-bg.png'); background-size: 100% auto; background-repeat: no-repeat;">
		<TextNavBar title="每日任务"></TextNavBar>
		<Calendar :isSignIn="isSignIn" :completed="signInDays" @signIn="signIn"></Calendar>
		<view class="tips-c">
			<view class='title'>
				<image src="/static/question.png" class="icon"></image>
				<text class="text">签到说明:</text>
			</view>
			<view class="body">
				<p>
					签到基础奖励为{{config.base_reward}}{{scoreAlias}}。 连续签到奖励比前一天的奖励增加{{config.add_reward}}{{scoreAlias}}，上限为每天奖励{{config.max_reward}}{{scoreAlias}}。
				</p>
				<p>
					如: 第1天签到+{{config.base_reward}}，第2天签到+{{config.base_reward + config.add_reward}}, 第3天签到+{{config.base_reward + config.add_reward*2}}
				</p>
			</view>
		</view>

		<view class="task-title">
			每日任务
		</view>


		<view class="task-list">
			<view class="item">
				<view class="completed-tag" v-if="isSignIn">已完成</view>
				<image class="thumb" src="@/static/dayTask/signin.png"></image>
				<view class="body">
					<view class="text">每日签到</view>
					<view class="bar-c">
						<view class="bar">
							<view class="bar-color" :style="'width: ' + signinProgress + '%'"></view>
						</view>
						<text class="progress">{{signinProgress}}%</text>
					</view>
				</view>
				<button @signIn="signIn" class="btn" v-if="signinProgress != 100">
					签到
				</button>
			</view>

			<view class="item">
				<view class="completed-tag" v-if="shareProgress == 100">已完成</view>
				<image class="thumb" src="@/static/dayTask/share.png"></image>
				<view class="body">
					<view class="text">邀请新用户</view>
					<!-- <view class="bar-c">
						<view class="bar">
							<view class="bar-color" :style="'width: ' + shareProgress + '%'"></view>
						</view>
						<text class="progress">{{shareProgress}}%</text>
					</view> -->
				</view>
				<button class="btn" open-type="share" v-if="shareProgress != 100">
					分享
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import Calendar from "./components/Calendar.vue"
	export default {
		components: {
			Calendar
		},
		data() {
			return {
				isSignIn: 0,
				signInDays: [
				],
				signinTask: {
					total: 1,
					completed_total: 1
				},
				shareTask: {
					total: 1,
					completed_total: 0
				},
				config: {}
			}
		},
		computed: {
			signinProgress ()  {
				return this.isSignIn ? 100 : 0
			},
			shareProgress ()  {
				return this.shareTask.completed_total / this.shareTask.total * 100
			}
		},
		watch: {},
		onLoad(e) {
			this.initData()
			
			this.$visitor.record('day_task');
			
			this.$http('/sign-in/config').then(res => {
				this.config = res.data.info
			})
		},
		onShow() {},
		methods: {
			initData() {
				this.$http('/sign-in-records').then(res => {
					let obj = res.data.list
					this.signInDays = Object.keys(obj).map(item => {
						return {
							'day': item,
							'score': obj[item].score,
							'continuous_days': obj[item].continuous_days
						}
					})
					
					this.isSignIn = res.data.is_sign_in
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
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding-top: 200rpx;
		padding-bottom: 130rpx;

		.tips-c {
			width: 700rpx;
			margin: 0rpx auto;
			background: #FFFFFF;
			box-shadow: 0px 14rpx 30rpx 0px rgba(226, 222, 204, 0.4);
			border-radius: 20rpx;
			padding: 30rpx 30rpx;
			margin-top: 30rpx;
			box-sizing: border-box;

			.title {
				display: flex;
				align-items: center;
				.icon {
					width: 28rpx;
					height: 28rpx;
					margin-right: 6rpx;
				}

				.text {
					font-size: 28rpx;
					font-weight: bold;
					color: #555;
				}
			}

			.body {
				margin-top: 10rpx;
				font-size: 26rpx;
				// font-weight: 500;
				color: #333;
				line-height: 34rpx;
				p {
					margin-bottom: 10rpx;
				}
			}
		}

		.task-title {
			// background: url('@/static/task-list-title.png');
			background-size: auto 50rpx;
			background-repeat: no-repeat;
			background-position: -20rpx;

			font-weight: bold;
			color: #333333;
			font-size: 36rpx;
			padding-top: 40rpx;
			margin: 50rpx 30rpx 0rpx 30rpx;
		}

		.task-list {
			.item {
				width: 700rpx;
				height: 148rpx;
				margin: 20rpx auto 40rpx auto;
				background: #FFFFFF;
				box-shadow: 0px 14rpx 30rpx 0px rgba(226, 222, 204, 0.4);
				border-radius: 16rpx;
				display: flex;
				align-items: center;
				position: relative;
				
				.completed-tag {
					position: absolute;
					right: 0rpx;
					top: 0rpx;
					background: url('@/static/dayTask/down.png');
					width: 140rpx;
					background-size: 140rpx auto;
					background-repeat: no-repeat;
					background-position: right;
					height: 80rpx;
					font-size: 24rpx;
					font-weight: bold;
					text-align: right;
					padding: 12rpx 20rpx;
					box-sizing: border-box;
					color: white;
				}

				.thumb {
					width: 90rpx;
					height: 90rpx;
					margin-right: 20rpx;
					margin-left: 30rpx;
				}

				.body {
					.text {
						font-weight: bold;
						color: #333333;
						font-size: 28rpx;
						margin-bottom: 4rpx;
					}

					.bar-c {
						display: flex;
						align-items: center;
						flex-grow: 1;

						.bar {
							width: 226rpx;
							height: 12rpx;
							background: #F0F0F0;
							border-radius: 6rpx;
							overflow: hidden;

							.bar-color {
								width: 40rpx;
								height: 100rpx;
								background: #FFCC09;
							}
						}

						.progress {
							font-size: 18rpx;
							font-weight: 500;
							color: #999999;
							margin-left: 20rpx;
						}
					}
				}
				
				.btn {
					width: 130rpx;
					height: 54rpx;
					background: #FFCC09;
					border-radius: 26rpx;
					line-height: 54rpx;
					text-align: center;
					padding: 0rpx;
					margin-right: 30rpx;
					font-weight: bold;
					color: #FFFFFF;
					font-size: 28rpx;
					
					&::after {
						display: none;
					}
				}
			}
		}
	}
</style>
