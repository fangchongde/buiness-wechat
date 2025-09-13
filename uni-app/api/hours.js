
import {request} from '@/utils/request.js'

// 查询
export function getHours(params) {
	return request({
		api: "/theory-admin/business/hours/list",
		method: "get",
		data: params,
		loading: true
	});
}
// 新增
export function addHours(params) {
	return request({
		api: "/theory-admin/business/hours",
		method: "post",
		data: params,
		loading: true
	});
}
// 修改
export function editHours(params) {
	return request({
		api: "/theory-admin/business/hours",
		method: "put",
		data: params,
		loading: true
	});
}

// 删除
export function deleteHours(params) {
	return request({
		api: "/theory-admin/business/hours/"+params.id,
		method: "delete",
		data: params,
		loading: true
	});
}
// 详情
export function hoursDetail(params) {
	return request({
		api: "/theory-admin/business/hours/"+params.id,
		method: "post",
		data: params,
		loading: true
	});
}
/**
 * @param 获取公司下所有用户信息
 */
export function getUserListByBranchId(branchId) {
	return request({
		api: "/theory-admin/system/user/list/company/"+branchId,
		method: "get",
		loading: true
	});
}
