<template>
	<view class="container-ccc">
		<!-- <normalVipCard :user="user"></normalVipCard> -->
		<canvas class="hideCanvas" canvas-id="default_PosterCanvasId" :style="{width: (poster.width||0) + 'px', height: (poster.height||0) + 'px'}"></canvas>
		<!-- <canvas class="hideCanvas" canvas-id="default_PosterCanvasId"></canvas> -->
		<image class="poster" mode="widthFix" v-if="posterPath" :src="posterPath"></image>
		<view v-else class="empty-block"></view>
	</view>
</template>

<script>
	import _app from '@/js_sdk/QuShe-SharerPoster/util/QS-SharePoster/app.js';
	import {
		getSharePoster
	} from '@/js_sdk/QuShe-SharerPoster/util/QS-SharePoster/QS-SharePoster.js';

	export default {
		data() {
			return {
				canvasId: 'default_PosterCanvasId',
				poster: null,
				posterPath: null
			};
		},
		components: {},
		computed: {
			displayPrice () {
				let price = ''
				if (this.info && this.info.money_price) {
					price = this.info.money_price / 100 + '元'
				}
				if (this.info && this.info.score_price) {
					price += (price ? '+' : '') + this.info.score_price + this.scoreAlias
				}
				if (!price) {
					price = ''
				}
				return price
			}
		},
		props: {
			info: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		watch: {
			info () {
				this.generatePoster()
			}
		},
		mounted() {
			// console.log('hfhe')
			// this.$http('/user').then(res => {
			// 	this.user = res.data.user
			// 	this.shareFc()
			// })
			this.generatePoster()
			
			console.log('info', this.info)
		},
		methods: {
			async generatePoster() {
				console.log('ahres')
				try {
					const d = await getSharePoster({
						_this: this, //若在组件中使用 必传
						type: 'testShareType',
						posterCanvasId: this.canvasId,
						delayTimeScale: 20, //延时系数
						// backgroundImage: 'https://cdn.artfilmonline.com/vip_poster_0303.png',
						background: { //设置自定义背景画布, 若传该属性则背景图失效
							height: 1100, //画布高度
							width: 800, //画布宽度
							backgroundColor: '#ffffff'//背景颜色
						},
						drawArray: ({
							bgObj,
							type,
							bgScale
						}) => {
							const dx = bgObj.width * 0.3;
							const fontSize = bgObj.width * 0.045;
							const lineHeight = bgObj.height * 0.04;
							//可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
							return new Promise((rs, rj) => {
								rs([{
										type: 'image',
										url: this.info.thumb,
										dx: 0,
										dy: 0,
										infoCallBack(imageInfo) {
											// let scale = bgObj.width / imageInfo.height;
											return {
												// circleSet: {
												// 	x: imageInfo.width * scale / 2,
												// 	y: bgObj.width * 0.2 / 2,
												// 	r: bgObj.width * 0.2 / 2
												// }, // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
												dWidth: bgObj.width, // 因为设置了圆形图片 所以要乘以2
												dHeight: bgObj.width,
												mode: 'aspectFill'
											}
										}
									},
									{
										type: 'image',
										url: this.info.qrcode,
										dx: 240,
										dy: bgObj.width - 15,
										infoCallBack(imageInfo) {
											let scale = bgObj.width * 0.2 / imageInfo.height;
											return {
												// circleSet: {
												// 	x: imageInfo.width * scale / 2,
												// 	y: bgObj.width * 0.2 / 2,
												// 	r: bgObj.width * 0.2 / 2
												// }, // 圆形图片 , 若circleSet与roundRectSet一同设置 优先circleSet设置
												dWidth: 130, // 因为设置了圆形图片 所以要乘以2
												dHeight: 130,
												roundRectSet: { // 圆角矩形
													r: 70
												}
											}
										}
									},
									// {
									// 	type: 'text',
									// 	// fontStyle: 'italic',
									// 	text: this.user.name,
									// 	size: 38,
									// 	color: '#EDEDED',
									// 	dx: 150,
									// 	dy: 100,
									// 	// alpha: .5,
									// 	textAlign: 'left',
									// 	textBaseline: 'middle',
									// 	infoCallBack(textLength) {
									// 		if (textLength > 300) {
									// 			return {
									// 				size: 34
									// 			}
									// 		}
									// 		return {}
									// 	}
									// },
									{
										type: 'text',
										// fontStyle: 'italic',
										text: "佩佩玛特",
										size: 24,
										color: '#000',
										dx: 260,
										dy: bgObj.width + 155,
										// alpha: .5,
										textAlign: 'left',
										textBaseline: 'middle',
										infoCallBack(textLength) {
											return {}
										}
									},
									// {
									// 	type: 'text',
									// 	// fontStyle: 'italic',
									// 	text: this.displayPrice,
									// 	size: 32,
									// 	color: '#E63111',
									// 	dx: 20,
									// 	dy: bgObj.width + 150,
									// 	// alpha: .5,
									// 	textAlign: 'left',
									// 	textBaseline: 'middle',
									// 	infoCallBack(textLength) {
									// 		return {}
									// 	}
									// },
									// {
									// 	type: 'text',
									// 	// fontStyle: 'italic',
									// 	fontFamily: 'customFont',
									// 	text: this.user.email,
									// 	size: 45,
									// 	color: '#EDEDED',
									// 	dx: 165,
									// 	dy: 435,
									// 	// alpha: .5,
									// 	textAlign: 'left',
									// 	textBaseline: 'middle',
									// 	infoCallBack(textLength) {
									// 		// _app.log('index页面的text的infocallback ，textlength:' + textLength);
									// 		return {
									// 			// dx: bgObj.width - textLength - fontSize,
									// 			// dy: bgObj.height - lineHeight * 3
									// 		}
									// 	}
									// },
								]);
							})
						},
						setCanvasWH: ({
							bgObj,
							type,
							bgScale
						}) => { // 为动态设置画布宽高的方法，
							this.poster = bgObj;
						},
						/* setDraw: ({Context, bgObj, type, bgScale}) => {
							Context.setFillStyle('black');
							Context.setGlobalAlpha(0.3);
							Context.fillRect(0, bgObj.height - bgObj.height*0.2, bgObj.width, bgObj.height*0.2);
						} */
					});
					// console.log('海报生成成功， 临时路径: ' + d.poster.tempFilePath)
					this.poster.finalPath = d.poster.tempFilePath;
					this.posterPath = d.poster.tempFilePath;

					this.$emit('getPosterUrl', this.posterPath);

					// uni.showToast('已保存到相册')
					// return false

					// uni.previewImage({
					// 	urls: [d.poster.tempFilePath]
					// })
					// return false

					// uni.saveImageToPhotosAlbum({
					// 	filePath: this.poster.finalPath,
					// 	success(res) {
					// 		_app.showToast('已保存到相册');
					// 	}
					// })

				} catch (e) {
					_app.hideLoading();
					_app.showToast(JSON.stringify(e));
					console.log(JSON.stringify(e));
				}
			}
		}
	};
</script>
<style lang="scss" scoped>
	.container-ccc {
		// background: ;
		padding: 10px 10rpx;
		text-align: center;
		
		.hideCanvas {
			width: 100%;
			position: fixed;
			right: 200%;
		}

		.poster {
			// margin-top: 30%;
			// width: 100%;
			border-radius: 8rpx;
			// box-shadow: 8px 8px 8px rgba(0, 0, 0, .5);
			// -moz-box-shadow: 8px 8px 8px rgba(0, 0, 0, .5);
			// -webkit-box-shadow: 8px 8px 8px rgba(0, 0, 0, .5);
		}

		.empty-block {
			width: 100%;
			height: 580rpx;
		}
	}
</style>
