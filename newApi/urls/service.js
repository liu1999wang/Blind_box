module.exports = {
	'show': ['GET', '/service'],
	order: {
		'show': ['GET', '/service-orders/{uuid}'],
		'list': ['GET', '/service-orders'],
		'preview': ['POST', '/service-preview-order'],
		'store': ['POST', '/service-orders']
	}
}