<template>
		<view :class="['serach_wrap', { 'ifFixed': Fixed || ''}]">
			<view class="serach_wrap_Main">
				<view class="serach_wrap_info">
					<view class="info_l" v-if="Userinfo.iflogin||''">
						<view class="Userphoto">
							<image :src="Userinfo.userdata.Userphoto" mode="widthFix"></image>
						</view>
						<text>{{Userinfo.userdata.Userphone_1}}</text>
					</view>
					<view class="login_register" v-else>
						<navigator  url="/pages/Login/index">
							<text>登录</text>/
						</navigator>
						<navigator url="/pages/register/index">
							<text>注册 </text>
						</navigator>
					</view>
					<view class="info_r"><image src="../../static/icon/cart.png" mode="widthFix"></image></view>
				</view>
				<view class="serach_wrap_main" @click="handleSerach">
					<view class="serach_wrap_content">
						<icon class="icon" type="search" size="30rpx"></icon>
						<text>家电空调热卖</text>
					</view> 
				</view> 
			</view>
		</view>
</template>

<script>
export default {
	data() {
		return {
			
		};
	},
	props:["Fixed","Userinfo"],
	onLoad() {},
	onShow() {
		
	},
	methods: { 
		handleSerach(){
			uni.navigateTo({
				url:'/pages/SerachMain/index',
				animationType: 'pop-in'
			})
		}
	}
};
</script>

<style scoped lang="less">
	.serach_wrap{
		width: 100vw;
		height: 250rpx;
		z-index: 20;
		background-color: #F95978;
		.serach_wrap_Main {
			padding-top: 60rpx;
			width: 97%;
			height: 100%;
			margin: auto;
			display: flex;
			flex-direction: column;
			.serach_wrap_info {
				flex: 0.4;
				display: flex;
				.info_l {
					flex: 2;
					display: flex;
					align-items: center;
					overflow: hidden;
					vertical-align: middle;
					.Userphoto{
						height: 50rpx;
						width: 50rpx;
						overflow: hidden;
						border-radius: 50%;
						margin-left: 20rpx;
						image {
							height: 50rpx;
							width: 50rpx;
						}
					}
					text {
						margin-left: 20rpx;
						font-size: 30rpx;
						color: #FFFFFF;
						display: -webkit-box;
						overflow: hidden;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}
				}
				.login_register{
					flex: 2;
					display: flex;
					align-items: center;
					overflow: hidden;
					vertical-align: middle;
					font-size: 30rpx;
					color: #FFFFFF;
					font-weight: 700;
					text{
						margin: 0 8rpx;
					}
				}
				.info_r {
					position: relative;
					display: flex;
					align-items: center;
					flex: 3;
					image {
						position: absolute;
						right: 20rpx;
						height: 50rpx;
						width: 50rpx;
					}
				}
			}
			.serach_wrap_main {
				flex: 0.4;
				display: flex;
				align-items: center;
				margin-top: 20rpx;
				background-color: #dddddd;
				border-radius: 40rpx;
				overflow: hidden;
				.serach_wrap_content {
					display: flex;
					align-items: center;
					margin-left: 15rpx;
					.icon {
						margin-left: 20rpx;
					}
					text {
						margin: 0 0 0 20rpx;
						color: #afafaf;
						font-size: 30rpx;
					}
				}
			}
		}
}
.ifFixed{
	position: fixed;
}
</style>
