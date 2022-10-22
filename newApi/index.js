import request from "../utils/request.js"

import importAll from './importAll'
const urls = importAll(require.context('./urls', true, /\.js$/))

module.exports = {
	emit (path, uuid = false, bodyParam = {}) {
		
		if (typeof(uuid) === 'object') {
			bodyParam = uuid
			uuid = false
		}

		let action = path.split('.')
		
		let arr = urls
		for (let i = 0; i < action.length; i++) {
			arr = arr[action[i]]
		}

		let method = arr[0]
		let url = arr[1]
		
		if (uuid)
			url = url.replace('{uuid}', uuid)
		
		// update里参数处理
		if (method === 'PUT') {
			if (action[1] === 'update') {
				bodyParam = {
					type: 'update',
					attributes: bodyParam
				}
			}
			else {
				bodyParam = {
					type: action[action.length - 1],
					...bodyParam
				}
			}
		}
		
		// for (let index in urlParam ) {
		// 	url.replace(`{${index}}`, urlParam[index])
		// }
		
		return request({
			url: url,
			method: method,
			data: bodyParam
		})
	}
}
