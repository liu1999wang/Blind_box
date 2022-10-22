import request from "../utils/request.js";

export async function getProtocol(type) {
	return await request({
		url: `/pages/${type}`,
		method: 'get'
	})
}