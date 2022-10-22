import request from "../utils/request.js";

export async function getIPS() {
	return await request({
		url: `/IPs`,
		method: 'get'
	})
}