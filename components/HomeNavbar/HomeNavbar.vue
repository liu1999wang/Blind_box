<template>
	<view class="header"  :style="'height:'+customBar+'px;'" :class="theme" >
		<view class="home-nav"  :style="computedStyle" :class="theme">
			<view class="nav-content">
				<view class="title">
					<image class="logo" mode="heightFix" :src="logo"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		name: "HomeNav",
		props: {
			current: Number,
			theme: {
				type: String,
				default () {
					return  'black'
				}
			},
			bgColor: {
				type: String,
				default () {
					return 'white'
				}
			},
			title: {
				type: String
			},
			searchType: {
				type: String,
				default: () => {
					return  'box'
				}
			}
		},
		data() {
			return {
				tabs: ["全部", "新品", "推荐"],
				customBar: 64,
				contentStyle: 64
			}
		},
		computed: {
			deviceInfo() {
				
				return this.$store.getters.deviceInfo
				
			},
			computedStyle () {
				let bgColor = this.theme === 'white' ? `background:${this.bgColor};` : ''
				console.log(bgColor)
				return this.contentStyle + bgColor
			
			},
			logo() {
				return this.$store.getters.setting.login_page.logo || ''
				
			},
		},
		created() {
			this.customBar = this.deviceInfo.customBar
			this.contentStyle = `height:${this.deviceInfo.customBar}px;padding-top:${this.deviceInfo.statusBar}px;`;

		},
		methods: {
			toSearch () {
				uni.navigateTo({
					url: '/pages/search/index?type=' + this.searchType
				})
			},
			handleClick(e) {
				this.$emit("change", e.currentTarget.dataset.current)
				
			}
		}
	}
</script>

<style lang="scss">
	.header {
		position: fixed;
		z-index: 1000;
	}
	.logo{
		height:60rpx;
		
	}
	.home-nav {
		width: 100%;
		position: fixed;
		top: 0;
		left: 0;
		box-sizing: border-box;
		// background: rgba(0, 0, 0, 0.1);
		z-index: 10;
		
		transition: background 0.2s;
		-webkit-transition: background 0.2s;

		.nav-content {
			padding: 0 18rpx;
			height: 100%;
			display: flex;
			align-items: center;
			// background: red;
			
			.title {
				font-size: 42rpx;
				font-weight: bold;
				color: #FFFFFF;
				
				transition: font-size 0.5s, color 0.5s;
				-webkit-transition: font-size 0.5, color 0.5s;
			}
			
			.search-btn {
				width: 134rpx;
				height: 52rpx;
				background: #FD5907;
				opacity: 0.8;
				border-radius: 26rpx;
				margin-left: 20rpx;
				
				font-weight: 500;
				color: #FFE7B0;
				font-size: 26rpx;
				line-height: 52rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				// transition: width 0.5s;
				// -webkit-transition: width 0.5;
				
				.search-icon {
					width: 26rpx;
					height: 26rpx;
					margin-right: 2rpx;
				}
			}
		}
		
		&.white {
			// background: white;
			box-shadow: 0px 14rpx 30rpx 0px rgba(226, 222, 204, 0.4);
			.nav-content {
				
				.title {
					color: black;
					font-size: 36rpx;
				}
				
				.search-btn {
					// width: 160rpx;
					// height: 52rpx;
					// background: #FFBF42;
					color: white;
					opacity: 1;
				}
			}
			
		}
	}


</style>
