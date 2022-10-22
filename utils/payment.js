// #ifdef H5
import $wechatJsTool from "@/utils/wechat.js"
// #endif

import request from '@/utils/request.js'

module.exports = {
	pay (options) {
		console.log(options)
		// 支付方式
		let payType = options.pay_type || 'wechat'
		
		// 支付方式待选择
		if (payType === 'select_pending') {
			this.selectPayMethod(options)
			return false
		}
		
		// #ifdef MP-WEIXIN
		// 微信系支付
		uni.requestPayment({
			...options.pay_config,
			success: () => {
				options.success && options.success()
			},
			fail: () => {
				options.fail && options.fail()
			}
		})
		// #endif
		
		// #ifdef MP-ALIPAY
		// 支付宝小程序
		my.tradePay({
		  // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
		  tradeNO: options.pay_config.trade_no,
		  success: (res) => {
			if (res.resultCode === '9000') {
				// 只有结果码为9000才是成功支付
				options.success && options.success()
			}
		    else {
				options.fail && options.fail()
			}
		  },
		  fail: (res) => {
			options.fail && options.fail()
		  }
		})
		// #endif
		
		// #ifdef APP-PLUS
		if (payType === 'wechat') {
			// 微信系支付
			uni.requestPayment({
				"provider": "wxpay",
				"orderInfo": options.pay_config,
				success: () => {
					options.success && options.success()
				},
				fail: (e) => {
					// uni.showModal({
					// 	title: JSON.stringify(e)
					// })
					console.log('支付出错:', JSON.stringify(e))
					options.fail && options.fail()
				}
			})
		}
		else if (payType === 'alipay') {
			// 支付宝支付
			uni.requestPayment({
				"provider": "alipay",
				"orderInfo": options.pay_config,
				success: (res) => {
					// console.log('success:' + JSON.stringify(res));
					options.success && options.success()
				},
				fail: (e) => {
					// uni.showModal({
					// 	title: JSON.stringify(e)
					// })
					// console.log('支付出错:', JSON.stringify(e))
					uni.showToast({
						title: '支付取消',
						icon: 'none'
					})
					options.fail && options.fail()
				}
			})
		}
		// #endif
		
		// #ifdef MP-TOUTIAO
		// 头条系支付		
		uni.requestPayment({
			orderInfo: options.pay_config,
			// _debug: 1,
			service: 5,
			success: (res) => {
				console.log(res)
				// 只有code为0时为支付成功
				if (res.code === 0) {
					options.success && options.success()
				}
				else {
					options.fail && options.fail()
				}
			},
			fail: (err) => {
				options.fail && options.fail()
			}
		})
		// #endif
		
		// #ifdef MP-KUAISHOU
		// 快手支付		
		console.log('ks  =>',  ks)
		ks.pay({
			orderInfo: options.pay_config,
			serviceId: 1,
			success: (res) => {
				options.success && options.success()
			},
			fail: (res) => {
				options.fail && options.fail()
			},
			complete: (res) => {
			}
		})
		// #endif
		
		// #ifdef H5
		let url = options.pay_config.url
		if (url) {
			// 跳转
			window.location.href = url;
		}
		else {
			$wechatJsTool.pay(options.pay_config, {
				success: () => {
					options.success && options.success()
				},
				fail: () => {
					options.fail && options.fail()
				}
			})
		}
		// #endif
	},
	selectPayMethod(options) {
		
		uni.showActionSheet({
			itemList: ['支付宝支付', '微信支付'],
			success: (res) => {
				let payTypeList = ['alipay', 'wechat']
				let payType = payTypeList[res.tapIndex]
				// console.log(`/orders/${options.order.uuid}/payment-config`)
				
				uni.showLoading({
					title: '加载中~'
				})
				
				request(`/orders/${options.order.uuid}/payment-config`, 'POST', {
					pay_type: payType
				}).then(r => {
					uni.hideLoading()
					// console.log('rrrrr ==>', r)
					options = {
						...options,
						...r.data
					}
					this.pay(options)
				})
			},
			fail: (res) => {
				console.log(res.errMsg);
			}
		})
		
	}
}
