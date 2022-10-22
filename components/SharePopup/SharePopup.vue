<template>
	<view class="popup-c-2847">
		<view class="share-type-c safe-area-bottom" v-if="isAskShareType">
			<view class="title-text">分享至</view>
			<view class="list-popup">
				<button class="item" open-type="share" @tap="shareToWechat">
					<image src="https://cdn2.hquesoft.com/box/img/wechat.png" mode="widthFix"></image>
					<view class="text">微信好友</view>
				</button>
				<button class="item" v-if="isCanShareToTimeLine" @tap="shareToTimeLine">
					<image src="https://cdn2.hquesoft.com/box/img/timeline.png" mode="widthFix"></image>
					<view class="text">朋友圈</view>
				</button>
				<button class="item" v-if="isCanShareWithPoster" @tap="generatePoster">
					<image src="https://cdn2.hquesoft.com/box/img/image.png" mode="widthFix"></image>
					<view class="text">生成海报</view>
				</button>
			</view>
			<view class="cancel-text" @tap="close">取消</view>
		</view>
		<view class="poster-content" v-if="isShowPoster">
			<view class="close-btn" @tap="close">
				<text class="new-iconfont icon-close"></text>
			</view>
			<PosterTheme1  @getPosterUrl="getPosterUrl" :info="calcInfo"></PosterTheme1>
			<view class="button-c" @tap.native.stop="prevent">
				<!-- <button open-type="share" hover-class="hover">分享给好友</button> -->
				<button hover-class="hover" @tap="saveImg">保存海报至相册</button>
			</view>
		</view>
	</view>
</template>

<script>
	import PosterTheme1 from './components/posterTheme1.vue'
	import {BASE_URL} from "@/config/index.js";
	export default {
		components: {
			PosterTheme1
		},
		props: {
			info: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		computed: {
			calcInfo () {
				return {
					...this.info,
					qrcode: BASE_URL + '/miniapp/qrcode?path=' + encodeURIComponent(this.info.path)
				}
			},
			isCanShareToTimeLine() {
				
				// #ifdef APP-PLUS
				return true
				// #endif
				
				return false
			},
			isCanShareWithPoster () {
				// #ifdef APP-PLUS
				return false
				// #endif
				
				return true
			}
		},
		data() {
			return {
				image: '',
				isShowPoster: false,
				isAskShareType: true
			}
		},
		methods: {
			// app分享给朋友
			shareToWechat() {
				// #ifndef APP-PLUS
				return false
				// #endif
				
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
				    href: this.info.app_url,
				    title: this.info.title,
				    summary: this.info.desc || this.info.title,
				    imageUrl: this.info.thumb,
				    success: (res) => {
				   //      uni.showToast({
				   //      	title: '分享成功~',
							// icon
				   //      })
						this.close()
				    },
				    fail: function (err) {
						uni.showToast({
							title: '分享未成功~'
						})
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			},
			// app分享至朋友圈
			shareToTimeLine() {
				uni.share({
				    provider: "weixin",
					scene: "WXSceneTimeline",
					type: 0,
					href: this.info.app_url,
					title: this.info.title,
					imageUrl: this.info.thumb,
				    summary: this.info.desc || this.info.title,
				    success: (res) => {
				        // console.log("success:" + JSON.stringify(res));
						// uni.showToast({
						// 	title: '分享成功~'
						// })
						this.close()
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
						uni.showToast({
							title: '分享未成功~'
						})
				    }
				});
			},
			generatePoster () {
				this.isAskShareType = false
				this.isShowPoster = true
			},
			getPosterUrl (url) {
				this.image = url
			},
			close () {
				this.$emit('close')
			},
			saveImg() {
				console.log('saving', this.image)
				uni.saveImageToPhotosAlbum({
					filePath: this.image,
					success(res) {
						uni.showToast({
							title: '已保存到相册',
							icon: 'none'
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.share-type-c {
		width: 100%;
		left: 0rpx;
		background: white;
		position: fixed;
		bottom: 0rpx;
		padding: 30rpx 0rpx;
		
		.title-text {
			font-size: 32rpx;
			font-weight: 500;
			text-align: center;
		}
		
		.cancel-text {
			text-align: center;
			margin-top: 30rpx;
			padding-top: 30rpx;
			padding-bottom: 50rpx;
			border-top: 1rpx solid #F1F1F1;
		}
		
		.list-popup {
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin-top: 60rpx;
			margin-bottom: 30rpx;
			
			.item {
				background: white;
				border: 0rpx;
				line-height: 50rpx;
				image {
					width: 60rpx;
				}
				.text {
					font-size: 28rpx;
					font-weight: 400;
				}
				
				&:after {
					display: none;
				}
			}
		}
	}
	.popup-c-2847 {
		position: fixed;
		left: 0rpx;
		top: 0rpx;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.6);
		z-index: 10000;
		
		display: flex;
		align-items: center;
		justify-content: center;

		.poster-content {
			position: relative;
			.close-btn {
				width: 60rpx;
				height: 60rpx;
				background: #FFBF42;
				border-radius: 50%;
				position: absolute;
				color: white;
				right: -8rpx;
				top: -8rpx;
				text-align: center;
				line-height: 60rpx;
				z-index: 3;
			}
			.button-c {
				margin-top: 30px;
				display: flex;
				justify-content: center;

				button {
					height: 90rpx;
					line-height: 90rpx;
					padding: 0 40rpx;
					background-color: #FFBF42;
					color: white;
					font-size: 28rpx;
					border-radius: 46rpx;
					margin: 0 20rpx;
				}
			}
		}
	}
</style>
