
import {request} from '@/utils/request.js'

// 查询
export function getExpenses(params) {
	return request({
		api: "/theory-admin/business/expenses/list",
		method: "get",
		data: params,
		loading: true
	});
}
// 新增
export function addExpenses(params) {
	return request({
		api: "/theory-admin/business/expenses",
		method: "post",
		data: params,
		loading: true
	});
}
// 修改
export function editExpenses(params) {
	return request({
		api: "/theory-admin/business/expenses",
		method: "put",
		data: params,
		loading: true
	});
}

// 删除
export function deleteExpenses(params) {
	return request({
		api: "/theory-admin/business/expenses/"+params.id,
		method: "delete",
		data: params,
		loading: true
	});
}
// 详情
export function expensesDetail(params) {
	return request({
		api: "/theory-admin/business/expenses/"+params.id,
		method: "post",
		data: params,
		loading: true
	});
}
/**
 * @param 获取所有分公司
 */
export function getCompanylist() {
	return request({
		api: "/theory-admin/system/dept/companylist",
		method: "get",
		loading: true
	});
}
