<template>
	<span>
		<template v-if="info.type === 'score'">
			{{info.total || '-'}}{{scoreAlias}}
		</template>
		<template v-else-if="info.type === 'redpack'">
			{{info.total / 100 || '-'}}元红包
		</template>
		<template v-else-if="info.type === 'exclude_card'">
			{{info.total || '-'}}张排除卡
		</template>
		<template v-else-if="info.type === 'show_card'">
			{{info.total || '-'}}张透视卡
		</template>
		<template v-else-if="info.type === 'coupon'">
			"{{info.coupon_title || '-'}}" 优惠券1张
		</template>
		<template v-else-if="info.type === 'free_ticket'">
			{{info.total || '-'}} 次免费抽奖机会
		</template>
		<template v-else>
			-
		</template>
	</span>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				
			}
		},
		props: {
			info: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		computed: {},
		watch: {
		},
		onLoad(e) {

		},
		created() {
		},
		methods: {
			
		},
		onPageScroll(e) {
			
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
