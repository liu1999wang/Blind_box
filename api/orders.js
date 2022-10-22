import request from "../utils/request.js";

// 获取订单列表
export function getOrderList(paramter) {
	return request({
		url: `/orders`,
		method: 'get',
		data: paramter
	})
}

// 预览订单信息
export function previewOrder(paramter) {
	return request({
		url: `/preview-orders`,
		method: 'post',
		data: paramter
	})
}

// 创建订单
export function createOrder(paramter) {
	return request({
		url: `/orders`,
		method: 'post',
		data: paramter
	})
}

// 获取订单支付信息
export function getOrderPaymentInfo(uuid) {
	return request({
		url: `/orders/` + uuid + '/payment',
		method: 'post'
	})
}

// 发起订单支付
export function payOrder(paramter, uuid) {
	return request({
		url: `/orders/` + uuid + '/payment-config',
		method: 'post',
		data: paramter
	})
}

// 获取订单详情
export function getOrderInfo(uuid) {
	return request({
		url: `/orders/` + uuid,
		method: 'get'
	})
}

// 获取取消订单理由
export function getCancelReasons() {
	return request({
		url: `/close-order-reasons`,
		method: 'get'
	})
}

// 取消订单
export function cancelOrder(uuid) {
	return request({
		url: `/orders/${uuid}`,
		method: 'put',
		data: {
			type: "close"
		}
	})
}

// 确认收货
export function confirmOrder(uuid) {
	return request({
		url: `/orders/${uuid}`,
		method: 'put',
		data: {
			type: "complete"
		}
	})
}

// 获取评论的sku
export function getCommentSkus(uuid) {
	return request({
		url: `/orders/${uuid}/comment-skus`,
		method: 'get'
	})
}

// 提交评价
export function postComment(paramter, uuid) {
	return request({
		url: `/orders/${uuid}/comments`,
		method: 'post',
		data: paramter
	})
}