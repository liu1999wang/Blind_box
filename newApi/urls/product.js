module.exports = {
	list: ['GET', '/shop/products'],
	show: ['GET', '/shop/products/{uuid}'],
	cart: {
		index: ['GET', '/cart-items'],
		store: ['POST', '/cart-items']
	}
}