<template>
	<view class="AddressList">
		<view class="AddressList_main">
			<view class="Address_item" v-for="(item,index) in AddressList" :key="index">
				<view class="Userinfo">
					<text>{{item.Address_username}}</text>
					<text>{{item.Address_phone}}</text>
					<text :class="item.Address_shoewAddress?'shoewAddress':''">{{item.Address_shoewAddress?'默认':''}}</text>
				</view>
				<view class="Address">
					{{item.Address_address}}
				</view>
				<view class="Address_delete">
					<text class="iconfont icon-shanchu" @click="handledelete(item._id)">删除</text>
					<text class="iconfont icon-bianji" @click="handleset(item)">编辑</text>
				</view>
			</view>
		</view>
		<view class="ifAddress" v-if="AddressList.length==0">
			找不到您的收获地址哦，先去添加一个吧
		</view>
		<navigator url="/pages/Address/index" hover-class="none">
			<view class="Add_Address">
				+新增收货地址
			</view>
		</navigator>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				AddressList: []
			}
		},
		onShow() {
			this.getAddress()
		},
		methods: {
			//获取收货地址
			getAddress() {
				try{
					const UserInfo = this.$iflogin()
					if(!UserInfo._id){
							uni.showActionSheet({
								itemList: ["亲请先登录"],
								itemColor: '#ff0000'
							});
					}else{
						this.$request1({
							url: '/AddCart/Set/GetAddress',
							data: {
								Userid: UserInfo._id
							}, //传数据给后台
							method: 'post'
						}).then(res => {
							uni.removeStorageSync('Address')
							this.AddressList = []
							this.AddressList = res.data.Goods_Address
							uni.setStorageSync("Address",res.data.Goods_Address)
						}).catch(e => {
							console.log(e)
						})
					}
				}catch(e){
					
				}
					
			},
			//删除地址
			handledelete(id) {
				uni.showModal({
				    title: '提示',
				    content: '你确定要删除吗？',
				    success:  (res)=> {
				        if (res.confirm) {
				           const UserInfo = this.$iflogin();
				           this.$request1({
				           	url: '/AddCart/Set/DeleteAddress',
				           	data: {
				           		Userid: UserInfo._id,
				           		Addressid: id
				           	}, //传数据给后台
				           	method: 'post'
				           }).then(res => {
				           	uni.showToast({
				           		title: res.message,
				           		duration: 1000,
				           	})
				           }).catch(e => {
				           	console.log(e)
				           })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
				
				
			},
			//编辑地址
			handleset(item) {
				uni.navigateTo({
					url: "/pages/Address/index?submit=保存&AddressItem=" + encodeURIComponent(JSON.stringify(item)),
				})
			},
			onPullDownRefresh() {
				this.getAddress()
				setTimeout(() => {
					uni.stopPullDownRefresh()
				}, 2000)
			},

		},
	}
</script>

<style scoped lang="less">
	.AddressList {
		position: relative;
		width: 100vw;
		min-height: 100vh;

		.ifAddress {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translateY(-50%);
			transform: translateX(-50%);
			color: #c5c5c5;
			font-size: 40rpx;
		}

		.Add_Address {
			margin: auto;
			width: 95%;
			height: 100rpx;
			line-height: 100rpx;
			text-align: center;
			font-size: 40rpx;
			font-weight: 700;
			background-color: #F95978;
			color: #FFFFFF;
			border-radius: 50rpx;
			overflow: hidden;
		}

		.AddressList_main {
			width: 95%;
			margin: auto;
			padding-top: 20rpx;
			box-sizing: border-box;

			.Address_item {
				position: relative;
				padding: 20rpx;
				margin-bottom: 30rpx;
				width: 100%;
				height: 220rpx;
				border-radius: 35rpx;
				overflow: hidden;
				background-color: #FFFFFF;
				.Userinfo {
					width: 100%;
					padding-bottom: 20rpx;
					box-sizing: border-box;
					text {
						margin-left: 30rpx;
						color: #FFFFFF;
					}

					text:nth-child(1) {
						margin-left: 0;
						font-size: 30rpx;
						color: #bdbdbd;
					}

					text:nth-child(2) {
						font-size: 30rpx;
						color: #bdbdbd;
					}

					.shoewAddress {
						display: inline-block;
						width: 90rpx;
						height: 30rpx;
						font-size: 20rpx;
						font-weight: 700;
						line-height: 30rpx;
						text-align: center;
						background-color: #F95978;
						padding: 5rpx 15rpx;
						border-radius: 10rpx;
					}
				}

				.Address {
					color: #CCCCCC;
					font-size: 30rpx;
					margin-bottom: 20rpx;
				}

				.Address_delete {
					position: absolute;
					right: 20rpx;
					bottom: 20rpx;
					font-size: 30rpx;

					text:nth-child(1) {
						margin-right: 20rpx;
					}
				}

			}
		}
	}
</style>
