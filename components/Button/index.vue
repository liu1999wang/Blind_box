<template>
	<button class="i-button" :class="classList" :hover-class="disabled?'none':'hover'" @tap="handleClick" :open-type="openType">
		<slot></slot>
	</button>
</template>

<script>
	export default {
		name: "IButton",
		props: {
			iClass: {
				type: String
			},
			long: {
				type: Boolean
			},
			radius: {
				type: Boolean
			},
			round: {
				type: Boolean
			},
			size: {
				type: String,
				default: 'medium'
			},
			disabled: {
				type: Boolean,
				default: false
			},
			openType: {
				type: String,
				default: ''
			}
		},
		computed: {
			classList() {
				return [
					this.iClass,
					this.long ? "long": "",
					this.size,
					this.radius ? "radius": "",
					this.round ? "round": ""
				]
			}
		},
		methods: {
			handleClick() {
				if (this.disabled) return
				this.$emit('click', {})
			}
		}
	}
</script>

<style lang="scss">
	.i-button {
		padding: 0 50upx;
		margin: 0;
		border-radius: 0;
		background-color: $theme-color;
		text-align: center;
		color: #FFFFFF;

		&::after {
			border: none;
		}
		
		&.long {
			width: 100%;
		}

		&.round {
			border-radius: 5000upx!important;
		}

		&.large {
			padding: 0 60upx;
			height: 100upx;
			line-height: 100upx;
			font-size: 32upx;
			
			&.radius {
				border-radius: 10upx;
			}
		}

		&.medium {
			height: 90upx;
			line-height: 90upx;
			font-size: 30upx;
			
			&.radius {
				border-radius: 6upx;
			}
		}

		&.small {
			height: 80upx;
			line-height: 80upx;
			font-size: 28upx;
			
			&.radius {
				border-radius: 6upx;
			}
		}

		&.mini {
			height: 60upx;
			line-height:60upx;
			font-size: 24upx;
			
			&.radius {
				border-radius: 6upx;
			}
		}
	}
</style>
