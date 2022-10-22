<template>
	<text class="time-scope-c">
		<template v-if="status !== 'expired'">
			<template v-if="time.day">
				<text class="dd">{{time.day}}天</text>
			</template>
			<text class="time" v-if="time.hour">{{time.hour | fixNumber}}时</text>
			<text class="time">{{time.minute | fixNumber}}分</text>
			<text class="ss">{{time.second | fixNumber}}秒</text>
		</template>
		<text v-else>
			{{endText}}
		</text>
	</text>
</template>

<script>
	export default {
		props: {
			time: {
				type: Object
			},
			status: {
				type: String
			},
			endText: {
				type: String
			}
		},
		data() {
			return {}
		},
		filters: {
			fixNumber (val) {
				if (val < 10)
					val = '0' + val 
				return val
			}
		},
		watch: {},
		destroyed() {},
		methods: {}
	}
</script>

<style lang="scss" scoped>

</style>
