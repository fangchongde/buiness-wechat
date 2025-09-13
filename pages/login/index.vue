<template>
	<view class="container">
		<view style="position: relative;">
			<image src="https://shared.cdn.queniuqe.com/store_item_assets/steam/apps/1273400/ss_307bcfed98b63f356a9487780603a50be1e25a60.600x338.jpg?t=1717687062" mode="aspectFit">
				<!-- <view class="subTitle">
					烟印工序管理系统
				</view> -->
			</image>
		</view>
		<view class="login-form">
			<uv-input prefixIcon="account-fill" v-model="username" :customStyle="{height:'80rpx'}" placeholder="请输入账号" border="bottom"
				clearable></uv-input>
			<uv-input prefixIcon="lock-opened-fill" v-model="password" type="password" :customStyle="{height:'80rpx'}" placeholder="请输入密码" border="bottom"
				clearable>
			</uv-input>
		</view>
		<view style="margin-bottom: 100rpx">
			<uv-button type="primary" :loading="logining" style="background: #1D793C;" class="getPhoneNumberBtn" ref="phoneBtn"
				@click="preCheck">
				<view style="display: flex;align-items: center;justify-content: center;">
					<uv-icon color='#fff' size="20" name="weixin-fill"></uv-icon>
					<text style="margin-left: 20rpx;">登录</text>
				</view>
			</uv-button>
			<view class="readme">
				<uv-radio-group v-model="value">
					<uv-radio shape="circle" name="checked">
						<text>我已阅读并同意<text style="color: #2196F3;" @click="showPopup(true)">《用户服务协议》</text></text>
					</uv-radio>
				</uv-radio-group>
			</view>
		</view>
		<uv-popup ref="popup" :closeable="true" :round="20" mode="bottom" @close="showPopup(false)">
			<view class="popup-container">
				<view class="popup-title">
					隐私协议
				</view>
				<scroll-view class="popup-body" :scroll-y="true">
					<p style="text-align: center;"><strong></strong></p>
					<p style="text-indent: 21pt;"><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">欢迎您使用我们的小程序！我们非常重视您的隐私和个人信息安全。为了更好地为您提供服务，同时确保您的个人信息得到妥善管理，我们制定了本隐私协议（以下简称“本协议”）。请您仔细阅读并了解本协议的所有内容。</span>
					</p>
					<p class="bolder">1. 信息收集</p>
					<p><span style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">·
							我们仅会在您授权的情况下通过微信登录功能收集必要的个人信息，包括但不限于：您的微信昵称、头像、地区等公开信息。</span></p>
					<p><span style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">·
							当您使用我们的小程序时，我们可能会自动收集一些信息，例如设备信息、网络环境信息等，以便为您提供更好的用户体验。</span></p>
					<p class="bolder">2. 信息使用</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 收集的信息将用于提供和优化我们的服务，包括但不限于用户认证、客户服务、改进产品功能等。</span>
					</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 我们不会将您的个人信息用于其他未经您授权的目的。</span>
					</p>
					<p class="bolder">3. 信息共享</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 除非得到您的同意，或者法律法规另有规定，否则我们不会将您的个人信息共享给任何第三方。</span>
					</p>
					<p class="bolder">4. 信息存储</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 您的个人信息将被安全地存储在我们的服务器上，并根据法律法规的要求进行必要的保护。</span>
					</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 我们会根据法律法规的要求以及为实现本协议目的所需的期限内保留您的个人信息。</span>
					</p>
					<p class="bolder">5. 安全保障</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 我们会采取合理可行的措施来保护您的个人信息安全，防止未经授权的访问、披露、使用、修改、损坏或丢失。</span>
					</p>
					<p><span style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255);">· </span><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">尽管我们已经采取了合理的措施来保护您的信息，但由于互联网的固有风险，我们无法保证绝对的信息安全。</span>
					</p>
					<p class="bolder">6. 用户权利</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 您有权查询、更正、删除您的个人信息，以及撤销之前给予的某些授权。</span>
					</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 您可以通过联系我们来行使上述权利。我们将在验证您的身份后尽快响应您的请求。</span>
					</p>
					<p class="bolder">7. 隐私政策的更新</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 我们可能会不定期更新本隐私协议。当本协议发生重大变化时，我们将通过适当的方式通知您。</span>
					</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 继续使用我们的服务即表示您同意接受修订后的隐私协议。</span>
					</p>
					<p class="bolder">8. 其他</p>
					<p><span
							style="color: rgb(44, 44, 54); background-color: rgb(255, 255, 255); font-family: 宋体;">· 本协议受中华人民共和国法律管辖，并按照其进行解释。</span>
					</p>
				</scroll-view>
			</view>
		</uv-popup>
		<view class="onlyone">
			只需要登录一次哦～
		</view>
		<!-- <view class="overlaymad" v-if="showPopup"></view> -->
	</view>
