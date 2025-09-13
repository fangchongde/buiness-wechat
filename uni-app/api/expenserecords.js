
import {request} from '@/utils/request.js'

// 查询
export function getExpenserecords(params) {
	return request({
		api: "/theory-admin/business/expenserecords/list",
		method: "get",
		data: params,
		loading: true
	});
}
// 新增
export function addExpenserecords(params) {
	return request({
		api: "/theory-admin/business/expenserecords",
		method: "post",
		data: params,
		loading: true
	});
}
// 修改
export function editExpenserecords(params) {
	return request({
		api: "/theory-admin/business/expenserecords",
		method: "put",
		data: params,
		loading: true
	});
}

// 删除
export function deleteExpenserecords(params) {
	return request({
		api: "/theory-admin/business/expenserecords/"+params.id,
		method: "delete",
		data: params,
		loading: true
	});
}
// 详情
export function expenserecordsDetail(params) {
	return request({
		api: "/theory-admin/business/expenserecords/"+params.id,
		method: "post",
		data: params,
		loading: true
	});
}
