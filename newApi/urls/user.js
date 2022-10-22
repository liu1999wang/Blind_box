module.exports = {
	info: ['GET', '/user'],
	login: ['POST', '/login/with-miniapp'],
	update: ['PUT', '/user'],
	memberCard: {
		check: ['POST', '/member-card/check'],
		get_form: ['POST', '/member-card/get-form'],
		pick: ['POST', '/member-card/pick']
	},
	coupon: {
		list: ['GET', '/my-coupons']
	},
}