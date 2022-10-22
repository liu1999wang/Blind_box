import request from "../utils/request.js";

export function userLogin(type, paramter) {
	return request({
		url: `/login/${type}`,
		method: 'post',
		data: paramter
	})
}

// 获取用户信息
export async function getUserInfo() {
	return await request({
		url: `/user`,
		method: 'get'
	})
}

// 获取用户优惠券
export function getUserCoupons(parameter) {
	return request({
		url: `/my-coupons`,
		method: 'get',
		data: parameter
	})
}

// 签到
export async function userSignIn() {
	return await request({
		url: `/sign-in`,
		method: 'post'
	})
}

// 获取用户明细
export async function getScoreRecord(parameter) {
	return await request({
		url: '/asset-records/score',
		method: 'get',
		data: parameter
	})
}

// 获取用户红包明细
export async function getRedpackRecord(parameter) {
	return await request({
		url: '/asset-records/redpack',
		method: 'get',
		data: parameter
	})
}