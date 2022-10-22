<template>
	<view class="count-down">
		<DefaultTheme :endText="endText" :status="status" :time="timeObj" v-if="theme === 'default'"></DefaultTheme>
		<ProductDetailTheme1 :endText="endText" :status="status" :time="timeObj" v-else-if="theme === 'product_detail_theme_1'"></ProductDetailTheme1>
		<ZhuliTheme :endText="endText" :status="status" :time="timeObj" v-else-if="theme === 'zhuli'"></ZhuliTheme>
	</view>
</template>

<script>
	import DefaultTheme from "./theme/Default"
	import ProductDetailTheme1 from "./theme/ProductDetailTheme1"
	import ZhuliTheme from "./theme/ZhuliTheme"

	export default {
		name: 'CountDown',
		components: {
			DefaultTheme,
			ProductDetailTheme1,
			ZhuliTheme
		},
		props: {
			start: {
				type: String
			},
			end: {
				type: String
			},
			endText: {
				type: String,
				default: '活动已结束'
			},
			theme: {
				type: String,
				default: 'default'
			}
		},
		data() {
			return {
				status: 'pending',
				timer: null,
				startSecondTime: 0,
				endSecondTime: 0,
				timeObj: {
					day: 0,
					hour: 0,
					minute: 0,
					second: 0
				}
			}
		},
		computed: {
		},
		mounted () {
			this.calcTime()
			console.log(this.timeObj)
		},
		watch: {
			start: {
				handler(value) {
					clearInterval(this.timer)
					if (!value) return

					this.startSecondTime = this.getSecondTime(value)
					this.endSecondTime = this.getSecondTime(this.end)

					this.calcTime()
					this.timer = setInterval(() => {
						this.calcTime()
					}, 1000)
				},
				immediate: true
			},
			status: {
				handler(value) {
					console.log(value)
					this.$emit('change', value)
				},
				immediate: true
			}
		},
		destroyed() {
			clearInterval(this.timer)
		},
		methods: {
			// 时间的秒数
			getSecondTime(time) {
				if (typeof time === 'string') {
					var t = time.split(/[- :]/);

					// Apply each element to the Date function
					var date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5])
				} else {
					var date = new Date()
				}

				return date.getTime() / 1000
			},
			calcTime() {
				let now = this.getSecondTime()

				// 已结束
				if (this.endSecondTime < now) {
					this.status = 'expired'
					clearInterval(this.timer)
					return
				}

				// 进行中
				if (this.startSecondTime < now) {
					this.status = 'working'
					let diff = this.endSecondTime - now
					this.timeObj = this.formatTimeDiff(diff)
					return
				}

				// 待开始
				if (this.startSecondTime > now) {
					this.status = 'pending'
					let diff = this.startSecondTime - now
					this.timeObj = this.formatTimeDiff(diff)
					return
				}
			},
			formatTimeDiff(diff) {
				let day = parseInt(diff / 86400)
				return {
					day: day,
					hour: parseInt(diff / 3600) - 24 * day,
					minute: parseInt(diff % 3600 / 60),
					second: parseInt(diff % 60)
				}
			}
		}
	}
</script>

<style lang="scss">
	.count-down {
		font-size: 26upx;
		display: inline;

		.date-time {
			display: flex;
			align-items: center;

			view {
				height: 46upx;
				line-height: 46upx;
				text-align: center;
				background-color: #e52302;
				border-radius: 3px;
				color: #fff;
			}

			.dd {
				padding: 0 8upx;
			}

			.time {
				width: 48upx;
			}

			.ss {
				padding: 0 8upx;
				width: 70upx;
				text-align: left;
			}

			.pass .dd,
			.pass .time,
			.pass .ss {
				background-color: #BBBBBB;
			}

			.pass .colon {
				color: #BBBBBB;
			}
		}

		.colon {
			margin: 0 2px;
			font-size: 32upx;
		}
	}
</style>
