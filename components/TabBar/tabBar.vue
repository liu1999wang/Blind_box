<template>
	<view class="tab_bar_box">
		<view class="tab_bar_list">
			<view v-for="item in list" class="tab_bar">
				<view @tap="link(item.pagePath,item.selected)">
					<image :src="isselected==item.selected?item.selectedIconPath:item.iconPath" mode="widthFix"></image>
					<!-- <text>{{item.pagePath}}</text> -->
				</view>
			</view>
		</view>

		
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				list:[
					{
						"selected":0,
						"pagePath": "/pages/index/index",
						"iconPath": require("static/tabbar/tabbar1.png"),
						"selectedIconPath": require("static/tabbar/tabbar1-1.png")
						// "text": "首页"
					},
					{
						"selected":1,
						"pagePath": "/pages/shop/index",
						"iconPath": require("static/tabbar/tabbar3.png"),
						"selectedIconPath": require("static/tabbar/tabbar3-1.png")
						// "text": "秘宝箱"
					},
					{
						"selected":2,
						"pagePath": "/pages/myBox/index",
						"iconPath": require("static/tabbar/hegui.png"),
						"selectedIconPath": require("static/tabbar/hegui-1.png")
						// "text": "盒柜"
					},
					{
						"selected":3,
						"pagePath": "/pages/center/index",
						"iconPath": require("static/tabbar/tabbar5.png"),
						"selectedIconPath": require("static/tabbar/tabbar5-1.png")
						// "text": "我的"
					}
				]
			}
		},
		props: {
			isselected:String
		},
		computed: {
			
		},
		watch: {
		},
		onLoad(e) {

		},
		created() {
		},
		methods: {
			link(type_url,selected){
				console.log(type_url)
				if(this.isselected!=selected){
					uni.reLaunch({
						url: type_url
					})
				}
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.tab_bar_box{
		position: fixed;
		display: block;
		top:calc(100vh - 120rpx);
		left: 0;
		width: 100%;
		height: 120rpx;
		z-index: 99999;
		background-image: url("@/static/tabbar/tabBar-bg.png") ;
		background-color:#370eee;
		background-repeat:repeat-x;

		.tab_bar_list{
			margin: auto;
			margin-top: -40rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			justify-content: space-evenly;
			align-items: center;
			width: 90%;

			.tab_bar{
				width: 25%;
				text-align: center;
				image{
					width: 120rpx;
				}
			}

		}
	}
</style>
