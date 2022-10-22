import request from "../utils/request.js";

export async function getSwipers() {
	let res = await request({
		url: '/home-swiper',
		method: 'get'
	})
	return res
}

export async function getHomeProductList(parameter) {
	let res = await request({
		url: '/boxes',
		method: 'get',
		data: parameter
	})
	return res
}

export async function getDanmus() {
	let res = await request({
		url: `/danmus`,
		method: 'get'
	})
	return res
}
