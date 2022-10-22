<template>
	<view class="container" v-if="!loading">
		<!-- <NavigationBar transparent :scroll-top="scrollTop" title="商品详情" textStyle="white"></NavigationBar> -->
		
		<image mode="aspectFill" v-if="product.image_tag" :src="product.image_tag.image" class="image-tag"></image>
		
		<SwiperImages :images="images"></SwiperImages>

		<div class="header-option-c">
			<!-- 预售 -->
			<template v-if="product.is_presell">
				<view class="presell-c" v-if="product.presell_mode === 0">
					<view class="left">
						<view>{{$tool.formatDate(product.presell_date, 'MM-dd hh:mm')}} 正式开售</view>
					</view>
					<view class="right">
						<view class="btn cover-btn" data-type='chip_cover' @tap="handleAddSaleNotify"
							v-if="!product.is_subscribed">
							<text>开售通知</text>
						</view>
						<view class="btn cover-btn completed" data-type='chip_cover' v-else>
							<text>已约提醒</text>
						</view>
					</view>
				</view>
				<view class="presell-c" v-else-if="product.presell_mode === 1">
					<view class="left">
						<view>购买后 {{$tool.formatDate(product.presell_date, 'yyyy-MM-dd')}} 开始发货</view>
					</view>
					<!-- <view class="right">
						<view class="btn cover-btn" data-type='chip_cover' @tap="handleAddSaleNotify"
							v-if="!product.is_subscribed">
							<text>开售通知</text>
						</view>
						<view class="btn cover-btn completed" data-type='chip_cover' v-else>
							<text>已约提醒</text>
						</view>
					</view> -->
				</view>
			</template>
			<!-- 非预售 -->
			<template v-else>
				<view class="chip-cover-c" v-if="product.cover_chip_status && product.cover_chip && product.cover_chip.chip">
					<view class="left">
						<view>使用{{product.cover_chip.chip.title}}*{{product.cover_chip.total}}兑换</view>
					</view>
					<view class="right">
						<view class="btn cover-btn" data-type='chip_cover' @tap="handleAction">
							<text>立即兑换</text>
						</view>
					</view>
				</view>
			</template>
		</div>

		<view class="content-wrap" style="padding: 0 24rpx;">

			<!-- <div class="header-option-c">
				<view class="chip-cover-c" v-if="product.cover_chip_status">
					<view class="left">
						<view>使用{{product.cover_chip.chip.title}}*{{product.cover_chip.total}}兑换</view>
					</view>
					<view class="right">
						<view class="btn cover-btn" data-type='chip_cover' @tap="handleAction">
							<text>立即兑换</text>
						</view>
					</view>
				</view>
			</div> -->

			<!-- 秒杀活动 -->
			<view class="activity-header-c" v-if="product.seckill">
				<view class="left">
					<!-- <view class="s-title">
						{{product.activity.title}}
						<text class="activity-stock">仅剩{{product.activity.stock}}件</text>
					</view> -->
					<view class=".price-scope-c">
						<view class="price">
							<PriceDisplay :info="product.seckill"></PriceDisplay>
						</view>
						<text class="line-price-key">原价</text>
						<view class="line-price-c">
							<PriceDisplay :info="product"></PriceDisplay>
						</view>

						<!-- <text class="activity-stock">仅剩{{product.activity.stock}}件</text> -->
					</view>
					<view class="s-title">
						{{product.seckill.title}}
						<text class="activity-stock">仅剩{{product.seckill.stock}}件</text>
					</view>
				</view>
				<view class="right">
					<view class="s-title" v-if="product.seckill.status === 'pending'">距优惠开始</view>
					<view class="s-title" v-else-if="product.seckill.status === 'working'">距优惠结束</view>
					<view class="s-title" v-else="product.seckill.status === 'expired'">距优惠结束</view>
					<view>
						<CountDown class="count-down" theme="product_detail_theme_1" :start="product.seckill.start_at"
							:end="product.seckill.end_at"></CountDown>
					</view>
				</view>
			</view>
			<view class="price-c" v-else>
				<view class="main">
					<PriceDisplay :info="product"></PriceDisplay>
				</view>

				<view class="arrow-right gray">
					<text v-if="product.carriage_type === 2">运费到付</text>
					<!-- <text>已售10万+件</text> -->
				</view>
			</view>


			<!-- 标题栏 -->
			<view class="title-c">
				<view class="body">
					<view>{{product && product.title}}</view>
					<view class="tag-list">
						<view v-for="(item, index) in product.tags || []" :key="index" class="item">{{item}}</view>
					</view>
				</view>
				
				<!-- #ifdef MP-WEIXIN || APP-PLUS -->
				<button class="share-btn" @tap="isSharePopup = true">
					<image src="@/static/share.png" class="icon" />
					<!-- <text class="new-iconfont icon-share"></text> -->
					<text class="text">分享</text>
				</button>
				<!-- #endif -->
				
			</view>

			<!-- 人群价 -->
			<view class="group-price-c" v-if="product.group_prices && product.group_prices.length">
				<View class="item" v-for="(item, index) in product.group_prices" @tap="showGroupPrice(item)">
					<view class="tag">专享价</view>
					<view class="text">{{item.title}}</view>
					<PriceDisplay class="price-c" :info="item"></PriceDisplay>
					<!-- <view class="price-c">
						<PriceDisplay :info="item"></PriceDisplay>
					</view> -->
					<!-- <text class="new-iconfont icon-arrow-right"></text> -->
				</View>
			</view>
			
			<!-- 下订赠送 -->
			<view class="order-reward-c" v-if="isShowReward" @tap="showOrderReward()">
				<View class="item">
					<view class="tag">下单赠送</view>
					<view class="text">{{item && item.title}}</view>
					<view>支付成功即送礼包</view>
					<!-- <PriceDisplay class="price-c" :info="item"></PriceDisplay> -->
					<!-- <view class="price-c">
						<PriceDisplay :info="item"></PriceDisplay>
					</view> -->
					<!-- <text class="new-iconfont icon-arrow-right"></text> -->
				</View>
			</view>

			<!-- 拼团活动， 未上线 -->
			<view class="groupon padding-h" v-if="product.groupon">
				<view class="status-tips">
					<text v-if="grouponStatus == 0">离开始还有</text>
					<text v-if="grouponStatus == 1">活动剩余</text>
					<text v-if="grouponStatus == 2">活动已结束</text>
				</view>
				<CountDown :start="product.groupon.start_at" :end="product.groupon.end_at"
					@statusChange="grouponStatusChange"></CountDown>
			</view>
			<navigator class="service list-item border-top padding-h" url="/pages/grouponRules/index"
				hover-class="hover" v-if="product.groupon">
				<view class="body black">
					{{product.groupon.need_member}}人成团
				</view>
				<view class="arrow-right">
					<!-- <text>可点击下方参团或自动开团哦</text> -->
					<text>快点击下方开团吧~</text>
					<text class="al-icon-enter gray"></text>
				</view>
			</navigator>

			<!-- <view class="tag-c">
				<view class="body">
					包邮 • 正品保障 • 送礼佳品
				</view>
				<view class="new-iconfont icon-enter gray"></view>
			</view> -->

			<template v-if="false">
				<SplitLine></SplitLine>
				<view class="groupping-wrap" v-if="product.groupon">
					<view class="list-item border-bottom padding-h">
						<view class="body">
							14人在拼单，可直接参与
						</view>
						<view class="arrow-right gray">
							<text>查看更多</text>
							<text class="al-icon-enter"></text>
						</view>
					</view>
					<view class="groupping-content">
						<swiper autoplay :interval="3000" :duration="500" vertical circular>
							<swiper-item>
								<view class="list padding-h">
									<view class="list-item border-bottom" v-for="(item,index) in 2" :key="item">
										<view class="body">
											<view class="user">
												<i-avatar headimg="/static/logo.png" size="small"></i-avatar>
												<text>夏雪</text>
											</view>
											<view class="residue">
												<view class="sub-people">还差1人拼成</view>
												<view class="time">
													剩余22:40:22
												</view>
											</view>
										</view>
										<view class="btn bg-red">
											去拼单
										</view>
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
				<SplitLine></SplitLine>
			</template>

			<view class="detail-c">
				<view class="product-detail-title">
					商品详情
				</view>
				
				<PageRender :page="product.ext.page" :fullPageMode="false" theme="default"></PageRender>
				
				<!-- <view class="product-detail-content" v-if="product.ext&&product.ext.page&&product.ext.page.modules">
					<ProductDetail :source="product.ext.page.modules"></ProductDetail>
				</view> -->
			</view>
		</view>

		<view style="height:160rpx;"></view>

		<view class="footer-actions safe-area-bottom" v-if="mode != 'view'">
			<!-- #ifdef MP-WEIXIN || APP-PLUS || H5 -->
			<button class="action-item" open-type="contact" v-if="isMiniappAndUseMiniappKf">
				<view class="icon new-iconfont icon-contact"></view>
				<text>客服</text>
			</button>
			<button class="action-item" v-else @tap="openContact">
				<view class="icon new-iconfont icon-contact"></view>
				<text>客服</text>
			</button>
			<!-- #endif -->
			<navigator class="action-item" hover-class="hover" url="/pages/cart/index">
				<view class="icon new-iconfont icon-cart"></view>
				<text>购物车</text>
			</navigator>
			<!-- 商品置换 -->
			<template v-if="mode==='exchange'">
				<view class="btn btn-full buy-now bg-orange" data-type='exchange' @tap="handleAction">
					<text>置换此商品</text>
				</view>
			</template>
			<template v-else-if="product.is_presell && product.presell_mode === 0">
				<view class="btn btn-full buy-now bg-orange" data-type='buynow' @tap="showPresellTips">
					<view>
						<CountDown theme="product_detail_theme_1" :start="product.presell_date" @change="presellStart">
						</CountDown> 后开售
					</view>
				</view>
			</template>
			<template v-else-if="product.groupon">
				<view class="btn buy-now bg-yellow" data-type='buynow' @tap="handleAction">
					<text>单独购买</text>
				</view>
				<view class="btn buy-group bg-red" data-type='groupon' @tap="handleAction" v-if="grouponStatus===1">
					<text>我要开团</text>
				</view>
				<view class="btn buy-group bg-gray" v-else>
					<text>我要开团</text>
				</view>
			</template>
			<template v-else-if="product.seckill && product.seckill.status == 'working'">
				
				<view class="btn btn-full buy-now bg-orange" data-type='buynow' @tap="handleSeckillBuy">
					<text>立即秒杀(仅剩{{product.seckill.stock}}件)</text>
				</view>
				
			</template>
			<template v-else-if="product.stock === 0">
				<view class="btn btn-full btn-empty-stock disabled bg-gray" data-type='buynow'>
					<text>已售罄</text>
				</view>
			</template>
			<template v-else>
				<view class="btn add-cart" data-type='addcart' @tap="handleAction">
					<text>加入购物车</text>
				</view>
				<view class="btn buy-now bg-orange" data-type='buynow' @tap="handleAction">
					<text>立即购买</text>
				</view>
			</template>
		</view>
		<view class="skus-wrapper mask" v-if="skusVisible" @tap="skusVisibleChange">
			<view class="skus-content" @tap.stop>
				<view class="sku-info">
					<image class="thumb" :src="currentSku.thumb || product.thumb" mode="aspectFill"
						@tap="previewImage(currentSku.thumb)"></image>
					<view class="info-detail">
						<view class="price-c red">
							<!-- 使用专享价 -->
							<template v-if="useGroupPrice && useGroupPrice.id">
								<PriceDisplay :info="useGroupPrice" v-if="useGroupPrice && useGroupPrice.id"></PriceDisplay>
								<view class="group-price-tag">{{useGroupPrice.title}}</view>
							</template>
							<span v-else-if="actionType == 'chip_cover' && currentSku.cover_chip_status">{{currentSku.chip.title}}*{{currentSku.cover_chip_total}}兑换</span>
							<template v-else>
								<!-- 置换模式 -->
								<view v-if="mode==='exchange'" class="exchange-price-c">
									<PriceDisplay :info="currentSku" class="origin-price"></PriceDisplay>
									<text class="text">补差价</text>
									<PriceDisplay :info="currentSku" prefix="pay_" class="exchange-price"></PriceDisplay>
								</view>
								<PriceDisplay :info="currentSku" v-else></PriceDisplay>
							</template>
						</view>
						<view class="stock">
							剩余{{currentSku.stock}}件
						</view>
						<view class="info-attrs">
							已选:{{currentSku.attrs | productAttrsToString}}
						</view>
					</view>
				</view>
				<view class="skus-list">
					<view class="skus-item" v-for="(sku, index) in skusAttrs" :key="index">
						<view class="skus-title">
							{{sku.key || '款式'}}
						</view>
						<view class="skus-values">
							<text class="item" :class="{ actived: currentSkuAttrs[index]===value }"
								v-for="(value, idx) in sku.value" :key="idx" :data-index="index" :data-value="value"
								@tap="currentSkuAttrsChange">{{value}}</text>
						</view>
					</view>
				</view>
				<view class="buycount">
					<text>购买数量</text>
					<IInputNumber :value="buyCount" @change="buyCountChange" size="small"></IInputNumber>
				</view>
				<view class="close-btn" @tap="hideSkuContainer">
					<view class="new-iconfont icon-close"></view>
				</view>
			</view>
			<view class="action-btn safe-area-bottom" @tap.stop>
				<view class="btn add-cart bg-gray" hover-class="hover" v-if="currentSku.status === 0">
					此款已下架
				</view>
				<view class="btn add-cart" hover-class="hover" @click="handleAddcart" v-else-if="actionType === 'addcart'">
					加入购物车
				</view>
				<view class="btn buynow" hover-class="hover" @click="handleBuynow" v-else-if="actionType === 'buynow'">
					<view class="btn add-cart bg-gray" hover-class="hover" v-if="currentSku.stock === 0">
						此款已售罄
					</view>
					<template v-else-if="useGroupPrice">专享价购买</template>
					<template v-else>立即购买</template>
				</view>
				<template v-else-if="actionType === 'chip_cover'">
					<view class="btn buynow" hover-class="hover" @click="handleChipCover"
						v-if="currentSku.cover_chip_status">
						立即兑换
					</view>
					<view class="btn buynow bg-gray" hover-class="hover" v-else>
						此款暂不支持兑换
					</view>
				</template>
				<view class="btn add-cart" hover-class="hover" @click="handleExchangeSubmit" v-else-if="actionType === 'exchange'">
					确认置换
				</view>
				<view class="btn groupon" hover-class="hover" @click="handleBuyByGroupon" v-else>
					发起团购
				</view>
			</view>
		</view>
		
		<!-- 分享弹窗 -->
		<SharePopup v-if="isSharePopup" @close="isSharePopup = false" :info="posterInfo"></SharePopup>
		
		<!-- 人群价条件检测 -->
		<GroupPriceCheck v-if="isShowUserGroupCheck" @buy="buyWithGroupPrice" @cancel="isShowUserGroupCheck = false" :groupPriceUuid="currentGroupPriceUuid"></GroupPriceCheck>
		
		<!-- 秒杀价条件检测 -->
		<SeckillPriceCheck v-if="isShowSeckillPriceCheck" @buy="buyWithSeckill" @cancel="isShowSeckillPriceCheck = false" :seckillUuid="product.seckill.uuid"></SeckillPriceCheck>
		
		<!-- 下单奖励 -->
		<OrderReward v-if="isShowOrderReward" :info="product.order_reward" @cancel="isShowOrderReward = false"></OrderReward>
		
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	import SwiperImages from "./components/SwiperImages"
	// import NavigationBar from "@/components/NavigationBar/index.vue"
	import ProductDetail from "./components/ProductDetail.vue"
	import IInputNumber from "@/components/InputNumber/index.vue"
	import SplitLine from "@/components/SplitLine/index.vue"

	export default {
		components: {
			SwiperImages,
			// NavigationBar,
			ProductDetail,
			IInputNumber,
			SplitLine
		},
		data() {
			return {
				grouponRecordId: null,
				loading: true,
				actionType: "buynow", // buynow立即购买，addcart加入购物车
				uuid: "",
				product: {},
				mode: '',
				skusVisible: false,
				currentSkuAttrs: {},
				buyCount: 1,
				scrollTop: 0,
				grouponStatus: 0,
				isShowTitle: false,
				chipAssetList: [],
				isSharePopup: false,
				currentGroupPriceUuid: "",
				useGroupPrice: null,
				isShowUserGroupCheck: false,
				isShowOrderReward: false,
				seckillId: '',
				isShowSeckillPriceCheck: false
			}
		},
		computed: {
			...mapGetters(['token']),
			isShowReward () {
				let asset = this.product.order_reward || {}
				
				return asset.is_score || asset.is_level_score || asset.is_redpack || asset.is_show_box_card || asset.is_exclude_box_card
			},
			skus() {
				return this.product.skus || []
			},
			images() {
				return this.product.ext && this.product.ext.images || [this.product.thumb]
			},
			skusAttrs() {
				let attrs = this.product.ext && this.product.ext.sku_attrs || []
				let current = {}
				attrs.forEach((item, index) => {
					current[index] = item.value[0]
				})
				// eslint-disable-next-line
				this.currentSkuAttrs = current
				return attrs
			},
			currentSku() {
				let skus = this.skus
				// if (this.product.groupon && this.actionType === 'groupon') {
				// 	skus = this.product.groupon.skus
				// } else {
				// 	skus = this.product.skus || []
				// }
				let thumb = ""
				for (let i = 0; i < skus.length; i++) {
					let str1 = ""
					let str2 = ""
					skus[i].attrs.forEach((value, idx) => {
						str1 = str1 + value.value + '_'
						str2 = str2 + this.currentSkuAttrs[idx] + '_'
					})
					if (str1 === str2) {
						// eslint-disable-next-line
						return skus[i]
					}
				}
				return {}
			},
			posterInfo() {
				let globalShareConfig = this.getShareConfig(false)
				
				return {
					money_price: this.product.money_price,
					score_price: this.product.score_price,
					title: this.product.title,
					path: this.getShareConfig().path,
					thumb: this.product.thumb,
					app_url: globalShareConfig.app_url,
				}
			},
			share() {
				return {
					title: this.product.title,
					thumb: this.product.thumb
				}
			}
		},
		filters: {
			priceToFixed(value) {
				return value && (value / 100).toFixed(2)
			},
			productAttrsToString(attrs = []) {
				let arr = []
				attrs.forEach(item => {
					arr.push(item.value)
				})
				return arr.join("/")
			}
		},
		onLoad(e) {
			this.uuid = e.uuid
			this.mode = e.mode
			this.seckillId = e.seckillId || ''

			this.initData()
		},
		onShow() {
			// this.$http('/chip-assets').then(res => {
			// 	this.chipAssetList = res.data.list
			// })
		},
		methods: {
			// 开始置换
			handleExchange () {
				this.handleBuynow()
			},
			// 开始秒杀
			handleSeckillBuy () {
				if (this.product.seckill.user_group_id)  {
					this.isShowSeckillPriceCheck = true  
				}
				else {
					this.buyWithSeckill()
				}
			},
			buyWithSeckill () {
				this.isShowSeckillPriceCheck = false
				this.skusVisibleChange()
			},
			buyWithGroupPrice(obj) {
				// console.log('buy with group price  ====>', obj)
				this.isShowUserGroupCheck = false
				
				this.useGroupPrice = this.product.group_prices.find((item) => {
					return item.id === obj.id
				})
				
				// this.handleBuynow()
				
				this.skusVisibleChange()
			},
			showGroupPrice(item) {
				this.currentGroupPriceUuid = item.uuid
				this.isShowUserGroupCheck = true
			},
			showOrderReward() {
				// this.currentGroupPriceUuid = item.uuid
				this.isShowOrderReward = true
			},
			presellStart() {
				this.initData()
			},
			initData() {
				this.getProductInfo().then(res => {
					this.$visitor.record({
						type: 'product_detail',
						title: this.product.title,
						uuid: this.product.uuid
					})
				})
			},
			handleAddSaleNotify() {
				uni.requestSubscribeMessage({
					tmplIds: [
						this.miniappSubscribeIds.presell_start, // 开售通知
					],
					success: (res) => {
						this.$http('/subscribe', 'POST', {
							target_uuid: this.product.uuid,
							app_type: 1,
							message_type: 'presell_start'
						}).then(res => {
							this.product.is_subscribed = 1
						})
					},
					fail: (e) => {
						console.log(e)
					}
				})
			},
			previewImage(url) {
				uni.previewImage({
					urls: [url]
				})
			},
			hideSkuContainer() {
				this.grouponRecordId = null
				this.skusVisibleChange()
			},
			skusVisibleChange() {
				
				this.skusVisible = !this.skusVisible
				
				if (!this.skusVisible) {
					this.useGroupPrice = null
				}
			},
			handleAddcart() {
				if (this.token) {
					uni.showToast({
						title: "已加入购物车",
						icon: 'none'
					})

					this.$api.emit('product.cart.store', {
						sku_id: this.currentSku.id,
						total: this.buyCount
					})

				} else {
					uni.navigateTo({
						url: '/pages/login/index'
					})
				}
			},
			handleAction(e) {
				this.actionType = e.currentTarget.dataset.type
				if (this.actionType) {
					this.skusVisibleChange()
				}
			},
			buyCountChange(e) {
				this.buyCount = e;
			},
			handleBuynow() {
				if (!this.currentSku.stock || !this.currentSku.status) {
					uni.showToast({
						title: '库存不足~',
						icon: 'none'
					})
					return false
				}
				
				if (this.token) {
					let skus = [{
						id: this.currentSku.id,
						total: this.buyCount
					}]
					
					let url = "/pages/orderPreview/index?skus=" + JSON.stringify(skus) + "&seckillId=" + this.seckillId
					if (this.useGroupPrice) {
						url += "&groupPriceUuid=" + this.useGroupPrice.uuid
					}
					uni.navigateTo({
						url: url
					})
				} else {
					uni.navigateTo({
						url: "/pages/login/index"
					})
				}
			},
			handleExchangeSubmit() {
				let skus = [{
					id: this.currentSku.id,
					total: 1
				}]
				uni.navigateTo({
					url: "/pages/exchange/orderPreview?skus=" + JSON.stringify(skus)
				})
			},
			handleChipCover() {
				
				this.$http('/chip-assets').then(res => {
					this.chipAssetList = res.data.list
				
					let item = this.chipAssetList.find((item) => {
						return item.id == this.currentSku.cover_chip_id
					})
					
					if (!item || (item.balance < this.currentSku.cover_chip_total)) {
						uni.showModal({
							title: '碎片资产不足',
							content: '请先收集足够的碎片再来兑换哦~',
							confirmText: '查看碎片',
							success: (res) => {
								if (res.confirm) {
									uni.navigateTo({
										url: '/pages/myChip/index'
									})
								}
							}
						})
					
						return false
					}
					
					let skus = [{
						id: this.currentSku.id,
						total: this.buyCount
					}]
					uni.navigateTo({
						url: "/pages/orderPreview/index?skus=" + JSON.stringify(skus) + "&coverType=chip"
					})
					
				})

			},
			handleBuyByGroupon() {
				if (this.token) {
					let skus = [{
						id: this.currentSku.id,
						total: this.buyCount
					}]
					uni.navigateTo({
						url: "/pages/groupon/orderPreview/index?skus=" + JSON.stringify(skus) +
							'&groupon_record_id=' + (this.grouponRecordId ||
								'')
					})
				} else {
					uni.navigateTo({
						url: "/pages/login/index"
					})
				}
			},
			currentSkuAttrsChange(e) {
				let index = e.currentTarget.dataset.index
				let value = e.currentTarget.dataset.value
				this.currentSkuAttrs[index] = value
			},
			getProductInfo() {
				uni.showLoading({})
				
				let params = {
					mode: this.mode,
					seckill_id: this.seckillId
				}
				
				// 置换模式
				if (this.mode === 'exchange') {
					params.package_sku_ids = this.getStorage('exchange_package_sku_ids') || []
				}
				
				return this.$http(`/shop/products/${this.uuid}`, 'POST', params).then(res => {
					uni.hideLoading()
					this.loading = false
					this.product = res.data.info || {}
					
					// 参团
					// if (this.grouponRecordId) {
					// 	this.actionType = 'groupon'
					// 	this.skusVisibleChange()
					// }

				})
			},
			showPresellTips() {
				uni.showModal({
					title: '商品预售中',
					content: '此商品将在开售后开放购买'
				})
			}
		},
		onPageScroll(e) {

			if (e.scrollTop > 350 && !this.isShowTitle) {
				uni.setNavigationBarTitle({
					title: this.product.title
				})
				this.isShowTitle = true
			}

			if (e.scrollTop < 350 && this.isShowTitle) {
				uni.setNavigationBarTitle({
					title: '商品详情'
				})
				this.isShowTitle = false
			}

		}
	}
