import {request} from './request.js'
export const updateManager = wx.getUpdateManager()
export let mySystemInfo = {}
export const myShowToast = function(msg,icon,duration){
	if(msg && msg.length > 25 && mySystemInfo.platform === 'ios'){
		wx.showModal({
		        title: "信息提示",
		        showCancel: false,
		        content: msg,
		    })
		
	}else{
		setTimeout(() => {
			uni.showToast({
				icon: icon?icon:"none",
				title: `${msg}`,
				duration: duration?duration:2500
			})
		}, 100)

	}
}
export const openPage = function (item){
	let {url,toType,to_type,...params} = item
	toType = toType?toType:to_type
	if(!url){
		return
	}
	const paramsUrl = Object.keys(params).map(x=>{
		return `${x}=${params[x]}`
	}).join("&")
	if(!url.includes('/')){
		url = '/pages/'+url+'/index'
	}
	url = url+"?"+paramsUrl
	console.log(66666, url,toType,to_type,params)
	if (!toType || toType == "navigateTo"){
		uni.navigateTo({
			url: url,
			fail(err){
				uni.switchTab({
					url: url
				})
			}
		});
	}else if(toType == "switchTab"){
		uni.switchTab({
			url: url,
			fail(err){
				uni.navigateTo({
					url: url
				})
			}
		});
	}else{
		uni.reLaunch({
			url: url
		});
	}
}
export const getWxLocation = function(params){
	return new Promise((resolve,reject)=>{
		wx.getLocation({
			type: 'gcj02',
			// altitude: true,
			// isHighAccuracy: true,
			// type: 'wgs84',
			success: res => {
				//这里是获取成功的时候
				request({api:"weixin/location",method:'post',data:res});
				resolve(true)
			},
			fail(res) {
				//这里是获取失败的时候
				wx.getSetting({
					success: res => {
						if (typeof(res.authSetting['scope.userLocation']) != 'undefined' && !res.authSetting['scope.userLocation']) {
							// 用户拒绝了授权
							uni.showModal({
								title: '是否授权当前位置',
								content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
								success: res => {
									if (res.confirm) {
										//打开设置 让用户点击允许 这样可以重新获取
										uni.openSetting({
											success: res => {
												if (!res.authSetting['scope.userLocation']) {
													// 没有允许定位权限
													myShowToast("没有授权，无法进行下一步")
												}
											}
										});
									} else {
										// 没有允许定位权限
										myShowToast("取消授权，无法进行下一步")
									}
								}
							});
						}
					}
				});
				resolve(false)
			}
		})
	})
}
export const weixinAPI = function(params){
	const {api,...option} = params
	return new Promise((resolve,reject)=>{
		uni[api]({
			...option,
			success: res => {
				resolve(res)
			},
			fail: (err) => {
				reject(err)
			},
			complete: (res) => {
				console.log(`[${api}]微信接口请求完毕！！！返回值：`,res)
			}
		});
	})
}
export const saveImage = function (url){
	return new Promise((resolve,reject)=>{
		uni.showLoading({
			title: '正在保存图片...'
		});
		//获取用户的当前设置。获取相册权限
		uni.getSetting({
			success: (res) => {
				//如果没有相册权限
				if (!res.authSetting["scope.writePhotosAlbum"]) {
					//向用户发起授权请求
					uni.authorize({
						scope: "scope.writePhotosAlbum",
						success: () => {
							savePic(url,resolve,reject)
						},
						//授权失败
						fail: () => {
							uni.hideLoading();
							uni.showModal({
								title: "您已拒绝获取相册权限",
								content: "是否进入权限管理，调整授权？",
								success: (res) => {
									if (res.confirm) {
										//调起客户端小程序设置界面，返回用户设置的操作结果。（重新让用户授权）
										uni.openSetting({
											success: (res) => {
											console.log(res.authSetting);
											},
										});
									} else if (res.cancel) {
										myShowToast("已取消")
									}
									reject(res)
								},
							});
						},
					});
				} else {
					//如果已有相册权限，直接保存图片到系统相册
					savePic(url,resolve,reject)
				}
			},
			fail: (res) => {
				uni.hideLoading();
				reject(res)
			},
		});
	})
}
const savePic = function(url,resolve,reject){
	uni.getImageInfo({
		src: url,
		success: function (sres) {
			//授权成功保存图片到系统相册
			uni.saveImageToPhotosAlbum({
				//图片路径，不支持网络图片路径
				filePath: sres.path,
				success: (res) => {
					myShowToast("保存成功")
					resolve(true)
				},
				fail: (res) => {
					myShowToast("保存失败", 'error')
					reject(res)
				},
				complete: (res) => {uni.hideLoading();},
			});
		},
		fail: (sres) => {
			myShowToast("加载图片失败", 'error')
			reject(sres)
		}
	})
}
export const setCache = function (key,value){
	if(typeof value === 'object'){
		value._setCreateTime = Date.now()
		value._setValidTime = value.validTime || 1000 * 60 * 10 // 默认过期时间为10分钟
	}
	uni.setStorageSync(key,value);
}
export const getCache = function (key){
	const value = uni.getStorageSync(key);
	if(value){
		if(Date.now()-value._setCreateTime>value._setValidTime){
			return null // 过期
		}else{
			return value
		}
	}else{
		return null
	}
	return value
}
export const removeCache = function (key){
	if(key){
		uni.removeStorageSync(key);
	}else{
		uni.clearStorageSync()
	}
}
export const clip = function(text){
	uni.showLoading({title: '加载中...'});
	wx.setClipboardData({
		data: text,
		success: function () {
			uni.hideLoading()
			myShowToast("复制成功")
		}
	})
}
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}
export function compressImg (img, fn) {
  const selectorQuery = uni.createSelectorQuery()
  selectorQuery.select('#canvas')
    .fields({node: true, size: true})
    .exec(res => {
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      canvas.height = img.height
      canvas.width = img.width

      let seal = canvas.createImage();
      seal.src = img.path;
      seal.onload = () => {
        ctx.drawImage(seal, 0, 0, img.width, img.height)
        const url = canvas.toDataURL('image/jpeg', .1)
        fn(url)
      }
    })
}
// 图片转base64方法
export const imgToBase64 = async function (url, callback) {
	const sres = await weixinAPI({api:'getImageInfo',src:url})
	uni.getFileSystemManager().readFile({
			filePath: sres.path, //选择图片返回的相对路径
			encoding: 'base64', //编码格式
			success: res => { //成功的回调
			let base64 = 'data:image/jpeg;base64,' + res.data //不加上这串字符，在页面无法显示的哦
			callback && callback(base64)
		},
		fail: (e) => {
			console.log("图片转换失败",e);
		}
	})
}
export const scrollToBottom = function(duration=300){
	const query = uni.createSelectorQuery();
	query.select('#scroll').boundingClientRect((rect) => {
	  if (rect) {
		  setTimeout(()=>{
			uni.pageScrollTo({
			  scrollTop: rect.height,
			  duration // 滚动动画持续时间，单位 ms
			});
		  })
	  }
	});
	query.exec();
}