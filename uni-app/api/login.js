import { request,accountInfo } from "@/utils/request.js";
import { setCache,getCache,weixinAPI,openPage } from "@/utils/index.js";

export const loginWX = async () => {
	let result = await loginByCode()
	if(result.data.access_token){
		saveLoginInfo(result)
		return true
	}else{
		uni.redirectTo({
			url: '/pages/login/index'
		})
		return false
	}
};
// 通过code登录
const loginByCode = async ()=>{
	const wxInfo = await weixinAPI({api:'login'})
	return request({api:'/theory-admin/auth/wxmini/openid',method:'post',data:{code:wxInfo.code}})
}
// 通过账号密码登录
export const loginByPassword = async (form)=>{
	const wxInfo = await loginByCode({api:'login'})
	if(typeof wxInfo.data === 'string'){
		form.openid = wxInfo.data
	}else{
		form.openid = wxInfo.data.openid
	}
	const result = await request({api:'/theory-admin/auth/wxmini/bindUser',method:'post',data:form})
	saveLoginInfo(result)
}
const saveLoginInfo = (result)=>{
	setCache("loginInfo", { token: result.data.access_token, client_id: result.data.client_id, validTime: result.data.expire_in ? result.data.expire_in : 24 });
}
// 获取用户信息并保存storage
export const getUserInfo = async ()=>{
	let userInfo = getCache('userInfo')
	if(!userInfo){
		userInfo = await request({api:'/theory-admin/system/user/getInfo'})
	}
	// 没有手机号就要跳到登录页面进行登录
	// if(!userInfo.data.user.phonenumber){
	// 	return openPage({url:'/pages/login/index'})
	// }
	setCache('userInfo',userInfo)
	return userInfo
}

export const logout = ()=>{
	return request({
		api: "/theory-admin/auth/logout",
		method: "post",
		loading: true
	});
	
}