</template>

<script>
	import {
		request
	} from '@/utils/request.js'
	import {
		openPage
	} from '@/utils/index'
	import { loginWX,loginByPassword} from '@/api/login.js'
	export default {
		onShow() {
			uni.hideHomeButton()
		},
		data() {
			return {
				logining:false,
				value: false,
				statusBarHeight: 0,
				username:"",
				password:"",
			}
		},
		mounted() {
			this.getNavHeight()
		},
		computed: {

		},
		methods: {
			showPopup(show){
				if(show){
					this.$refs.popup.open('bottom');
				}else{
					this.$refs.popup.close();
				}
			},
			getNavHeight() {
				const sysInfo = uni.getSystemInfoSync()
				this.statusBarHeight = sysInfo.statusBarHeight
			},
			agree() {
				this.value = 'checked'
				this.showPopup(false)
			},
			async preCheck() {
				if (!this.value) {
					return uni.showToast({
						icon: 'none',
						title: '请同意《用户服务协议》'
					});
				}
				if(!this.username){
					return uni.showToast({
						icon: 'none',
						title: '请输入账号'
					});
				}
				if(!this.password){
					return uni.showToast({
						icon: 'none',
						title: '请输入密码'
					});
				}
				if(this.password.length<5 || this.password.length>20){
					return uni.showToast({
						icon: 'none',
						title: '密码只能输入5-20位'
					});
				}
				const form = {
					username:this.username,
					password:this.password
				}
				this.logining = true
				await loginByPassword(form).finally(()=>{
					this.logining = false
				})
				openPage({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style scoped>
	.onlyone{
		position: absolute;
		bottom: 100rpx;
		margin: auto;
		left: 0;
		right: 0;
		font-size: 25rpx;
		color: #888888;
		letter-spacing: 1px;
	}
	.overlaymad{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: black;
		z-index: 1;
		opacity: 0.7;
	}
	.bolder{
		font-weight: bold;
		color: black;
		margin:20rpx 0
	}
	.login-form {
		width: 80%;
		margin: 50rpx auto;
	}

	::v-deep .u-radio-group {
		justify-content: center;
	}

	.popup-footer-btn::after {
		border: 0px !important;
	}

	.popup-footer-btn {
		width: 200rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 20rpx;
		font-weight: 500;
	}

	.popup-footer-btn-agree {
		background: #03c160;
		border-color: #03c160;
		color: white;
	}

	.popup-footer-btn-reject {
		background: #f2f2f2;
		border-color: #f2f2f2;
		color: black;
	}

	.popup-footer {
		display: flex;
		justify-content: space-around;
	}

	.popup-container {
		padding: 40rpx
	}

	.popup-body {
		color: #949494;
		text-align: left;
		margin-bottom: 50rpx;
		height: 400rpx;
		overflow-y: auto;
		line-height:60rpx
	}

	.popup-title {
		font-size: 36rpx;
		font-weight: bold;
		margin: 40rpx 0;
		text-align: left;
	}

	.container {
		padding: 50rpx;
		text-align: center;
		display: flex;
		flex-direction: column;
		/* justify-content: space-between; */
	}

	.getPhoneNumberBtn {
		margin: 40rpx auto;
		width: 80%;
		height: 100rpx;
		border-radius: 30px;
		line-height: 100rpx;
	}

	.readme {
		font-size: 25rpx;
		margin-top: 60rpx;
	}

	.hello {
		font-size: 38rpx;
		font-weight: bolder;
		letter-spacing: 0px;
		color: rgba(56, 56, 56, 1);
		margin-top: 150rpx;
		text-align: left;
	}

	.hello-2 {}

	.subTitle {
		position: absolute;
		top: 73%;
		margin: auto;
		left: 0;
		right: 0;
		letter-spacing: 11px;
		font-size: 30rpx;
		color: #868686;
	}
</style>