module.exports = {
	index: ['GET', '/addresses'],
	update: ['PUT', '/addresses/{uuid}'],
	store: ['POST', '/addresses'],
	destory: ['DELETE', '/addresses/{uuid}']
}