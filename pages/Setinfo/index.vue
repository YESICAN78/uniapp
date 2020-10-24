<template>
	<view class="Setinfo">
		<uni-popup style="z-index: 200;" ref="popup1" type="dialog">
			<uni-popup-dialog  title="你确定要退出登录吗？" type="info" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<view class="Set_main">
			<navigator url="/pages/Setinfo/UserSetinfo" hover-class="none">
				<view class="Set_item">
					<text>个人资料</text>
					<text class="iconfont icon-fanhui1"></text>
				</view>
			</navigator>
			<navigator url="/pages/Address/index"  hover-class="none">
				<view class="Set_item">
					<text>添加收货地址</text>
					<text class="iconfont icon-fanhui1"></text>
				</view>
			</navigator>
			<view class="loginout">
				<button size="default" type="warn" @click="deleteuserin">退出</button>
			</view>
		</view>
	</view>
</template>

<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
					uniGrid,
					uniGridItem, 
					uniPopup,
		      uniPopupMessage,
		      uniPopupDialog
					},
		data() {
			return {

			}
		},
		methods: {
			//点击取消
				 close(done){
					done()
					// uni.navigateBack(1);
				},
				//点击确定
				 confirm(done,value){
					this.Loginout()
					done()
			},
			deleteuserin() {
				this.$refs.popup1.open()
			},
			//退出登录事件
			Loginout(){
				const Userid = this.$iflogin()
				if(!Userid._id){
					uni.showActionSheet({
						itemList: ["亲请先登录"],
						itemColor: '#ff0000'
					});
				}else{
					this.$request1({
						url: '/AddCart/Set/loginout',
						method: 'get',
						data: {
							Userid: Userid._id,
						}
					}).then(res => {
						uni.showToast({
							 title:res.message,
							 duration: 1000
						})
						uni.removeStorageSync("Address")
						uni.removeStorageSync('Userinfo')
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/My/index',
								animationType: 'slide-in-left',
							}, 2000);
						})
					}).catch(e => {
						console.log(e)
					})
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.Setinfo {
		height: 100vh;
		width: 100vw;
		background-color: #FFFFFF;

		.Set_main {
			width: 93%;
			margin: auto;

			.Set_item {
				position: relative;
				height: 100rpx;
				border-bottom: 1rpx solid #CCCCCC;
				line-height: 100rpx;
				font-size: 30rpx;
				font-weight: 600;

				.iconfont {
					position: absolute;
					right: 0;
					font-size: 40rpx;
					color: #CCCCCC;
				}
			}

			.loginout {
				margin-top: 50rpx;
				border-radius: 50rpx;
				overflow: hidden;
				button{
					width: 100%;
				}
			}
		}
	}
</style>
