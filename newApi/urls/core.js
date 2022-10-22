module.exports = {
	withdraw: {
		store: ['POST', '/withdraw'],
		list: ['GET', '/withdraw-records']
	},
	asset: {
		show: ['GET', '/asset-balance']
	},
	visitor: {
		store: ['POST', '/visitors']
	},
	couponCode: {
		check_usable: ['POST', '/coupon-code-usable']
	},
	coupon: {
		show: ['GET', '/coupons/{uuid}'],
		pick: ['POST', '/coupons/{uuid}/pick'],
	},
	message: {
		index: ['GET', '/messages'],
		destory: ['DELETE', '/messages/{uuid}'],
		read: ['PUT', '/messages/{uuid}']
	},
	subscribe: {
		send: ['POST', '/subscribe/send']
	},
	agent: {
		record: {
			index: ['GET', '/agent-records'],
		},
		setting: {
			show: ['GET', '/agent/setting']
		}
	}
}