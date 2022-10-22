import request from "../utils/request.js";
const URL = "/addresses"

export function createAddress(parameter) {
	return request({
		url: URL,
		method: 'post',
		data: parameter
	})
}

export function getAddressList(parameter) {
	return request({
		url: URL,
		method: 'get',
		data: parameter
	})
}

export function deleteAddress(uuid) {
	return request({
		url: `${URL}/${uuid}`,
		method: 'delete'
	})
}

export function updateAddress(parameter, uuid) {
	return request({
		url: `${URL}/${uuid}`,
		method: 'put',
		data: {
			type: 'update',
			attributes: parameter
		}
	})
}
