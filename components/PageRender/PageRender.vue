<template>
	<view class="page-scope">
		<DefaultTheme :refreshCounter="refreshCounter" :getNextPageCounter="getNextPageCounter" v-if="renderTheme === 'default'" :page="page"></DefaultTheme>
		<HomepageTheme :refreshCounter="refreshCounter"  :getNextPageCounter="getNextPageCounter" v-else-if="renderTheme === 'homepage'" :page="page"></HomepageTheme>
		
		<FloatBtn v-if="isShowFloatBtn" :link="floatBtn.link" :isAnimated="floatBtn.is_animate" :src="floatBtn.image" @tap="invite"></FloatBtn>
		<SharePopup v-if="isSharePopup" @close="hideSharePopup" :info="posterInfo"></SharePopup>
	</view>
</template>

<script>
	import DefaultTheme from './themes/DefaultTheme.vue'
	import HomepageTheme from './themes/HomepageTheme.vue'
	import {
		mapGetters
	} from "vuex"
	export default {
		components: {
			DefaultTheme,
			HomepageTheme
		},
		
		props: {
			page: {
				type: Object,
				default () {
					return {
						title: '',
						modules: [],
						isSharePopup:false,
					}
				}
			},
			theme: {
				type: String
			},
			fullPageMode: {
				type: Boolean,
				default () {
					return true
				}
			},
			refreshCounter: Number,
			getNextPageCounter: Number
		},
		data() {
			return {
				isSharePopup:false
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			renderTheme () {
				return (this.page && this.page.base && this.page.base.theme) || this.theme || 'default'
			},
			title () {
				return (this.page && this.page.title) || '未设置'
			},
			navColor () {
				return this.page && this.page.nav_color || '#FFFFFF'
			},
			isShowFloatBtn () {
				return this.page && this.page.is_float_btn
			},
			floatBtn () {
				return this.page && this.page.float_btn || {}
			},
			posterInfo() {
				return {
					money_price: '',
					score_price: '',
					title: this.title,
					path: this.getShareConfig().path,
					thumb: "https://www.hebide.cc/yhj.jpg"
				}
			},
		},
		mounted() {
			this.setNav()
		},
		watch: {
			title () {
				this.setNav()
			},
			navColor () {
				this.setNav()
			}
		},
		methods: {
			setNav() {
				if (!this.fullPageMode)
					return false 
				
				uni.setNavigationBarTitle({
					title: this.title
				})
				
				
				uni.setNavigationBarColor({
					backgroundColor: this.navColor,
					// #ifndef MP-ALIPAY
					frontColor: '#000000'
					// #endif
				})
			},
			invite(){
				if(this.floatBtn.link.url=="invite"){
					this.isSharePopup = true
				}else{
									
				}
			},
			hideSharePopup() {
				this.isSharePopup = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-scope {
		
	}
</style>
