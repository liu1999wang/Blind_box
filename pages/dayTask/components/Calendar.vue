<template>
	<view class="imt-calendar">
		<view class="header-c">
			<view class="time-btn">{{displayTime}}</view>
			<view class="signin-btn" hover-class="hover" @tap="signIn" v-if="!isSignIn">立即签到</view>
			<view class="signin-btn down" hover-class="hover" v-else>已签到</view>
		</view>
		<view class="calendar-week-wrapper">
			<view class="calendar-week" v-for="(item,index) in week" :key="index">{{item}}</view>
		</view>
		<swiper class="swiper" :current="current" @change="current = $event.detail.current">
			<swiper-item class="swiper-item"  v-for="(list, index) in calendar" :key="index">
				<view class="day-list">
					<template v-for="(item,key) in list">
						<view class="day-c" :class="{completed: item.completed}" :key="key">
							<view class="day"> {{item.date}} </view>
							<view class="score" v-if="item.score"> +{{item.score}} </view>
							<view class="score" v-else></view>
						</view>
					</template>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				current: '',
				startYear: '',
				startMonth: '',
				calendar: [],
				selectedTime: '',
				selectedDay: false,
				selectedIndex: ''
			}
		},
		watch: {
			completed() {
				this.initData()
			}
		},
		props: {
			completed: {
				type: Array,
				default () {
					return []
				}
			},
			value: {
				type: String,
				default () {
					return ''
				}
			},
			isSignIn: {
				type: Number
			}
		},
		created() {
			this.initData()
			// this.selectedTime = new Date().format('yyyy-M-d')
			// console.log(this.selected)
		},
		methods: {
			selectDay(day) {
				if (!day || this.isTimeSelectable(this.current, day))
					return false

				this.selectedDay = day
				this.selectedIndex = this.current

				day = parseInt(day) < 10 ? ('0' + day) : day
				this.selectedTime = this.currentTime + '-' + day

				this.$emit('input', this.selectedTime)
			},
			initData() {
				// console.log('get usable days', this.usableDays)
				// let year = new Date().getFullYear()
				// let month = new Date().getMonth()

				// year = 2020
				// month = 2

				// this.startYear = this.completed.length ? this.completed[0].substr(0, 4) : `${year}`
				// this.startMonth = this.completed.length ? this.completed[0].substr(5, 2) - 1 : month
				let currentYear = new Date().getFullYear()

				// 开始日期
				// this.startYear = `${currentYear}`
				// this.startMonth = new Date().getMonth()
				if (this.completed.length) {
					this.startYear = this.completed[0].day.substr(0, 4)
					this.startMonth = this.completed[0].day.substr(5, 2) - 1
				}
				else {
					this.startYear = `${currentYear}`
					this.startMonth = new Date().getMonth()
				}

				this.calendar = [...Array(2).keys()].map(i => this.getDate(this.format(i)))
				
				
				if (this.completed) {
					this.completed.forEach(item => {
						let time = item.day.split('-')
						let index_0 = time[1] - this.startMonth - 1 + (time[0] - this.startYear) * 12
						let index_1 = time[2] - 1 + new Date(`${time[0]}-${time[1]}`).getDay()
						this.calendar[index_0][index_1].completed = true
						this.calendar[index_0][index_1].score = item.score
					})
				}

				// console.log('calendar ======>', this.calendar)
				this.current = 0
			},
			getDate(e) {
				let time = e.split('-')
				// console.log(time, time)
				return [...Array(new Date(`${time[0]}-${time[1]}`).getDay())].map(i => ({
					date: ''
				})).concat([...Array([4, 6, 9, 11].includes(time[1] * 1) ? 30 : (time[1] != 2 ? 31 : (time[0] % 4 == 0 ? 29 : 28)))
					.keys()
				].map(i => ({
					date: i + 1
				})))
			},
			format(e) {
				let time = new Date(new Date(this.startYear).setMonth(this.startMonth + e))
				return `${time.getFullYear()}-${(time.getMonth()<9 && '0')+(time.getMonth()+1)}`
			},
			isTimeSelectable(index, date) {
				let time = new Date().format('yyyy-M-d').split('-')
				let currentIndex = time[1] - this.startMonth - 1 + (time[0] - this.startYear) * 12
				let currentDate = parseInt(time[2])
				date = parseInt(date)

				// console.log(index, currentIndex, date, currentDate)

				if (index <= currentIndex && date < currentDate)
					return true

				return false
			},
			displayFormat(e) {
				let time = new Date(new Date(this.startYear).setMonth(this.startMonth + e))
				return `${time.getFullYear()}年${(time.getMonth()<9 && '0')+(time.getMonth()+1)}月`
			},
			signIn () {
				this.$emit('signIn')
			}
		},
		computed: {
			currentTime() {
				return this.format(this.current)
			},
			displayTime() {
				return this.displayFormat(this.current)
			},
		}
	}
</script>

<style lang="scss" scoped>
	@font-face {
		font-family: 'imt-calendar';
		src: url('//at.alicdn.com/t/font_1114123_r6yq558axt.ttf') format('truetype');
	}

	.header-c {
		display: flex;
		justify-content: space-between;
		padding: 35rpx 30rpx;

		.time-btn {
			width: 220rpx;
			height: 60rpx;
			background: #F8F8F8;
			border-radius: 30rpx;
			line-height: 60rpx;
			text-align: center;
			font-weight: bold;
			color: #272637;
		}

		.signin-btn {
			width: 164rpx;
			height: 60rpx;
			background: #FFCC09;
			border-radius: 30rpx;
			font-size: 28rpx;
			text-align: center;
			line-height: 60rpx;
			color: #FFFFFF;
			
			&.down {
				background: #6CD074;
			}
		}
	}

	.imt-calendar {
		width: 700upx;
		margin: auto;
		background: white;
		border-radius: 20upx;
		text-align: center;
		color: black;


		background: #FFFFFF;
		box-shadow: 0px 14rpx 30rpx 0px rgba(226, 222, 204, 0.4);
		border-radius: 20rpx;

		/* box-shadow: #e1e1e1 0rpx 5rpx 10rpx; */
	}


	.calendar-week-wrapper {
		display: flex !important;
		// background: #2E2B2C;
		color: white;
		color: #2E2D37;
	}

	.calendar-week {
		flex: 1;
		font-size: 29upx;
		line-height: 100upx;
	}

	.swiper {
		height: 500rpx;
		// border: 1px solid red;
	}

	.swiper-item {
		height: 500rpx;
		// display: flex !important; 
		// flex-wrap: wrap;
		/* background: #F7F8F9; */
		
		.day-list {
			display: flex;
			flex-wrap: wrap;
			// width: ;
		}
	}

	.day-c {
		width: 100upx;
		height: 100upx;
		
		font-size: 28upx;
		// line-height: 100upx;
		/* border: 1rpx solid #f1f1f1; */
		box-sizing: border-box;
		/* border-radius: 50%; */
		font-weight: bold;
		color: #777;
		
		.day {
			border-radius: 50%;
			width: 60rpx;
			height: 60rpx;
			margin: 0rpx auto;
			text-align: center;
			line-height: 60rpx;
		}
		.score {
			font-size: 22rpx;
			color: red;
		}
		
		
		&.completed {
			.day {
				background: #FED63D;
			}
		}
	}
</style>
