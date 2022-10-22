<template>
	<view class="container" :style="'background-size: 100% auto; background-repeat: no-repeat; background-image: url(' + bgImage + ');'">
		
		<!-- 规则 -->
		<navigator url="/pages/rule/index?type=zhuli">
			<view class="float-btn rule global-shadow" hover-class="hover">
				<image mode="aspectFill" src="@/static/smallBox/rule.png"></image>
				<text>规则</text>
			</view>
		</navigator>
		
		<!-- 分享 -->
		<!-- <view class="float-btn share global-shadow" hover-class="hover" @tap="isSharePopup = true">
			<text class="new-iconfont icon-wechat"></text>
			<text>分享</text>
		</view> -->
		
		<view class="card">
			<view class="sku-c">
				<image mode="widthFix" :src="sku.thumb" class="thumb"></image>
				<view class="right">
					<view class="title">{{sku.title}}</view>
					<view class="stock">剩{{sku.stock}}份 / 共{{sku.stock + sku.sales}}份</view>
				</view>
			</view>
			<template v-if="!launchRecord.id">
				<!-- 无助力记录 -->
				<view class="title-2">快来助力吧，奖品先到先得~</view>
				<!-- <view class="title-2">{{info.time_limit}}小时内集齐{{info.need_user_total}}个助力即可获得奖品</view> -->
			</template>
			<template v-else>
				<!-- 有助力记录 -->
				<view class="user-c">
					<image :src="launchRecord.user.headimg" class="headimg" mode="widthFix"></image>
					<view class="right">
						<view class="name">{{launchRecord.user.name}}发起的助力</view>
						<view class="time">{{$tool.formatDate(launchRecord.launched_at, 'MM-dd hh:mm')}}</view>
					</view>
				</view>
				<view class="status-c">
					<view v-if="launchRecord.union_status === 'working'">还差{{launchRecord.still_need_support_total}}个助力</view>
					<view class="closed" v-else-if="launchRecord.union_status === 'closed'">已失效</view>
					<view class="completed" v-else-if="launchRecord.union_status === 'completed'">已完成</view>
				</view>
				<view class="count-down" v-if="launchRecord.union_status === 'working'">
					<CountDown :start="launchRecord.end_at" theme="zhuli"></CountDown>
				</view>
			</template>
			
			<template v-if="launchRecord.id">
				<!-- 有助力记录 -->
				<template v-if="!launchRecord.is_author">
					<!-- 不是此记录的发起者 -->
					<template v-if="!launchRecord.is_supporter">
						<!-- 未给此记录助力过 -->
						<button class="launch-btn bg-red" v-if="launchRecord.union_status === 'working'" @tap="disableMultiClick(createSupport)">
							帮他/她助力
						</button>
						<button class="launch-btn bg-red" v-else @tap="disableMultiClick(launchActivity)">
							发起助力
						</button>
					</template>
					<button v-else-if="info.union_status === 'working'" class="launch-btn bg-red" @tap="disableMultiClick(launchActivity)">
						已助力，我也要发起助力
					</button>
					<button v-else class="launch-btn bg-gray">
						活动已结束
					</button>
				</template>
				<template v-else>
					<!-- 是此记录的发起者 -->
					<button class="launch-btn bg-red" @tap="disableMultiClick(sharePage)">
						转发给朋友
					</button>
				</template>
			</template>
			<template v-else>
				<button class="launch-btn bg-red" @tap="disableMultiClick(launchActivity)">
					发起助力
				</button>
			</template>
			
			<view class="rule-desc" v-if="info.score_price">
				支付<span style="color:red;">{{info.score_price}}{{scoreAlias}}</span>可发起助力
			</view>
			
			<!-- <view class="rule-desc">
				<span>需在{{info.time_limit}}小时内集齐{{info.need_user_total}}个助力</span>
			</view> -->
			<view class="tips">
				<text class="new-iconfont icon-tips"></text>
				<span>需在{{info.time_limit}}小时内集齐{{info.need_user_total}}个助力</span>
				<span class="my-record-link" @tap="checkMyRecord">我的记录</span>
				<!-- <span>奖品先到先得</span> -->
			</view>
			<view class="text-btn-c">
				<span class="text-btn launch-limit" @tap="checkLaunchUserGroup" v-if="info.launch_user_group_id">查看发起条件</span>
				<span class="text-btn support-limit second" @tap="checkSupportUserGroup" v-if="info.support_user_group_id">查看助力条件</span>
			</view>
			
			<view class="bottom">
				<view class="left">
					助力<br/>记录
				</view>
				<view class="right">
					<image v-for="(item, index) in userList" :src="item.headimg" mode="widthFix" class="headimg"></image>
				</view>
			</view>
		</view>
		<PageRender v-if="info.page" :fullPageMode="false" :page="info.page"></PageRender>
		
		<MyRecordList @select="selectLaunchRecord" :info="info" @close="isShowMyRecordList = false" v-if="isShowMyRecordList"></MyRecordList>
		
		<!-- 人群条件检测 -->
		<UserGroupCheck v-if="isShowUserGroupCheck" @close="isShowUserGroupCheck = false" :title="userGroupTitle" :userGroupId="userGroupId"></UserGroupCheck>
		
		<!-- 分享弹窗 -->
		<SharePopup v-if="isSharePopup" @close="isSharePopup = false" :info="posterInfo"></SharePopup>
		
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	
	import MyRecordList from "./components/MyRecordList"
	
	export default {
		components: {
			MyRecordList
		},
		data() {
			return {
				isInit: false,
				uuid: '',
				isNotFound: false,
				info: {},
				launchUuid: '',
				launchRecord: {},
				isSharePopup: false,
				isShowUserGroupCheck: false,
				userGroupId: '',
				userGroupTitle: '',
				isShowMyRecordList: false
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			share() {
				let title = this.info.title
				if (this.launchRecord.user) {
					title = this.launchRecord.user.name + '邀请您来助力~'
				}
				return {
					path: '/pages/zhuli/detail?uuid=' + this.info.uuid + '&invite_node=zhuli-' + this.info.uuid + '&launchRecordUuid=' + this.launchUuid,
					title: title,
					thumb: this.info.thumb
				}
			},
			bgImage () {
				return 'https://cdn2.hquesoft.com/box/zhuli/bg.png'
			},
			sku () {
				return this.info.skus && this.info.skus[0] || {}
			},
			userList () {
				let arr = []
				let defaultUser = {
					headimg: 'https://cdn2.hquesoft.com/box/default-headimg'
				}
				for (let i=0; i<this.info.need_user_total; i++) {
					
					let obj = this.launchRecord.support_records 
								&& this.launchRecord.support_records[i]
								&& this.launchRecord.support_records[i].user 
								|| defaultUser
					arr.push(obj)
				}
				
				return arr
			},
			posterInfo() {
				let globalShareConfig = this.getShareConfig(false)
				
				let title =  '快来帮我助力赢礼品吧~'
				if (this.launchRecord.user) {
					title = this.launchRecord.user.name + '邀请您来助力~'
				}
				
				return {
					title: title,
					path: this.getShareConfig().path,
					thumb: this.info.thumb,
					app_url: globalShareConfig.app_url,
				}
			},
		},
		watch: {
		},
		onLoad(e) {
			this.uuid = e.uuid
			this.launchUuid = e.launchRecordUuid

			uni.showLoading({
				title: '加载中'
			})
			this.initData().then(res => {
				this.isInit = true
				uni.hideLoading()
			}).catch(res => {
				if (res.statusCode == 404) {
					this.isNotFound = true
				}
			})
		},
		onShow() {
			if (this.isInit) {
				this.initData().then(res => {
					this.isInit = true
				}).catch(res => {
					if (res.statusCode == 404) {
						this.isNotFound = true
					}
				})
			}
		},
		methods: {
			selectLaunchRecord(item) {
				this.launchUuid = item.uuid
				this.isShowMyRecordList = false
				this.$http('/zhuli/launch-records/' + this.launchUuid).then(res => {
					this.launchRecord = res.data.info
				})
			},
			checkMyRecord () {
				this.isShowMyRecordList = true
			},
			checkLaunchUserGroup () {
					this.userGroupTitle = '发起助力'
					this.userGroupId = this.info.launch_user_group_id
					this.isShowUserGroupCheck = true
			},
			checkSupportUserGroup () {
					this.userGroupTitle = '给他人助力'
					this.userGroupId = this.info.support_user_group_id
					this.isShowUserGroupCheck = true
			},
			sharePage () {
				this.isSharePopup = true
			},
			initData() {
				
				if (this.launchUuid) {
					this.$http('/zhuli/launch-records/' + this.launchUuid).then(res => {
						this.launchRecord = res.data.info
					})
				}
				
				return this.$http(`/zhuli/activities/${this.uuid}`).then(res => {
					this.info = res.data.info
					
					this.prizeList = this.info.skus.map(item => {
						return {
							prizeId: item.id,
							prizeName: item.title,
							prizeStock: item.stock,
							prizeWeight: item.id,
							prizeImage: item.thumb + '?x-oss-process=image/resize,w_200',
						}
					})
					
					uni.setNavigationBarTitle({
						title: res.data.info.title
					})
				})
			},
			launchActivity () {
				let title = '发起助力'
				if (this.info.score_price) {
					title = '支付' + this.info.score_price + this.scoreAlias + '发起助力'
				}
				uni.showModal({
					title: title,
					content: '发起后需要在' + this.info.time_limit + '小时内集齐' + this.info.need_user_total + '助力才算完成哦~',
					confirmText: '立即发起',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '加载中~'
							})
							this.$http('/zhuli/launch-records', 'POST', {
								activity_id: this.info.id
							}).then(res => {
								uni.hideLoading()
								
								this.launchUuid = res.data.uuid
								this.initData()
							})
						}
					}
				})
			},
			createSupport () {
				uni.showLoading({
					title: '助力中~'
				})
				
				this.$http('/zhuli/support-records', 'POST', {
					launch_record_id: this.launchRecord.id
				}).then(res => {
					uni.hideLoading()
					this.initData()
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	button {
		&::after {
			display: none;
		}
		
		&::before {
			display: none;
		}
	}
	
	
	.float-btn {
		position: fixed;
		right: 0rpx;
		top: 260rpx;
		width: 120rpx;
		height: 66rpx;
		background: #FFEFB3;
		border-radius: 33px 0px 0px 33px;
		padding: 0rpx 14rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-around;
		z-index: 1000;
	
		font-weight: 500;
		font-size: 24rpx;
	
		image {
			width: 30rpx;
			height: 36rpx;
		}
	
		&.my {
			top: 350rpx;
	
			image {
				width: 30rpx;
				height: 40rpx;
			}
		}
	
		&.share {
			top: 400rpx;
	
			.icon-wechat {
				font-size: 40rpx;
			}
		}
	}
	
	.container {
		// background: red;
		padding-top: 20rpx;
		.card {
			background: white;
			margin: 20rpx 20rpx 50rpx 20rpx;
			border-radius: 10rpx;
			padding: 30rpx 30rpx 0rpx 30rpx;
			box-sizing: border-box;
			overflow: hidden;
			.sku-c {
				background: #F1F2F2;
				display: flex;
				align-items: center;
				padding: 30rpx 50rpx;
				box-sizing: border-box;
				border-radius: 10rpx;
				.thumb {
					width: 110rpx;
					height: 110rpx;
					border-radius: 6rpx;
				}
				.right {
					margin-left: 30rpx;
				}
				.title {
					color: #F08F34;
					font-weight: 500;
				}
				.stock {
					font-size: 28rpx;
					margin-top: 10rpx;
				}
			}
			
			.user-c {
				margin-top: 50rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				.headimg {
					width: 80rpx;
					height: 80rpx;
					border-radius: 50%;
				}
				
				.right {
					margin-left: 20rpx;
					.name {
						font-size: 28rpx;
						font-weight: 500;
					}
					.time {
						font-size: 24rpx;
					}
				}
			}
			
			.count-down {
				text-align: center;
				margin-top: 30rpx;
			}
			
			.title-2 {
				color: #150402;
				font-size: 120%;
				font-weight: 500;
				text-align: center;
				margin-top: 50rpx;
			}
			
			.status-c {
				text-align: center;
				margin-top: 30rpx;
				
				.closed {
					color: red;
				}
				.completed {
					color: green;
				}
			}
			
			.launch-btn {
				border-radius: 30rpx;
				margin: 50rpx 30rpx 20rpx 30rpx;
			}
			
			.rule-desc {
				font-size: 80%;
				text-align: center;
				margin-top: 20rpx;
			}
			
			.text-btn-c {
				font-size: 80%;
				text-align: center;
				margin-top: 20rpx;
				margin-bottom: 30rpx;
				.text-btn {
					text-decoration: underline;

					&.second {
						margin-left: 30rpx;
					}
				}
			}
			
			.tips {
				font-size: 80%;
				text-align: center;
				margin-top: 20rpx;
				.icon-tips {
					margin-right: 6rpx;
				}
				
				.my-record-link {
					margin-left: 10rpx;
					text-decoration: underline;
					
				}
			}
			
			.bottom {
				background: #EAEAEA;
				display: flex;
				padding: 20rpx 20rpx;
				align-items: center;
				margin: 50rpx -30rpx 0rpx -30rpx;
				.left {
					flex: 0 0 80rpx;
					width: 50rpx;
					margin-right: 20rpx;
					// border: 1px solid red;
					text-align: center;
					border-right: 2rpx solid #e1e1e1;
				}
				.right {
					// display: flex;
					// flex-wrap: wrap;
					// justify-content: space-around;
					.headimg {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
						margin-top: 10rpx;
						margin-left: 28rpx;
					}
				}
			}
		}
	}
	
</style>
