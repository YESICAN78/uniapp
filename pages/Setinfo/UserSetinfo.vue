<template>
	<view class="UserSetInfo">
		<view class="UserSetInfo_main">
			<view class="UserPhoto">
				<text>头像</text>
				<view class="img_box" @click="handlePhoto">
					<image :src="Setinfo.UserPhotoUrl?Setinfo.UserPhotoUrl:Userinfo.Userphoto" mode="widthFix"></image>
				</view>
			</view>
			<view class="UserPhone">
				<text>更改手机号</text>
				<input class="input" type="digit"  maxlength=11 v-model="Setinfo.phone" value="" placeholder="请输入手机号" />
			</view>
			<view class="setInfo" @click="SetPhoto">
				<button type="warn">保存资料</button>
			</view>
		</view>
	</view>
</template>

<script>
	import baseUrl from '../../config/config.js'
	export default {
		data() {
			return {
				Setinfo:{
					UserPhotoUrl: '',
					phone:''
				},
				Userinfo: {},
			}
		},
		onLoad() {

		},
		onShow() {
			this.GetUserinfo()
		},
		methods: {
			GetUserinfo() {
				const userinfo = this.$iflogin()
				this.Userinfo = userinfo
			},
			//上传头像
			handlePhoto() {
				const UserInfo = this.$iflogin()
				if(!UserInfo._id){
					uni.navigateTo({
						url: '/pages/Login/index',
						animationType: 'slide-in-left',
					});
				}else{
					uni.chooseImage({
						count: 1, //默认9
						sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
						sourceType: ['album', 'camera'], //从相册选择
						success: (res) => {
							//上传图片接口
							uni.uploadFile({
								url: `${baseUrl}/AddCart/addcart/UploadePhoto`,
								filePath: res.tempFilePaths[0],
								name: 'file',
								method: "POST",
								header: {
									'X-Requested-With': 'XMLHttpRequest',
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								},
								success: (res) => {
									let Data = JSON.parse(res.data)
									this.Setinfo.UserPhotoUrl = Data.GoodsImg
								},
								fail: function fail(err) {
									console.log(err)
								}
							})
						}
					});
				}
			},
			//保存资料
			SetPhoto() {
				const UserInfo = this.$iflogin()
				if(!UserInfo._id){
					uni.navigateTo({
						url: '/pages/Login/index',
						animationType: 'slide-in-left',
					});
				}else{
					this.$request1({
						url: '/AddCart/Set/SetPhoto',
						method: 'post',
						data: {
							Userid: this.Userinfo._id,
							Userphoto: this.Setinfo.UserPhotoUrl,
							Userphone:this.Setinfo.phone
						}
					}).then(res => {
						console.log(res)
						if (res.code == 0) {
							setTimeout(() => {
								uni.switchTab({
									url: '/pages/My/index',
									animationType: 'slide-in-left',
								}, 2000);
							})
						}
					}).catch(e => {
						console.log(e)
					})
				}
			},
		},
	}
</script>

<style scoped lang="less">
	.UserSetInfo {
		width: 100%;
		height: 100vh;
		background-color: #FFFFFF;

		.UserSetInfo_main {
			position: relative;
			width: 94%;
			margin: auto;

			.UserPhoto {
				position: relative;
				text {
					float: left;
					font-size: 40rpx;
					line-height: 150rpx;
				}
				.img_box {
					position: absolute;
					right: 0;
					height: 150rpx;
					width: 150rpx;
					border-radius: 50%;
					overflow: hidden;
					vertical-align: middle;
					image {
						height: 150rpx;
						width: 150rpx;
					}
				}
			}
			.UserPhone{
				width: 100%;
				position: absolute;
				top: 200rpx;
				height: 100rpx;
				line-height: 100rpx;
				text{
					float: left;
					font-size: 40rpx;
				}
				input{
					padding-left: 20rpx;
					box-sizing: border-box;
					height: 100rpx;
					line-height: 100rpx;
					color: #F95978;
					font-size: 40rpx;
				}
			}
			.setInfo {
				position: absolute;
				top: 350rpx;
				width: 100%;
				overflow: hidden;
				border-radius: 50rpx;
			}
		}
	}
</style>
