
import {request} from '@/utils/request.js'

// 查询
export function getIncomerecords(params) {
	return request({
		api: "/theory-admin/business/incomerecords/list",
		method: "get",
		data: params,
		loading: true
	});
}
// 新增
export function addIncomerecords(params) {
	return request({
		api: "/theory-admin/business/incomerecords",
		method: "post",
		data: params,
		loading: true
	});
}
// 修改
export function editIncomerecords(params) {
	return request({
		api: "/theory-admin/business/incomerecords",
		method: "put",
		data: params,
		loading: true
	});
}

// 删除
export function deleteIncomerecords(params) {
	return request({
		api: "/theory-admin/business/incomerecords/"+params.id,
		method: "delete",
		data: params,
		loading: true
	});
}
// 详情
export function incomerecordsDetail(params) {
	return request({
		api: "/theory-admin/business/incomerecords/"+params.id,
		method: "post",
		data: params,
		loading: true
	});
}