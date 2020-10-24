<template>
	<view class="Login_wrap">
		<uni-popup style="z-index: 200;" ref="popup" type="message">
			<uni-popup-message type="warn" :message="Message" :duration="2000"></uni-popup-message>
		</uni-popup>
		<view class="Login_main">
			<view class="log_box">
				<view class="text">
					<image src="../../static/img/my.png" mode="widthFix"></image>
				</view>
				<text>正品低价有保障，好物好货上京东</text>
			</view>
			<view class="user_phone_wrap">
				<view class="select_phone">
					<text>国家/地区</text>
					<text>中国(+86)></text>
				</view>
				<view class="user_insert_phone">
					<input class="input" type="digit" @input="input" maxlength=11 v-model="Login.phone" value="" placeholder="请输入手机号" />
					<text class="iconfont icon-quxiao" v-if="ifinput"></text>
				</view>
				<view class="user_insert_phone">
					<input class="input" type="digit" @input="codeinput" maxlength=6 v-model="Login.code" value="" placeholder="请输入验证码" />
					<button @click="SendCode" type="primary" :disabled="ifcode">
						{{count*1>0?count+'s后重新发送':"获取验证码"}}
					</button>
				</view>
			</view>
			<button style="margin-top: 100rpx;" @click="handleLogin" type="warn" :disabled="ifbtn">立即登录</button>
			<view class="login_select" @click="handleRegister">
				<text>新用户注册</text>
			</view>
		</view>
	</view>
</template>
<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	const TIME_COUNT = 60
	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				Message:'',
				ifinput: false,
				ifbtn: true,
				ifcode: true,
				//登录需要的信息
				Login: {
					phone: '',
					code: ''
				},
				Codevalue:'发送',
				Time:null,
				count:'',
				UserAddress:""
			};
		},
		onLoad() {},
		onShow() {},
		methods: {
			
			input(e) {
				let value = e.detail.value;
				if (value.length==11) {
					this.ifcode = false;
				} else {
					this.ifcode = true;
				}
			},
			codeinput(e) {
				let value = e.detail.value;
				if (value.length==6) {
					this.ifbtn = false;
				} else {
					this.ifbtn = true;
				}
			},
			//发送验证码
			SendCode() {
				let value = this.Login.phone
				let Reg = /^1[3456789]\d{9}$/.test(value);
				var that = this
				if(Reg){
					this.$request1({
						url: '/AddCart/login/Usercode',
						method: 'post', 
						data:{	
							phone:this.Login.phone,
							Useraddress:this.UserAddress   
						}
					}).then(res=>{
						console.log(res) 
						if(res.code==0){
							uni.showToast({
								 title:res.message,
								 duration: 1000,
							})
							//设计验证码的倒计时
							this.count = TIME_COUNT;
							this.ifcode = true;
							this.Times = setInterval(()=>{
								if(this.count>0 && this.count<=TIME_COUNT){
									this.count--
									this.ifcode = true
								}else{
									this.ifcode = false;
									clearInterval(this.Times)
									this.Time = null
								}
							},1000)
						}else{
							this.Message = res.message
							this.$refs.popup.open()
						}
					}).catch(e=>{
						console.log(e)
					})
					
				}else{
					this.Message = "请输入合法的电话号码" 
					this.$refs.popup.open()
				}
			},
			handleLogin() {
				let value = this.Login.phone
				let Reg = /^1[3456789]\d{9}$/.test(value);
				var that = this
				if(Reg){
					this.$request1({
						url: '/AddCart/login/UserLogin',
						method: 'post', 
						data: this.Login
					}).then(res=>{
						if(res.code==0){
							uni.showToast({
								 title:res.message,
								 duration: 1000
							})
							//保存用户信息在本地
							uni.setStorageSync('Userinfo',res.data)
							uni.switchTab({
								url: '/pages/My/index',
							});
						}else{
							that.Message = res.message
							that.$refs.popup.open()
						}
					})
				}else{
					that.Message = "请输入合法的电话号码"
					that.$refs.popup.open()
				}
			},
			handleRegister() {
				uni.navigateTo({
					url: '/pages/register/index',
					animationType: 'slide-in-left',
				});
			},
			Address(){
				uni.getLocation({
				    type: 'wgs84',
						geocode:true,
				    success:(res)=>{
							this.UserAddress = `${res.address.province+res.address.city+res.address.district}`
				    }
				});
			},
		},
		created() {}, 
		mounted() {
			this.Address()
		}
	};
</script>
<style scoped lang="less">
	.Login_wrap {
		width: 100vw;
		height: 100vh;
		background-color: #FFFFFF;

		.Login_main {
			width: 90%;
			margin: auto;

			.log_box {
				display: flex;
				flex-direction: column;

				.text {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					overflow: hidden;

					image {
						border-radius: 50%;
						width: 120rpx;
						height: 120rpx;
					}
				}

				text {
					margin-top: 20rpx;
					flex: 0.5;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #CCCCCC;
					font-size: 30rpx;
				}
			}

			.user_phone_wrap {
				width: 100%;
				margin-top: 30rpx;

				.select_phone {
					position: relative;
					padding: 40rpx 0;
					border-bottom: 2rpx solid #CCCCCC;

					text {
						font-size: 40rpx;
						font-weight: 600;
					}

					text:nth-child(1) {
						position: absolute;
						left: 0;
						top: 0;
					}

					text:nth-child(2) {
						position: absolute;
						right: 0;
						top: 0;
					}
				}

				.user_insert_phone {
					position: relative;
					height: 100rpx;
					border-bottom: 2rpx solid #CCCCCC;
					line-height: 100rpx;
					.input {
						display: block;
						height: 100%;
						width: 400rpx;
						line-height: 80rpx;
						float: left;
					}
					button{
						height: 100%;
						text-align: center;
						line-height: 100rpx;
					}
					text {
						position: absolute;
						right: 0;
						top: 50%;
						transform: translate(-50%);
						color: #CCCCCC;
						font-size: 60rpx;
						color: #666666;
						margin-left: 30rpx;
					}

					.handle_code {
						position: absolute;
						right: 0;
						width: 150rpx;
						height: 50rpx;
						background-color: green;
						border-radius: 30rpx;
						text-align: center;
						line-height: 50rpx;
						color: #FFFFFF;
						font-size: 30rpx;
					}
				}
			}

			.btn_login {
				margin-top: 60rpx;
				width: 100%;
				height: 100rpx;
				border-radius: 50rpx;
				background-color: red;
				line-height: 100rpx;
				text-align: center;
				color: #FFFFFF;
				font-size: 40rpx;
				font-weight: 700; 
			}

			.login_select {
				margin-top: 20rpx;
				font-size: 30rpx;

				text {}
			}
		}
	}
</style>
