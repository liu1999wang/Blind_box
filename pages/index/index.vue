<template>
	<view class="container" style="padding-bottom: 160rpx;">
		
		<!-- 淘宝小程序不需要 -->
		<!-- #ifndef MP-ALIPAY -->
		<HomeNavbar :bgColor="page.nav_color" :title="page.title" searchType="all" :theme="'white'"></HomeNavbar>
		<!-- #endif -->
	
		<!-- <Banner :list="banner" style="height: 640rpx;" class="banner-c"></Banner> -->
		
		<PageRender :page="page" :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" theme="homepage"></PageRender>
		

		
		<Popup :info="popupSetting" @close="closePopup" v-if="isShowPopup"></Popup>
		
		<Danmus v-if="danmuSetting.is_enabled" :setting="danmuSetting" :list="danmuList"></Danmus>
		
		<CouponPopup @close="isShowCouponPopupKey = false" @pickSuccess="closeCouponPopup" v-if="isShowCouponPopup"></CouponPopup>
		<tab-bar :isselected="0"></tab-bar>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				scrollTop: 0,
				popupSetting: {
					number: ''
				},
				isShowPopupKey: true,
				isShowCouponPopupKey: true,
				danmuSetting: {},
				danmuList: [],
				refreshCounter: 0,
				getNextPageCounter: 0
			}
		},
		computed: {
			page() {
				return this.$store.getters.setting.box_home
			},
			// 普通弹窗
			isShowPopup () {
				let flag = uni.getStorageSync('popup_' + this.popupSetting.number)
				return this.popupSetting.is_enabled && this.isShowPopupKey && !flag
			},
			// 优惠券弹窗
			isShowCouponPopup() {
				let flag = uni.getStorageSync('coupon_popup' + this.$store.getters.setting.coupon_popup.number)
				return this.$store.getters.setting.coupon_popup.is_enabled && this.isShowCouponPopupKey && !flag
			}
		},
		watch: {
		},
		onLoad() {
			this.$visitor.record('box_index');
			
			this.getPopup()
			// console.log('text env', process.env.TEST);
			
			this.getDanmu();
			
			// uni.removeTabBarBadge(OBJECT)
			// uni.removeTabBarBadge({
			// 	index: 1
			// })
		},
		onPullDownRefresh() {
			this.$showPullRefresh().then(res => {
				this.refreshCounter++
			})
			this.getPopup()
			this.getDanmu()
		},
		onReachBottom () {
			this.getNextPageCounter++
			// console.log('reach bottom')
		},
		onShow() {},
		methods: {
			getDanmu() {
				this.$http('/danmus/home').then(res => {
					this.danmuSetting = res.data.setting 
					this.danmuList = res.data.list
				})
			},
			getPopup() {
				this.$http('/setting/popup', 'GET', ).then(res => {
					this.popupSetting = res.data.setting
				})
			},
			closePopup() {
				uni.setStorageSync('popup_' + this.popupSetting.number, 1)
				this.isShowPopupKey = false
			},
			closeCouponPopup() {
				uni.setStorageSync('coupon_popup' + this.$store.getters.setting.coupon_popup.number, 1)
				this.isShowCouponPopupKey = false
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		}
	}
</script>

<style lang="scss" scoped>
page {
	
}
</style>
