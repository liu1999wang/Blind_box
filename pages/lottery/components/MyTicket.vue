<template>
	<view class="mask" @tap="cancel">
		<view class="content-card" @tap.stop>
			<text class="new-iconfont icon-close" @tap.stop="cancel"></text>
			<view class="title">我的抽奖码 <text class="ticket-number">{{info.my_ticket_total}}个</text></view>
			<view class="sub-title">活动当期总抽奖码数 {{info.current_session_lottery_tickets_count}}个</view>

			<view class="status-c">
				<navigator :url="`/pages/lotteryTicket/index?uuid=${uuid}&actived=0`">
					<view class="item">查看抽奖码<text class="number">({{info.my_ticket_total}}张)</text></view>
				</navigator>
				<view class="line"></view>
				<navigator :url="`/pages/lotteryTicket/index?uuid=${uuid}&actived=2`">
					<view class="item">查看助力<text class="number">({{info.my_invitee_total}}人)</text></view>
				</navigator>
			</view>
			<button class="share-btn bg-gray" v-if="info.union_status === 'pendng'">活动暂未开始</button>
			<template v-else-if="info.union_status === 'working'">
				<button class="share-btn bg-orange" open-type="share" v-if="info.is_join">邀请好友助力</button>
				<button class="share-btn bg-orange" @tap="join" v-else>立即参与抽奖</button>
			</template>
			<template v-else-if="info.union_status === 'expired'">
				<button @tap="checkPrize" class="share-btn bg-green" v-if="info.is_lucky_user">恭喜您中奖啦~</button>
				<button class="share-btn bg-gray" v-else-if="!info.is_join">未参与活动~</button>
				<button class="share-btn bg-gray" v-else>这次未中奖哦~</button>
			</template>
			<view class="desc">
				<template v-if="info.union_status === 'expired'">
					<view v-if="info.is_lucky_user">奖品在"个人中心"->"盒柜"仓库中哦~</view>
					<view v-else>运气不够未中奖不要气馁，去下一个活动试试吧~</view>
				</template>
				<view>老用户助力增加{{info.old_user_reward_ticket}}个抽奖码， 新用户助力增加{{info.new_user_reward_ticket}}个抽奖码</view>
				<!-- <view>邀请新用户增加2张签号</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {
			uuid() {
				return this.info.uuid
			}
		},
		watch: {},
		onLoad(e) {},
		created() {},
		methods: {
			checkPrize() {
				uni.navigateTo({
					url: `/pages/lotteryTicket/index?uuid=${this.uuid}&actived=1`
				})
			},
			cancel() {
				this.$emit('cancel')
			},
			join() {
				this.$emit('cancel')
				this.$emit('join')
			}
		},
		onPageScroll(e) {}
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

		.title {
			font-size: 40rpx;
			font-weight: 500;
			text-align: center;
			margin-top: 50rpx;

			.ticket-number {
				color: #370eee;
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
