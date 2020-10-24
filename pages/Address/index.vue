<template>
	<view class="Address">
		<view class="Address_main">
			<view class="Address_User">
				<text>收货人</text>
				<view class="Address_name">
					<input type="text" maxlength=4 v-model="Address.name" value="" placeholder="请输入收货人姓名" />
				</view>
			</view>
			<view class="Address_Phone">
				<text>手机号</text>
				<view class="Phone">
					<input type="digit" maxlength=11 v-model="Address.phone" value="" placeholder="请输入手机号" />
				</view>
			</view>
			<view class="Address_Map" @click="chooseLocation">
				<text>地址</text>
				<view class="Map">
					{{Address.GoodsAddress?Address.GoodsAddress:'请在地图选择收货地址'}}
				</view>
				<text class="iconfont icon-fanhui1"></text>
			</view>
			<view class="Address_Mr">
				<text>设为默认地址</text>
				<view class="Address_select">
					<checkbox-group @change="handlechecked">
						<label>
							<checkbox value="cb" :checked="Address.shoewAddress" color="#F95978" style="transform:scale(0.7)" />
						</label>
					</checkbox-group>
				</view>
			</view>
			<view class="submit" @click="handlesubmit">
				{{Submit?Submit:'提交'}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				Address: {
					name: '',
					phone: '',
					GoodsAddress: '',
					shoewAddress: false,
				},
				Submit: '',
				Addressid: '',
			}
		},
		onLoad(options) {
			try{
				const item = JSON.parse(decodeURIComponent(options.AddressItem));
				this.Address = {
					name: item.Address_username || "",
					phone: item.Address_phone|| "",
					GoodsAddress: item.Address_address|| "",
					shoewAddress: item.Address_shoewAddress|| "",
				}
				this.Submit = options.submit
				this.Addressid = options._id;
			}catch(e){
				console.log("错误处理机制")
			}
		},
		methods: {
			chooseLocation() {
				var that = this;
				uni.chooseLocation({
					success: function(res) {
						that.Address.GoodsAddress = res.address
					}
				});
			},
			handlechecked() {
				this.Address.shoewAddress = !this.Address.shoewAddress
			},
			handlesubmit() {
				let {
					name,
					phone,
					GoodsAddress,
					shoewAddress
				} = this.Address;
				if (!name || !phone || !GoodsAddress) {
					uni.showActionSheet({
						itemList: ["请填写信息"],
						itemColor: '#ff0000'
					});
					return
				}
				const UserInfo = this.$iflogin()
				if (!UserInfo._id) {
					uni.navigateTo({
						url: '/pages/Login/index',
						animationType: 'slide-in-left',
					});
				} else {
					this.$request1({
						url: '/AddCart/Set/SetAddress',
						data: {
							name,
							phone,
							GoodsAddress,
							shoewAddress,
							Userid: UserInfo._id,
							Addressid: this.Submit == '保存' ? this.Addressid : '',
							Submit: this.Submit == '保存' ? 0 : 1,
						}, //传数据给后台
						method: 'post'
					}).then(res => {
						if (res.code == 0) {
							uni.showToast({
								title: res.message,
								duration: 1000,
							})
							uni.navigateTo({
								url: "/pages/Address/AddressList",
								animationType: 'pop-in'
							})
						}
					}).catch(e => {
						console.log(e)
					})
				}
			},
		}
	}
</script>

<style scoped lang="less">
	.Address {
		width: 100vw;
		height: 100vh;
		background-color: #FFFFFF;
		font-size: 30rpx;

		.Address_main {
			width: 94%;
			margin: auto;

			.Address_User,
			.Address_Phone,
			.Address_Mr {
				width: 100%;
				height: 100rpx;
				border-bottom: 1rpx solid #CCCCCC;
				line-height: 100rpx;

				text {
					float: left;
				}
			}

			.Address_User {
				position: relative;

				input {
					position: absolute;
					top: 50%;
					left: 100rpx;
					transform: translateY(-50%);
					color: #F95978;
					font-size: 35rpx;
				}
			}

			.Address_Phone {
				position: relative;

				input {
					position: absolute;
					top: 50%;
					left: 100rpx;
					transform: translateY(-50%);
					color: #F95978;
					font-size: 35rpx;
				}
			}

			.Address_Map {
				position: relative;
				width: 100%;
				height: 150rpx;
				border-bottom: 1rpx solid #CCCCCC;

				text {
					float: left;
					line-height: 150rpx;
				}

				.Map {
					width: 75%;
					position: absolute;
					left: 100rpx;
					top: 50rpx;
					color: #F95978;
					font-size: 30rpx;
				}

				.iconfont {
					position: absolute;
					right: 0;
					color: #CCCCCC;
					font-size: 40rpx;
				}
			}

			.Address_Mr {
				position: relative;

				.Address_select {
					position: absolute;
					right: 0;

				}
			}

			.submit {
				margin-top: 50rpx;
				padding: 20rpx 0;
				width: 100%;
				background-color: #F95978;
				border-radius: 50rpx;
				overflow: hidden;
				text-align: center;
				line-height: 60rpx;
				font-size: 40rpx;
				font-weight: 700;
				color: #FFFFFF;
			}
		}
	}
</style>
