module.exports = {
	order: {
		store: ['POST', '/groupon-orders'],
	},
	record: {
		show: ['GET', '/groupon-records/{uuid}'],
		list: ['GET', '/groupon-records']
	},
	preview_order: {
		store: ['POST', '/preview-groupon-orders']
	}
}