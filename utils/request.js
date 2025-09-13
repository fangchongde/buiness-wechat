
import {getCache,setCache,removeCache,openPage,myShowToast} from './index.js'
import {loginWX} from '@/api/login.js'
// const baseURL = 'http://192.168.2.58:8888'
export let baseURL = 'https://yanyin.test.baminute.com'

// 动态获取配置文件
export let extConfig  = wx.getExtConfigSync? wx.getExtConfigSync(): {}
if (wx.getExtConfig && !extConfig) {
  wx.getExtConfig({
    success (res) {
		extConfig  = res.extConfig
    }
  })
}
// 动态获取请求链接
if (extConfig) {
	if(extConfig.base_url){
		baseURL = extConfig.base_url
	}
}

export let mySystemInfo = {}
wx.getSystemInfo({
	success: function (res) {
		mySystemInfo  = res
	}
})

export const accountInfo = wx.getAccountInfoSync();
// 用户授权解析地址
export const WX_AUTH_URL = 'https://api.weixin.qq.com/sns/jscode2session'
// 版本号
export const version =  accountInfo.miniProgram.version? accountInfo.miniProgram.version:"1.0.1"
// 请求白名单，不需要登录信息
const whiteList = ['/theory-admin/auth/wxmini/bindUser','/theory-admin/auth/wxmini/openid']
// 请求库
export const request =async function (params){
	let {api,method,data,header={},showErrorToast=true} = params
	// // 非登录接口 检查有没有登录
	var loginInfo = getCache('loginInfo')
	if(!whiteList.includes(api) && !loginInfo){
		await loginWX()
		loginInfo = getCache('loginInfo')
		if(!loginInfo){
			// 如果登录了还是没有用户信息，则为用户没有注册，跳到登录页面
			return
		}
	}
	if(loginInfo){
		header.Authorization = 'Bearer ' +  loginInfo.token
		header.Clientid = loginInfo.client_id
	}
	// header.Authorization = 'Bearer ' +  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJzeXNfdXNlcjoxIiwicm5TdHIiOiJNeURhRE5aV05aQXR3NVVySjR6bjFCMnJiVzJiMEltSyIsImNsaWVudGlkIjoiZTVjZDdlNDg5MWJmOTVkMWQxOTIwNmNlMjRhN2IzMmUiLCJ0ZW5hbnRJZCI6IjAwMDAwMCIsInVzZXJJZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsImRlcHRJZCI6MTAzLCJkZXB0TmFtZSI6IueglOWPkemDqOmXqCIsImRlcHRDYXRlZ29yeSI6IiJ9.Y-gWlSRos86Sv2N9_WK299cQ20zDIUGRvuFDCQt6png'
	// header.Clientid = 'e5cd7e4891bf95d1d19206ce24a7b32e'
	return new Promise((resolve,reject)=>{
		uni.showLoading({title: '加载中...'});
		uni.request({
			header,
			url: baseURL+api,
			method: method || 'GET',
			data,
			success: res => {
				res = res.data;
				if(res.code == '200'){
					uni.hideLoading();
					resolve(res)
				}else if(res.code =='401'){
					myShowToast(res.msg)
					uni.redirectTo({
						url: '/pages/login/index'
					})
				}else if(res.code =='403'){
					myShowToast(res.msg)
					uni.redirectTo({
						url: '/pages/403/index'
					})
				}else{
					if(showErrorToast){
						myShowToast(res.msg)
					}
					reject(res.msg)
				}
			},
			fail: (err) => {
				// console.log(err, 'err');
				handlerError(err.errMsg)
				reject(err)
			},
			complete: (res) => {
				uni.hideLoading();
				console.log(`[${api}]请求服务端接口完毕！！！返回值：`,res.data)
			}
		});
	})
}
//上传文件
export const uploadFile =async function(data){
	console.log(data, 'data');
	return new Promise(async (resolve,reject)=>{
	let header = {}
		var loginInfo = getCache('loginInfo')
	if( !loginInfo){
		await loginWX()
		loginInfo = getCache('loginInfo')
	}
	if(loginInfo){
		header.Authorization = 'Bearer ' +  loginInfo.token
		header.Clientid = loginInfo.client_id
	}


	// 	header.Authorization = 'Bearer ' +  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJzeXNfdXNlcjoxIiwicm5TdHIiOiJNeURhRE5aV05aQXR3NVVySjR6bjFCMnJiVzJiMEltSyIsImNsaWVudGlkIjoiZTVjZDdlNDg5MWJmOTVkMWQxOTIwNmNlMjRhN2IzMmUiLCJ0ZW5hbnRJZCI6IjAwMDAwMCIsInVzZXJJZCI6MSwidXNlck5hbWUiOiJhZG1pbiIsImRlcHRJZCI6MTAzLCJkZXB0TmFtZSI6IueglOWPkemDqOmXqCIsImRlcHRDYXRlZ29yeSI6IiJ9.Y-gWlSRos86Sv2N9_WK299cQ20zDIUGRvuFDCQt6png'
	// header.Clientid = 'e5cd7e4891bf95d1d19206ce24a7b32e'
		uni.showLoading({title: '上传中...'});
		let params = {
			header,
			url:baseURL+'/theory-admin/resource/oss/upload',
			filePath:data.filePath,
			formData: data.formData,
			name:data.name,
			success:res=>{
				console.log(res, 'resres');
				if(typeof res.data === 'string'){
					res.data = JSON.parse(res.data)
				}
				res = res.data
				if(res.code != '200'){
					myShowToast(res.msg)
					reject(res.msg)
				}else{
					uni.hideLoading();
					resolve(res)
				}
			},
			fail: (err) => {
				handlerError(err.errMsg)
				reject(err)
			},
			complete: (res) => {
				console.log(`[uploadpictures]请求服务端接口完毕！！！返回值：`,res.data)
			}
		}
		uni.uploadFile(params)
	})
}
//错误处理
const handlerError = function(errMsg){
	console.log("errMsg错误信息！！！！",errMsg)
	if(errMsg && errMsg.includes('invalid url')){
		const errDetail = errMsg.split("url")
		uni.showToast({
			icon:'none',
			duration:2000,
			title: `404 接口：${errDetail[1]}`,
		});
	}else{
		uni.showToast({
			icon:'none',
			duration:2000,
			title: `未知错误：${errMsg}`,
		});
	}
}