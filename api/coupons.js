import request from "../utils/request.js";
const URL = "/coupons"
export function getCouponList(parameter) {
	return request({
		url: URL,
		method: 'get',
		data: parameter
	})
}

export async function getUsableCoupon(parameter) {
	return await request({
		url: '/usable-coupons',
		method: 'get',
		data: parameter
	})
}

export async function pickCoupon(code) {
	return await request({
		url: `/pick-coupon`,
		method: 'post',
		data: {
			code: code
		}
	})
}