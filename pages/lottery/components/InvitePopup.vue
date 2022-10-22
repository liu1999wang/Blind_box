<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="content-card" @tap.stop>
			<text class="new-iconfont icon-close"  @tap.stop="cancel"></text>
			<view class="user-c">
				<image class="headimg" :src="info.user.headimg" mode="widthFix"></image>
				<view class="name">{{info.user.name}}</view> 
				<view class="suffix">邀你助力</view>
			</view>
			<view class="sub-title">好友抽奖码{{info.user_ticket_total}}个 / 总抽奖码{{info.all_ticket_total}}个</view>

			<!-- <view class="status-c">
				<navigator :url="`/pages/lotteryTicket/index?uuid=${uuid}&actived=0`">
					<view class="item">所有签号</view>
				</navigator>
				<view class="line"></view>
				<navigator :url="`/pages/lotteryTicket/index?uuid=${uuid}&actived=1`">
					<view class="item">我也要抽<text class="number"></text></view>
				</navigator>
			</view> -->
			<button class="share-btn bg-orange" @tap="handleOk" v-if="isAccepted || info.is_accepted">已助力，我也要抽奖</button>
			<button class="share-btn bg-orange" @tap="acceptInvite" v-else>帮他/她助力一次</button>
				<yzm v-if="slideCode" :session_id="session_id[0]" @close="slideCode=false" :inviter_user_uuid="info.user.uuid" :activity_uuid="info.activity.uuid"></yzm>
			<view class="desc">
				<view>老用户助力增加{{info.old_user_reward_ticket}}个抽奖码， 新用户助力增加{{info.new_user_reward_ticket}}个抽奖码</view>
				<!-- <view>邀请新用户增加2张签号</view> -->
				
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		components: {

		},
		data() {
			return {
				isAccepted: 0,
				session_id: [], //会自动生成的
				slideCode:  false,
			}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {
			uuid () {
				return this.info.activity.uuid
			}
		},
		watch: {},
		onLoad(e) {
		},
		created() {},
		methods: {
			cancel() {
				this.$emit('cancel')
			},
			handleOk () {
				this.$emit('cancel')
			},
			acceptInvite () {
				this.slideCode=true
				console.log(1212)
				// uni.showLoading({
				// 	title: '助力中'
				// })
				// this.$http(`/lotteries/${this.uuid}/accept-invite`, 'POST', {
				// 	inviter: this.info.user.uuid
				// }).then(res => {
				// 	this.isAccepted = 1
				// 	uni.hideLoading()
				// 	uni.showToast({
				// 		title: '助力成功~',
				// 		icon: 'none'
				// 	})
				// })
			}
		},
		onPageScroll(e) {},
	}
</script>

<style lang="scss" scoped>
	.content-card {
		position: absolute;
		bottom: 0;
		width: 100%;
		// height: 800rpx;
		background-color: white;
		border-radius: 10rpx 10rpx 0 0;
		display: flex;
		flex-direction: column;
		// align-items: center;

		.icon-close {
			position: absolute;
			right: 20rpx;
			top: 20rpx;

		}

		.user-c {
			font-size: 36rpx;
			font-weight: 500;
			text-align: center;
			margin-top: 50rpx;

			display: flex;
			align-items: center;
			justify-content: center;
			
			.headimg {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}
			.suffix {
				// font-size: 36rpx;
			}
		}

		.sub-title {
			text-align: center;
			color: #888;
			font-size: 26rpx;
			margin-top: 20rpx;
		}


		.share-btn {
			&:after {
				display: none;
			}
			background-color: #370eee!important;
			border-radius: 100rpx;
			width: 600rpx;
			margin-top: 50rpx;
			// margin-bottom: 130rpx;
		}

		.status-c {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 30rpx;

			.item {}

			.line {
				margin: 0rpx 20rpx;
				border-left: 1rpx solid #999;
				height: 30rpx;
				width: 1rpx;
			}

			.number {
				color: #370eee;
			}
		}

		.desc {
			color: #888;
			text-align: center;
			font-size: 26rpx;
			margin-bottom: 130rpx;
			margin-top: 30rpx;
		}
	}
</style>