</script>

<style lang="scss">
	view {
		box-sizing: border-box;
	}

	button {
		padding: 0;
		margin: 0;
		border-radius: 0;
		background-color: transparent;

		&:after {
			border: none;
		}
	}
	
	.image-tag {
		width: 200rpx;
		height: 200rpx;
		position: absolute;
		z-index: 10;
		right: 0rpx;
		top: 0rpx;
		
	}

	.border-top::before {
		background-color: #eee;
	}

	.border-bottom::after {
		background-color: #eee;
	}

	.header-option-c {
		position: -webkit-sticky;
		position: sticky;
		top: 0px;
		z-index: 100;

		.presell-c {
			display: flex;
			align-items: center;
			background: rgba(255, 115, 46, 1);
			padding: 30rpx 0rpx 30rpx 46rpx;
			margin: 0rpx 0rpx 30rpx 0rpx;
			color: white;


			.left {
				flex-grow: 1;

				.s-title {
					font-size: 24rpx;
					margin-bottom: 18rpx;
					color: white;
				}
			}

			.right {

				text-align: center;
				width: 260rpx;
				padding: 0rpx 28rpx;

				border-left: 3rpx solid rgba(255, 255, 255, 0.32);

				.cover-btn {
					border-radius: 50rpx;
					border: 2rpx solid white;
					padding: 10rpx 0rpx;
					font-size: 28rpx;
					font-weight: 500;
					background: rgba(255, 255, 255, 0.1);

					&.completed {
						background: rgba(255, 255, 255, 0.8);
						color: #555;
					}
				}
			}
		}

		.chip-cover-c {
			display: flex;
			align-items: center;
			background: rgba(255, 115, 46, 1);
			padding: 30rpx 0rpx 30rpx 46rpx;
			margin: 0rpx 0rpx 30rpx 0rpx;
			color: white;


			.left {
				flex-grow: 1;

				.s-title {
					font-size: 24rpx;
					margin-bottom: 18rpx;
					color: white;
				}
			}

			.right {

				text-align: center;
				width: 260rpx;
				padding: 0rpx 28rpx;

				border-left: 3rpx solid rgba(255, 255, 255, 0.32);

				.cover-btn {
					border-radius: 50rpx;
					border: 2rpx solid white;
					padding: 10rpx 0rpx;
					font-size: 28rpx;
					font-weight: 500;

					background: rgba(255, 255, 255, 0.1);
				}
			}
		}
	}

	.activity-header-c {
		display: flex;
		align-items: center;
		background: rgba(255, 115, 46, 1);
		background: #EF3041;
		padding: 30rpx 0rpx 30rpx 46rpx;
		margin: 0rpx -24rpx 30rpx -24rpx;
		color: white;

		position: -webkit-sticky;
		position: sticky;
		top: 0px;
		z-index: 100;

		.left {
			flex-grow: 1;

			.s-title {
				font-size: 24rpx;
				margin-bottom: 18rpx;
				color: white;
			}
		}

		.right {
			text-align: center;
			width: 260rpx;
			padding: 0rpx 20rpx;

			border-left: 3rpx solid rgba(255, 255, 255, 0.32);

		}

		.price-scope-c {
			position: relative;
		}

		.price {
			font-size: 38rpx;
			font-weight: 700;
			margin-right: 16rpx;
		}

		.line-price-key {
			font-size: 22rpx;
		}

		.line-price-c {
			display: inline;
			font-size: 22rpx !important;
			text-decoration: line-through;

			.price {
				font-size: 22rpx !important;
			}
		}

		.activity-stock {
			font-size: 22rpx;
			margin-left: 20rpx;
		}

		.count-down {
			color: white;
		}
	}


	.price-c {
		margin-top: 14rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-left: 10rpx;
		box-sizing: border-box;

		.main {
			flex: 1;
			font-size: 46rpx;
			font-weight: bold;
			color: #FF294A;

			.line-price {
				font-size: 30rpx;
				color: #a0a0a0;
				text-decoration: line-through;
			}
		}

		.arrow-right {
			font-size: 24rpx;
			color: #a0a0a0;
		}
		
		.group-price-tag {
			display: block;
			color: #393939;
			font-size: 18rpx;
			padding: 4rpx 12rpx;
			border-radius: 50rpx;
			margin-right: 20rpx;
			background: #F1F1F1;
			background: #FA253B;
			color: white;
			margin-left: 6rpx;
		}
	}

	.groupon {
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 28rpx;
	}

	.title-c {
		margin-top: 16rpx;
		margin-bottom: 24rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 10rpx;
		box-sizing: border-box;

		.body {
			color: #393939;
			font-size: 40rpx;
			font-weight: bold;
			width: 580rpx;
			flex: 0 0 580rpx;
			// padding-left: 20rpx;
			// border: 1px solid red;

			.tag-list {
				display: flex;
				flex-wrap: wrap;
				margin-top: 20rpx;

				.item {
					color: #393939;
					font-size: 24rpx;
					padding: 8rpx 20rpx;
					border-radius: 50rpx;
					margin-right: 20rpx;
					background: #F1F1F1;
					margin-bottom: 10rpx;

					&:first-child {
						margin-left: 0rpx;
					}

					&.actived {
						background: #F27233;
						border: 2rpx solid rgba(242, 114, 51, 1);
						color: white;
					}
				}
			}
		}

		.share-btn {
			margin-left: 20rpx;
			padding-left: 20rpx;
			border-left: 1px dashed #ddd;
			min-height: 80rpx;
			width: 100rpx;
			flex: 0 0 100rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			line-height: 1;
			color: #444;

			.icon {
				width: 38rpx;
				height: 38rpx;
				// margin-right: 10rpx;
				margin-bottom: 10rpx;
			}


			.icon-share {
				font-size: 40rpx;
			}

			.text {
				font-size: 22rpx;
				margin-top: 6rpx;
			}
		}
	}

	.tag-c {
		height: 74rpx;
		color: #888;
		font-size: 26rpx;
		position: relative;
	}

	.detail-c {
		width: 750rpx;
		margin: 0rpx -24rpx;
		margin-top: 80rpx;

		.product-detail-title {
			// height: 40rpx;
			// line-height: 40rpx;
			text-align: center;
			font-size: 34rpx;
			font-weight: 500;
			position: relative;
			margin-bottom: 20rpx;
		}

		.product-detail-content {
			line-height: 1.6;
		}
	}

	.group-price-c {
		margin: 40rpx -24rpx 20rpx -24rpx;
		border-top: 12rpx solid #fafafa;
		border-bottom: 12rpx solid #fafafa;
		padding: 0rpx 30rpx;

		.item {
			display: flex;
			align-items: center;
			padding: 26rpx 0rpx;
			border-bottom: 1rpx solid #f1f1f1;

			&:last-child {
				border-bottom: 0rpx solid #f1f1f1;
			}

			.tag {
				color: #393939;
				font-size: 20rpx;
				padding: 6rpx 16rpx;
				border-radius: 50rpx;
				margin-right: 20rpx;
				background: #F1F1F1;
				background: #FA253B;
				color: white;
			}

			.text {
				font-size: 28rpx;
				font-weight: 500;
				flex-grow: 1;
			}

			.icon-arrow-right {
				font-size: 40rpx;
				color: #999;
			}
		}
	}
	
	.order-reward-c {
		margin: 0rpx -24rpx 20rpx -24rpx;
		// border-top: 12rpx solid #fafafa;
		border-bottom: 12rpx solid #fafafa;
		padding: 0rpx 30rpx;
	
		.item {
			display: flex;
			align-items: center;
			padding: 26rpx 0rpx;
			// border-bottom: 1rpx solid #f1f1f1;
	
			&:last-child {
				// border-bottom: 0rpx solid #f1f1f1;
			}
	
			.tag {
				color: #393939;
				font-size: 20rpx;
				padding: 6rpx 16rpx;
				border-radius: 50rpx;
				margin-right: 20rpx;
				background: #F1F1F1;
				background: #FA253B;
				color: white;
			}
	
			.text {
				font-size: 28rpx;
				font-weight: 500;
				flex-grow: 1;
			}
	
			.icon-arrow-right {
				font-size: 40rpx;
				color: #999;
			}
		}
	}

	.footer-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		min-height: 130rpx;

		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0rpx 30rpx 100rpx 30rpx;
		background-color: #fff;

		.action-item {
			// line-height: transparent;
			height: 100rpx;
			width: 120rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;

			.icon {
				font-size: 42rpx;
				line-height: 46rpx;
			}

			text {
				font-size: 22rpx;
				line-height: 30rpx;
			}
		}

		.btn {
			width: 238rpx;
			height: 78rpx;
			border: 2rpx solid rgba(242, 114, 51, 1);
			border-radius: 40rpx;
			color: #F27233;
			font-size: 26rpx;
			text-align: center;
			line-height: 78rpx;
			margin-left: 30rpx;
			font-weight: 500;

			&.bg-orange {
				background: rgba(242, 114, 51, 1);
				color: #FFFFFF;
			}

			&.btn-full {
				width: 600rpx;
			}

			&.disabled {
				background: #ddd !important;
				color: #FFFFFF !important;
				border: 1rpx solid #FFFFFF !important;
			}
		}
	}

	.skus-wrapper {
		// background: red;
		// position: fixed;
		// width: 100%;
		// height: 100%;
		// left: 0px;
		// top: 0rpx;
		.skus-content {
			// height: 65%;
			height: auto;
			width: 100%;
			padding-bottom: 200rpx;
			position: absolute;
			bottom: 0;
			left: 0;
			// top: 0;
			// background: red;
			background-color: #ffffff;
			border-radius: 10rpx 10rpx 0 0;

			.sku-info {
				display: flex;
				padding: 0 24rpx;

				image {
					width: 180rpx;
					height: 180rpx;
					flex: 0 0 180rpx;
					position: relative;
					top: -34rpx;
					border-radius: 10rpx;
				}

				.info-detail {
					margin-left: 20rpx;

					.price-c {
						margin-top: 20rpx;
						font-size: 34rpx;

					}

					.stock {
						margin-top: 8rpx;
						font-size: 26rpx;
					}

					.info-attrs {
						margin-top: 8px;
						font-size: 26rpx;
					}
				}
			}
			
			.exchange-price-c {
				.origin-price {
					color: #666;
					font-size: 80%;
				}
				.text {
					margin-left: 20rpx;
					font-size: 24rpx;
				}
			}

			.skus-list {
				.skus-item {
					margin: 0 24rpx;

					.skus-title {
						font-size: 28rpx;
						font-weight: bold;
						margin-bottom: 8rpx;
					}

					.skus-values {
						margin: 30rpx 0rpx;
						display: flex;
						flex-wrap: wrap;
						// justify-content: center;

						.item {
							padding: 0 26rpx;
							height: 48rpx;
							line-height: 48rpx;
							font-size: 24rpx;
							margin-right: 16rpx;
							margin-bottom: 16rpx;
							border-radius: 40rpx;
							border: 2rpx solid #EAEBED;
							text-align: center;
							min-width: 70rpx;

							&.actived {
								color: white;
								background: rgba(242, 114, 51, 1);
								border: 2rpx solid rgba(242, 114, 51, 1);
							}

							&:last-child {
								margin-right: 0rpx;
							}
						}
					}
				}
			}

			.buycount {
				margin-top: 80rpx;
				padding: 0 24rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				text {
					font-weight: bold;
				}
			}


			.close-btn {
				position: absolute;
				top: 0;
				right: 0;
				padding: 16rpx;
				font-size: 34rpx;
			}
		}

		.action-btn {
			width: 100%;
			// background-color: #FFFFFF;

			position: absolute;
			// bottom: 30rpx !important;
			// border: 1px solid red;
			background: transparent;
			left: 0;
			bottom: 20rpx;
			height: 120rpx;
			padding: 0rpx 46rpx 50rpx 46rpx;

			.btn {
				width: 658rpx;
				height: 78rpx;
				background: rgba(242, 114, 51, 1);
				border-radius: 39rpx;
				text-align: center;
				line-height: 78rpx;
				color: white;
			}
		}

		// background-color: rgba(0, 0, 0, 0);
		.action-btn {
			// bottom: -65%;
		}
	}

	.groupping-wrap .list-item,
	.comment-wrap .list-item {
		height: 74upx;
		position: relative;

		.arrow-right {
			font-size: 26upx;
		}
	}

	.groupping-content {
		height: 240upx;

		swiper {
			width: 100%;
			height: 100%;

			.list-item:last-child:after {
				background-color: #fff;
			}

			.list-item {
				height: 120upx;

				.body {
					justify-content: space-between;

					.user {
						display: flex;
						align-items: center;

						text {
							margin-left: 16upx;
						}
					}

					.residue {
						color: #000;

						.sub-people {
							font-size: 26upx;
						}

						.time {
							font-size: 22upx;
						}
					}
				}

				.btn {
					margin-left: 30upx;
					width: 130upx;
					height: 60upx;
					line-height: 60upx;
					text-align: center;
					border-radius: 3px;
					font-size: 28upx;
				}
			}
		}
	}
</style>
