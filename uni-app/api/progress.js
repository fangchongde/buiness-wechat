import {request} from '@/utils/request.js'

// 查询
export function getProgress(params) {
	return request({
		api: "/theory-admin/business/progress/list",
		method: "get",
		data: params,
		loading: true
	});
}
// 新增
export function addProgress(params) {
	return request({
		api: "/theory-admin/business/progress",
		method: "post",
		data: params,
		loading: true
	});
}
// 修改
export function editProgress(params) {
	return request({
		api: "/theory-admin/business/progress",
		method: "put",
		data: params,
		loading: true
	});
}

// 删除
export function deleteProgress(params) {
	return request({
		api: "/theory-admin/business/progress/"+params.id,
		method: "delete",
		data: params,
		loading: true
	});
}
// 详情
export function progressDetail(params) {
	return request({
		api: "/theory-admin/business/progress/"+params.id,
		method: "post",
		data: params,
		loading: true
	});
}
