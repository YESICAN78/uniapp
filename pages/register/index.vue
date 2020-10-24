<template>
	<view class="register_wrap">
		<view class="register_main">
			<view class="user_phone">
				<view class="user_select_address">
					<text>+86</text>
					<text class="iconfont icon-fanhui"></text>
				</view>
				<view class="user_phone_input">
					<input class="input" v-model="phone" maxlength=11 @input="Input" type="digit" value="" placeholder="请输入手机号" />
				</view>
			</view>
			<button @click="handleregst" style="margin-top: 100rpx;" type="primary" :disabled="ifshowrest">注册</button>
		</view>
		<uni-popup style="z-index: 200;" ref="popup" type="message">
			<uni-popup-message type="warn" :message="Message" :duration="2000"></uni-popup-message>
		</uni-popup>
	</view>
</template>
<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				Message: '',
				//是否显示注册按钮
				ifshowrest: true,
				//电话号码
				phone: '',
			}
		},
		onLoad() {

		},
		onShow() {

		},
		methods: {
			handleregst() {
				let value = this.phone
				let Reg = /^1[3456789]\d{9}$/.test(value);
				var that = this;
				if (Reg) {
					this.$request1({
						url: '/AddCart/register/UserRegister',
						method: 'post',
						data: {
							phone: value
						}
					}).then(res => {
						if (res.code == 0) {
							 uni.showToast({
								 title:res.message,
								 duration: 1000
							})
							setTimeout(()=>{
								uni.navigateTo({
									url: '/pages/Login/index',
									animationType: 'slide-in-right',
								});
							},2000)
						} else {
							that.Message = res.message
							that.$refs.popup.open()
						}
					}).catch(e => {
						console.log(e)
					})
				} else {
					that.Message = "请输入合法的手机号码"
					that.$refs.popup.open()
				}
			},
			Input(e) {
				let value = e.detail.value;
				if (value.length==11) {
					this.ifshowrest = false;
				} else {
					this.ifshowrest = true;
				}
			},
		},
		created() {

		},
		mounted() {

		}
	}
</script>

<style scoped lang="less">
	.register_wrap {
		width: 100vw;

		.register_main {
			width: 90%;
			margin: 50rpx auto;

			.user_phone {
				display: flex;
				border-bottom: 2rpx solid #CCCCCC;

				.user_select_address {
					flex: 1;
					padding: 20rpx 0;
					display: flex;
					justify-content: center;
					align-items: center;

					text {
						font-size: 40rpx;
						font-weight: 700;
					}

					.iconfont {
						transform: rotateZ(-90deg);
					}
				}

				.user_phone_input {
					flex: 9;
					display: flex;
					align-items: center;

					.input {
						margin-left: 10rpx;
					}

					text {
						font-size: 60rpx;
						color: #666666;
						margin-left: 30rpx;
					}
				}
			}

			.btn_register {
				margin-top: 80rpx;
				height: 100rpx;
				background-color: red;
				width: 100%;
				border-radius: 50rpx;
				text-align: center;
				line-height: 100rpx;
				font-size: 40rpx;
				font-weight: 700;
				color: #FFFFFF;
			}
		}
	}
</style>
