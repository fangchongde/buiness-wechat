import {request} from '@/utils/request.js'
import { getCache } from '@/utils/index.js'
// 获取字典列表
export function getDict(dictType) {
	return request({
		api: "/theory-admin/system/dict/data/list",
		method: "get",
		data: {
			pageNum:"1",
			pageSize:"100",
			dictType
		},
		loading: true
	});
}

// 批量获取字典列表
export async function batchGetDict(dictType) {
	if(dictType && dictType.length>0){
		const dicts = await Promise.all(dictType.map(x=>getDict(x)))
		return dicts
	}
}
// 字典翻译
export function translateDict(dictType,value) {
	const dict = getCache('dict')
	const currentDict = dict[dictType].find(x=>x.value === value)
	return currentDict.text
}
