<template>
	<view class="container">
		<view class="form">
			<view class="form-item">
				<view class="label-title">
					收货人
				</view>
				<view class="form-item-value">
					<input type="text" v-model="form.consignee" placeholder="请填写收货人姓名" placeholder-class="placeholder" />
				</view>
			</view>
			<view class="form-item">
				<view class="label-title">
					手机号码
				</view>
				<view class="form-item-value">
					<input type="text" v-model="form.phone" placeholder="请填写收货人手机号" placeholder-class="placeholder" />
				</view>
			</view>
			<view class="form-item">
				<view class="label-title">
					所在地区
				</view>
				<view class="form-item-value">
					<picker mode="region" :value="defaultValue" @change="change">
						<view class="picker-content">
							<view class="picker-select" :class="{active:pickerSelected}">
								<text>{{pickerSelected||'请选择'}}</text>
							</view>
						</view>
					</picker>
				</view>
			</view>
			<view class="form-item">
				<view class="label-title">
					详细地址
				</view>
				<view class="form-item-value">
					<textarea v-model="form.address" placeholder="街道、楼牌号等" placeholder-class="text-placeholder" />
					</view>
			</view>
			<view class="form-item">
				<view class="label-title">
					标签
				</view>
				<view class="form-item-value">
					<view class="labels">
						<view class="label-item" :class="{active:form.tag===item}" v-for="item in tags" :data-tag="item" :key="item" @tap="handleClick">
							{{item}}
						</view>
					</view>
				</view>
			</view>
			<view class="form-item">
				<view class="label-title" style="width:200upx;">
					设为默认地址
				</view>
				<view class="form-item-value">
					<view class="switch">
						<switch :checked="form.is_default?true:false" color="#FFCC33" style="transform:scale(0.8)" @change="switchChange"/>
					</view>
				</view>
			</view>
		</view>
		
		<view class="footer safe-area-bottom">
			<view class="footer-button" @click="handleSubmit" hover-class="hover">
				<text>保存</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		createAddress,
		updateAddress
	} from "../../api/address.js"
	export default {
		data () {
			return {
				tags: ["家", "公司", "学校"],
				uuid: '',
				form: {
					consignee: '',
					phone: '',
					province: '',
					city: '',
					district: '',
					address: '',
					tag: '',
					is_default: 0
				}
			}
		},
		computed: {
			defaultValue() {
				return [this.form.province, this.form.city, this.form.district]
			},
			pickerSelected() {
				return this.form.province ? this.form.province + '-' + this.form.city + '-' + this.form.district : ''
			}
		},
		onLoad(e) {
			uni.setNavigationBarTitle({
				title: e.uuid ? "编辑收货地址" : "新建收货地址"
			})
			if (e.uuid) {
				this.uuid = e.uuid
				uni.setNavigationBarTitle({
					title: "编辑收货地址"
				})
				const address = this.$navigator.getParameters() || {}
				this.form = {
					consignee: address.consignee,
					phone: address.phone,
					province: address.province,
					city: address.city,
					district: address.district,
					address: address.address,
					tag: address.tag,
					is_default: address.is_default
				}
			}
		},
		methods: {
			handleClick(e) {
				this.form.tag = e.currentTarget.dataset.tag
			},
			switchChange(e) {
				this.form.is_default = e ? 1 : 0
			},
			change(e) {
				let value = e.detail.value
				this.form.province = value[0]
				this.form.city = value[1]
				this.form.district = value[2]
				
				// this.pickerSelected = value.join('-')
			},
			handleSubmit() {
				let form = this.form
				if (!form.consignee) {
					uni.showToast({
						title: '请填写收货人姓名',
						icon: 'none'
					})
					return
				}
				if (!(/^1\d{10}$/.test(form.phone))) {
					uni.showToast({
						title: '请填写正确的手机号',
						icon: 'none'
					})
					return
				}
				if (!this.pickerSelected) {
					uni.showToast({
						title: '请选择所在地区',
						icon: 'none'
					})
					return
				}
				if (!form.address) {
					uni.showToast({
						title: '请填写详细地址',
						icon: 'none'
					})
					return
				}
				uni.showLoading({
					title: '加载中'
				})
				if (this.uuid) {
					updateAddress(form, this.uuid).then(res => {
						uni.navigateBack({
							delta: 1
						})
					})
				} else {
					createAddress(form).then(res => {
						uni.navigateBack({
							delta: 1
						})
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	view {
		box-sizing: border-box;
	}
	.form {
		padding: 30upx 24upx;
	}
	.form-item {
		display: flex;
		justify-content: space-between;
		position: relative;
		border-bottom: 1px solid #f3f3f3;
		.label-title {
			width: 170upx;
			padding: 20upx 0;
			font-size: 26upx;
			line-height: 50upx;
		}
		
		.form-item-value {
			padding: 20upx 0;
			flex: 1;
			
			input {
				height: 50upx;
				line-height: 50upx;
				font-size: 28upx;
				width: 100%;
			}
			
			textarea {
				line-height: 50upx;
				font-size: 28upx;
				width: 100%;
				height: 150upx;
			}
			
			picker {
				width: 100%;
				.picker-content {
					height: 50upx;
					display: flex;
					align-items: center;
					justify-content: space-between;
					.picker-select {
						font-size: 28upx;
						color: #a0a0a0;
						
						&.active {
							color: #333;
						}
					}
				}
			}
			
			.text-placeholder {
				padding: 0;
				line-height: 50upx;
				color: #a0a0a0;
			}
			
			.labels {
				display: flex;
				
				.label-item {
					width: 100upx;
					height: 50upx;
					line-height: 50upx;
					text-align: center;
					background-color: #eee;
					color: #333;
					border-radius: 25upx;
					margin-right: 24upx;
					font-size: 24upx;
					
					&.active {
						background-color: #ffcc00;
						color: #fff;
					}
				}
			}
			
			.switch {
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}
		}
	}
	
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background-color: #fff;
	
		.footer-button {
			margin: 0 auto;
			margin-bottom: 60rpx;
			width: 500rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #ffcc00;
			box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			border-radius: 8rpx;
		}
	}
</style>
