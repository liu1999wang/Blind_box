import request from "../utils/request.js";
const URL = "/products"

export async function getProductList(paramter) {
	let res = await request({
		url: `${URL}`,
		method: 'get',
		data: paramter
	})
	return res
}

export async function getProductInfo(uuid) {
	return await request({
		url: `${URL}/${uuid}`,
		method: 'get'
	})
}

export function createOrder(paramter) {
	return request({
		url: `/product-orders`,
		method: 'post',
		data: paramter
	})
}
