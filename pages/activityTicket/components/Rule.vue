<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content animated fadeInDown" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
			<view class="title">邀请活动规则</view>

			<view class="body">
				<ol class="rule-list">
					<li>
						① 用户分享活动给好友，好友点击进入活动页并首次授权登陆后为一个成功邀请。
					</li>
					<li>
						② 被邀者可获得：
						<span class="color-text" v-if="!rule.is_invited_reward_enabled">无奖励</span>
						<SingleRewardDisplay class="color-text" v-else :info="rule.invited_reward"></SingleRewardDisplay>
						。
					</li>
					<li>
						③ 邀请者可获得：
					</li>
					<li>
						<uni-table border v-if="addedRule.length">
							<uni-tr>
								<uni-th align="center">邀请人数</uni-th>
								<uni-th align="center">奖励</uni-th>
							</uni-tr>
							<uni-tr v-for="(item, index) in addedRule">
								<uni-td align="center">{{item.total}}人</uni-td>
								<uni-td align="center">
									<SingleRewardDisplay class="color-text" :info="item.reward"></SingleRewardDisplay>
								</uni-td>
							</uni-tr>
						</uni-table>
					</li>
					<li>
						④ 本活动规则最终解释权归本公司所有。
					</li>

				</ol>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
			}
		},
		props: {
			info: {
				type: Object,
				default: {}
			}
		},
		computed: {
			rule () {
				return this.info.rule || {}
			},
			// 额外奖励
			addedRule () {
				return this.rule.reward_list || []
			}
		},
		watch: {},
		created() {
		},
		methods: {
			cancel() {
				this.$emit('cancel')
			},
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.mask {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.color-text {
		color: #E63111;
	}
	
	.no-added-reward {
		text-align: center;
		color: gray;
		line-height: 60rpx;
		font-size: 28rpx;
	}

	.mask-content {
		width: 660rpx;
		// height: 680rpx;
		background-color: #FFE171;
		// background: white;
		// background-color: white;
		border-radius: 20rpx;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 60rpx 0rpx 0rpx 0rpx;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;

		.close-btn {
			position: absolute;
			right: 26rpx;
			top: 26rpx;

			color: #333;
		}

		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			color: #333;
			letter-spacing: 6rpx;
			margin-bottom: 50rpx;
			position: relative;
			// background: #DB5B4E;
			// padding: 60rpx 0rpx 30rpx 0rpx;
			// padding: 0rpx 40rpx 0rpx 40rpx;

			&:after,
			&:before {
				position: absolute;
				top: 50%;
				background: #333;
				content: "";
				height: 1px;
				width: 50rpx;
			}

			/*调整背景横线的左右距离*/
			&:before {
				left: 140rpx;
			}

			&:after {
				right: 140rpx;
			}
		}

		.body {
			background: white;
			padding: 50rpx 50rpx 100rpx 50rpx;
			ol {
				padding-left: 0rpx !important;
				list-style-type:lower-alpha;
				
			}
			li {
				margin-left: 0rpx !important;
				text-align: justify;
				font-size: 30rpx;
				// font-weight: 500;
			
				margin-top: 16rpx;
				// color: #888;
			}
		}
	}
</style>
