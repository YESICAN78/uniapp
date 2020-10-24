<template>
	<view class="Market">
		<view class="Market_main">
			<view class="Market_item" @click="handleAdditem(item)" v-for="(item,index) in FBgoodsArr" :key="index" v-if="item.goods_ifbay">
				<view class="goods_box">
					<view class="goods_img">
						<image :src="item.goods_img[0]" mode="widthFix"></image>
					</view>
					<view class="goods_name">
						<text>{{item.goods_name}}</text>
					</view>
					<view class="goods_price">
						<text>￥{{item.goods_newprice}}</text>
						<text>{{item.goods_free=="包邮"?'包邮':'不包邮'}}</text>
					</view>
				</view>
				<view class="goods_user">
					<view class="user_log">
						<image :src="item.User_id.Userphoto" mode="widthFix"></image>
					</view>
					<text>{{item.User_id.Userphone_1.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")}}</text>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				FBgoodsArr: [],
			}
		},
		onLoad() {

		},
		onShow() {
			this.getgoodsdata()
		},
		methods: {
			//获取发布的商品列表数据
			getgoodsdata() {
				this.$request1({
					url: "/AddCart/Fbu/getproduct",
					method: 'get',
				}).then(res => {
					console.log(res)
					if (res.code == 0) {
						this.FBgoodsArr = res.data
					}
					return
				}).catch(e => {
					console.log(e)
				})
			},
			//点商品跳转到商品详情页
			handleAdditem(item) {
				uni.navigateTo({
					url: '/pages/SecondHandmarket/indexitem?goods_item=' + encodeURIComponent(JSON.stringify(item)),
					animationType: 'slide-in-left',
				});
			},
			onPullDownRefresh() {
      this.getgoodsdata()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
			}
		}
	}
</script>

<style scoped lang="less">
	.Market {
		width: 100vw;
		margin-top: 20rpx;

		.Market_main {
			width: 95%;
			margin: auto;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.Market_item {
				position: relative;
				width: 49%;
				margin: 10rpx 0;
				border-radius: 15rpx;
				overflow: hidden;
				background-color: #FFFFFF;

				.goods_box {
					.goods_img {
						vertical-align: middle;
						overflow: hidden;
						height: 450rpx;

						image {
							width: 100%;
						}
					}

					.goods_name {
						margin: 10rpx 10rpx;
						font-size: 30rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;

						text {
							font-size: 30rpx;
							font-weight: 700;
						}
					}

					.goods_price {
						position: relative;
						padding: 10rpx 10rpx;

						text {
							color: red;
							font-size: 30rpx;
							font-weight: 700;
						}

						text:nth-child(2) {
							padding: 10rpx 15rpx;
							border-radius: 10rpx;
							position: absolute;
							background-color: #F95978;
							right: 20rpx;
							color: #CCCCCC;
							font-size: 20rpx;
							font-weight: 700;
						}
					}
				}

				.goods_user {
					padding: 10rpx 10rpx;

					.user_log {
						width: 50rpx;
						height: 50rpx;
						float: left;
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 50rpx;
							height: 50rpx;
						}
					}

					text {
						width: 50%;
						margin-left: 40rpx;
						color: #CCCCCC;
						font-size: 25rpx;
						line-height: 50rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
					}
				}
			}
		}
	}
</style>
