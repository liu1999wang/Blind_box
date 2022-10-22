<template>
	<!--pages/webview/index.wxml-->
	<web-view :src="url"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				url: ""
			};
		},

		components: {},
		props: {},

		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(e) {
			this.url = e.url
		},

		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
		},

		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {},

		/**
		 * 生命周期函数--监听页面隐藏
		 */
		onHide: function() {},

		/**
		 * 生命周期函数--监听页面卸载
		 */
		onUnload: function() {},

		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function() {},

		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function() {},

		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function() {
			return {
				path: '/pages/index/index'
			}
		},
		methods: {
		}
	};
</script>
<style scoped>
</style>
