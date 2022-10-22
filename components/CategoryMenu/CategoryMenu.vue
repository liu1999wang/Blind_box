<template>
	<view class="category-menu">
		<view class="item" @tap="all">
			<image src="/static/c1.png"></image>
			<text>ALL</text>
		</view>

		<view class="item" v-for="(item,index) in list" :key="index" :data-item="item"
		 @tap="handleClick">
			<view class="ip-thumb" :class="{active:current == item.id}">
				<image :src="item.thumb + '?x-oss-process=style/thumb_250'"></image>
			</view>
			<text>{{item.title}}</text>
		</view>

		<view class="item" @tap="more">
			<image src="/static/c6.png"></image>
			<text>更多</text>
		</view>
	</view>
</template>

<script>
	import {
		getIPS
	} from "../../api/ips.js"
	export default {
		name: "CategoryMenu",
		computed: {
			list() {
				return this.$store.getters.ips.slice(0, 4);
			},
			current() {
				return this.$store.getters.currentIP.id || "";
			}
		},
		methods: {
			handleClick(e) {
				this.$store.dispatch("setCurrentIP", e.currentTarget.dataset.item)
			},
			all() {
				this.$store.dispatch("setCurrentIP", {})
			},
			more(e) {
				this.$emit("show-more", {
					title: "更多"
				})
			}
		}
	}
</script>

<style lang="scss">
	.category-menu {
		margin-top: 6rpx;
		display: flex;
		padding: 24rpx;
		display: flex;
		justify-content: space-between;

		.item {
			padding: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			
			.ip-thumb {
				width: 90rpx;
				height: 90rpx;
				
				&.active {
					position: relative;
					&:after {
						content: "";
						position: absolute;
						top: -2px;
						left: -2px;
						width: 100%;
						height: 100%;
						border: 2px solid #ffcc00;
						border-radius: 50%;
					}
				}
			}

			image {
				width: 90rpx;
				height: 90rpx;
				border-radius: 50%;
			}

			text {
				margin-top: 10rpx;
				color: #000;
				font-size: 22rpx;
				line-height: 30rpx;
			}
		}
	}
</style>
