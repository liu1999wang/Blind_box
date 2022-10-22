module.exports = {
	list: ['GET', '/orders'],
	store: ['POST', '/orders'],
	show: ['GET', '/orders/{uuid}'],
	payment_detail: ['POST', '/orders/{uuid}/payment'],
	pay_config: ['POST', '/orders/{uuid}/payment-config'],
	close: ['PUT', '/orders/{uuid}'],
	complete: ['PUT', '/orders/{uuid}'],
	destory: ['DELETE', '/orders/{uuid}'],
	cancel_reason: {
		list: ['GET', '/close-order-reasons']
	},
	preview: {
		store: ['POST', '/preview-orders']
	}
}