<template>
	<span class="product-price">
		<!-- 无促销价 -->
		<span class="price" v-if="!isHasDiscountPrice">
			<template v-if="money">
				<span class="symbol">￥</span>
				{{formatPrice(money)}}
			</template>
			<template v-if="money && score">+</template>
			<template v-if="score">
				{{score}}
				<span class="symbol-text">{{scoreAlias}}</span>
			</template>
			<template v-if="!money && !score">￥0</template>
		</span>
		<!-- 有促销价 -->
		<template v-else>
			<span class="price">
				<template v-if="discountMoney">
					<span class="symbol">￥</span>{{formatPrice(discountMoney)}}
				</template>
				<template v-if="discountMoney && discountScore">+</template>
				<template v-if="discountScore">
					{{discountScore}}
					<span class="symbol-text">{{scoreAlias}}</span>
				</template>
				<template v-if="discountMoney === 0 && discountScore === 0">￥0</template>
			</span>
			<span class="line-price" style="padding-left: 10rpx;">
				<template v-if="money">￥{{formatPrice(money)}}</template>
				<template v-if="money && score">+</template>
				<template v-if="score">{{score}} {{scoreAlias}}</template>
			</span>
		</template>
	</span>
</template>

<script>
	function isNumber(val) {
	    var regPos = /^[0-9]+.?[0-9]*/
	  
	    if(regPos.test(val) ){
	        return true
	    }else{
	        return false
	    }
	}
	
	export default {
		props: {
			info: {
				type: Object,
				default () {
					return {}
				}
			},
			theme: {
				type: String,
				default () {
					return 'red'
				}
			},
			moneyKey: {
				type: String
			},
			scoreKey: {
				type: String
			},
			prefix: {
				type: String,
				default () {
					return ''
				}
			},
			discountPrefix: {
				type: String,
				default () {
					return 'discount_'
				}
			}
		},
		filters: {},
		methods: {
			formatPrice(price) {
				return (price / 100).toFixed(2)
			}
		},
		computed: {
			isHasDiscountPrice() {
				// return this.discountMoney != this.money || this.discountScore != this.score
				return ( isNumber(this.discountMoney) || isNumber(this.discountScore)) && (this.discountMoney != this.money || this.discountScore != this.score)
			},
			money() {
				return this.info[this.moneyKey || (this.prefix + 'money_price')]
			},
			score() {
				return this.info[this.scoreKey || (this.prefix + 'score_price')]
			},
			discountMoney() {
				return this.info[this.discountPrefix + 'money_price']
			},
			discountScore() {
				// console.log(this.info[this.discountPrefix + 'score_price'])
				return this.info[this.discountPrefix + 'score_price']
			},
			// color () {
			// 	return this.theme == 'red' ? '#FF294A' : '#666'
			// }
		}
	}
</script>

<style lang="scss" scoped>
	.product-price {
		flex: 0 0 200px;
	}

	.price {
		font-weight: 400;
		color: '#FF294A';
	}

	span {
		margin: 0px;
		padding: 0px;
	}

	.line-price {
		font-size: 80%;
		color: #a0a0a0;
		text-decoration: line-through;
	}

	.symbol {
		font-size: 80%;
	}

	.symbol-text {
		font-size: 70%;
	}
</style>
