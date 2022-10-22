
module.exports = {
	solution: {
		info: ['GET', '/my-solution']
	},
	clockIn: {
		get_record: ['GET', '/clock-in-record']
	},
	setting: {
		shopBanner: {
			index: ['GET', '/setting/shop-banner']
		}
	},
	previewOrder: {
		check_address: ['POST', '/check-address']
	},
}