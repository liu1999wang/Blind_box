<template>
	<view>
		<!-- <view :style="`margin-top: ${item.style.margin_top}px; padding: 0 ${item.style.padding}px;`" v-for="(item, index) in modules"> -->
		<view :style="'height:'+topheight+'rpx'"></view>
		<view :style="'margin: 0 '+swiperModule.style.margin+'rpx;'+'margin-top:'+swiperModule.style.margin_top+'rpx;'" >
		<Banner v-if="swiperList.length > 0" dotListStyle="bottom: 90rpx;" :list="swiperList" :iStyle="'height: ' + (swiperModule.style.height || 650) + 'rpx;'"></Banner>
		</view>
		<view  class="content-c" style="background-color: #f7f7f7; ">
			<view class="module-c" :style="'margin-top:' + item.style.margin_top + 'rpx; padding: 0 ' + item.style.margin + 'rpx;'" v-for="(item, index) in modules">
				<Banner :list="item.list" :iStyle="'height: ' + item.style.height + 'rpx;'" :imageStyle="'border-radius: ' + item.style.radius + 'rpx;'"
				 v-if="item.type === 'swiper'"></Banner>
				<cardTitle :title="item.title"  :moreText="item.more_text" :isShowMore="item.is_show_more" :leftIcon="item.left_icon" :link="item.more_link" v-else-if="item.type === 'title'"></cardTitle>
				<BoxList :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :ids="item.list" :module="item" v-else-if="item.type === 'boxes'" />
				<ProductList :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :ids="item.list" :module="item" v-else-if="item.type === 'products'" />
				<ActivityList :refreshCounter="refreshCounter"  :getNextPageCounter="getNextPageCounter" :ids="item.list" :module="item" v-else-if="item.type === 'activities'" />
				<CouponList :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" :ids="item.list" :module="item" v-else-if="item.type === 'coupons'" />
				<IPList :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" v-else-if="item.type === 'ips'"></IPList>
				<CategoryList :refreshCounter="refreshCounter" :module="item" v-else-if="item.type === 'categoryList'"></CategoryList>
				<ImageList v-else-if="item.type === 'images'" :module="item"></ImageList>
				<VideoItem v-else-if="item.type === 'video'" :module="item"></VideoItem>
				<PureImageList v-else-if="item.type === 'imageList'" :module="item"></PureImageList>
				<SigninCard v-else-if="item.type === 'signin'" :module="item" />
				<HTML v-else-if="item.type === 'html'" :html="item.html" />
			</view>
		</view>
	</view>
</template>

<script>
	import ImageList from "../modules/ImageList.vue"
	import PureImageList from "../modules/PureImageList.vue"
	import VideoItem from "../modules/Video.vue"
		
	export default {
		components: {
			ImageList,
			PureImageList,
			VideoItem
		},
		props: {
			refreshCount: {
				type: Number
			},
			page: {
				type: Object,
				default () {
					return {
						modules: []
					}
				}
			},
			refreshCounter: Number,
			getNextPageCounter: Number
		},
		data() {
			return {
				topheight:0
			}
		},
		computed: {
			deviceInfo() {
				
				return this.$store.getters.deviceInfo
				
			},
			pageModules() {
				return this.page.modules || []
			},
			swiperList() {
				return (this.pageModules[0] && this.pageModules[0].list) || []
			},
			swiperModule() {
				
				return this.pageModules[0] || {
					style: {}
				}
			},
			modules () {
				return this.pageModules.slice(1)
			},
			title () {
				return this.page.title || '未设置'
			},
			

		},
		mounted() {
			// uni.setNavigationBarTitle({
			// 	title: this.title
			// })
			this.topheight=this.deviceInfo.customBar
			console.log(this.topheight)
			// this.customBar = this.deviceInfo.customBar
			// this.contentStyle = `height:${this.deviceInfo.customBar}px;padding-top:${this.deviceInfo.statusBar}px;`;
			// this.top_height()
		},
		watch: {
			title (val) {
				// uni.setNavigationBarTitle({
				// 	title: this.title
				// })
			}
		},
		methods: {
			// top_height(){
				
			// 	console.log(this.topheight)
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.content-c {
		position: relative;
		
		top: 0rpx;
		
		overflow: hidden;
		
		.module-c {
			// border: 1px solid red;
			box-sizing: border-box;
		}
	}
</style>
