
import {request} from '@/utils/request.js'

// 查询
export async function getProject(params) {
	const res = await request({
		api: "/theory-admin/business/projects/query",
		method: "get",
		data: params,
		loading: true
	});
	if(!res.rows){
		res.rows = res.data
	}
	return res
}
// 新增
export function addProject(params) {
	return request({
		api: "/theory-admin/business/projects",
		method: "post",
		data: params,
		loading: true
	});
}
// 修改
export function editProject(params) {
	return request({
		api: "/theory-admin/business/projects",
		method: "put",
		data: params,
		loading: true
	});
}

// 删除
export function deleteProject(params) {
	return request({
		api: "/theory-admin/business/projects/"+params.id,
		method: "delete",
		data: params,
		loading: true
	});
}
// 详情
export function projectDetail(params) {
	return request({
		api: "/theory-admin/business/projects/"+params.id,
		method: "post",
		data: params,
		loading: true
	});
}
