<template>
	<view class="Pay_wrap">
		<view class="header_top" @click="handlegoto">
			<text class="iconfont icon-fanhui"></text>
			<text>确认订单</text>
		</view>
		<view class="user_address_wrap" id="scrolladdress" v-if="address.length>0">
			<view class="address_main">
				<text class="iconfont icon-dingwei"></text>
				<view class="address_content">
					<view class="user_phone_box">
						<text class="user_name">{{address[0].Address_username}}</text>
						<text class="user_phone">{{address[0].Address_phone}}</text>
					</view>
					<text class="user_address">{{address[0].Address_address}}</text>
				</view>
				<view class="icon"><text class="iconfont icon-fanhui1"></text></view>
			</view>
		</view>
		<view class="user_address_ifshow" v-else>
			<view class="user_address_box">
				<navigator url="../Address/index" style="width: 100%;">
					<button type="primary" size="default">
						<text class="iconfont icon-dingwei">
							请添加收货地址
						</text>
					</button>
				</navigator>
			</view>
		</view>
		<view class="order_goods_list">
			<view class="order_goods_main" v-for="(item,index) in ordergoodslist" :key="item.index">
				<view class="order_content">
					<view class="img_box">
						<image :src="item.goods_small_logo||item.goods_img[0]" mode="widthFix"></image>
					</view>
					<view class="goods_name">{{ item.goods_name}}</view>
					<view class="goods_price">
						<text>￥{{ item.goods_price || item.goods_newprice}}</text>
						<text>X{{ item.cont || ordergoodslist.length }}</text>
					</view>
				</view>
				<view class="order_pay_cont">
					<text>共{{ item.cont || ordergoodslist.length }}件</text>
					<text>小计:</text>
					<text>￥{{ item.cont * item.goods_price || 1*item.goods_newprice}}</text>
				</view>
			</view>
		</view>
		<view class="Pay_methds">
			<view class="Pay_main">
				<view class="Pay_main_content" v-for="(item, index) in Pay" :key="item.id" @click="handlePay(index)">
					<text :class="['iconfont', item.icon]"></text>
					<text>{{ item.Payname }}</text>
					<icon :type="item.iconshow ? 'success_no_circle' : ''" size="20" />
				</view>
			</view>
		</view>
		<view class="bottm_order_nav">
			<view class="bottom_order_cont">
				<text>共{{ ordergoodslist.length }}件</text>
				<text>合计:</text>
				<text>￥{{ totalPrice }}</text>
				<text @click="handlePayorder">提交订单</text>
			</view>
		</view>
	</view>
</template>

<script>
	// var URL="https://openapi.alipay.com/gateway.do",
	//  APP_ID="2016102600762104",
	//  APP_PRIVATE_KEY="MIIEowIBAAKCAQEAg8u+bwdj1Fu43iHWAYKcgp1TlyjR6/zNKiuj9Bl+td0+esQdfyWgH4x4+b4uT02hWJdxN8hhp8h+k1a+zxYo63fJnWhldzSM9Q2hZGT4Hf0DxjS9SRmLbY1k2PnTT3+gHEnTVit7dfyjNBBqzxj9dUmG24fjFUxFZz+WYH+nS8FCj00N1msoPZUt+9vmRkaa6LAqX5G0SEH224rT3qvsPncxFyW5aEfqzRZTJTRykxvm6++jCKLUONZ5fzIe+zOSTEg3TBlpNXM8O2uc0Zya6LuAdVpM0awBSzHsBTcQCPWYD+G7B7IEf9fkMVmR9/7Q5c8L/UxmBhzhuboKqut32wIDAQABAoIBAHgnc8H9VsHvrSa2akiOLunVTLPufxNKMjFT//E2nRJoVeHOkaWtQ8H/avskq0uZVpNR3eIhSQaR/vOMjgB2D3A8kQ50cqyuuCNg/dZtRtbwKFS3GCpgo4CI+3vkpwU/MVUY6RcSJUh3vsJkhTuxaMFY+x2BUUHFezCaBBqNxpOEml2zxgSVhNf4smA6++fT/vm4E7HZYYgHrSitsOFcjleCuZllRYz0TiKakOJw093mF/+pHNvh3hIN4pi+eo5R/O7nBlz5tczfaxks+xHsLNK5SRlNsiyQ3QcKqJJjns0Gy4o+cXOWojXhc/pOSMBrLQWLni52rvip4JkHdMRfuIECgYEAvyTwBRj8T7U0ycqIIjsVIeX9sV5IDjLQqwZwzlZTJzFDhZpmTt24f1FgnjLsHo9NLlXt5msoJHwFv/3ZX8BOuDnYMnO2CrgJJZIsIDvSSGXRDtgedHHOmcEjpBQ/TibSJ+5jHQtcfZRWARGLb0m4PK/u+3MivIGuLURMHmWSEVECgYEAsIO4Lb2kAPk6WcS2uUkmXzoGV9nC6EjI52X/KJ6WKWGE+IrKAyskNFGQFvVB38k4HZf5FFxbmxGVUbySv0cuFqdArTK+KGOmWR9MdaYO4d0f5mcqn4QQ2QyInkxm0+110jGYr7LGTwu2W5fEHQfTULuFCtueeRp6SQVtlvAzy2sCgYEAucEixEFwyeFWiJgbTfDO659/uIPgUHQPl3Tt4YfAzYCxlr/iltgf+RLTa0ofbt9iaRo21MrkOviP+fGu8r+HgL8uHHGYwrfwo6N24GhiRds0nFFo307OMVuh0E2g68kMSKQBi/NDkgK6xdUQBTnGIqvy+kf8xObdpr4NnyikF9ECgYBs+dViv/sZ8sS4mT8qY2QCVKOH51Ry7kTCv/DpFgelIqTigWU40ZC3kEeCNQbnb6ZqduH7VQ3lTdS/Msnyt7JXoAjJJVPLQcJ4sV8WH2B+x3MjXzwsYW+5YQiTmp29Z5RfIemfR6MxOAzsvWUBe0xWQn9f9bkAEX2/yU8gacnAYwKBgFbcvIEofYoPP3ckLO0PpHnNYOCYiTPmHsjxj2c28ckHkKReRcuNqi09RETEb4RpP+PAamDREDNKuMBhW9+x7hpUZoB7w2le37GKDQoOdbZotoR2KFskJJWNnltQowkBZcyTmFbHzjOdWk6NzZg8m7sA9Qv2GthuND6gaT726rXU",
	//  FORMAT="json",
	//  CHARSET="UTF-8",
	//  ALIPAY_PUBLIC_KEY="MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkiJtuylVjt0b5zgZx8mh7xyOzGATdstopuPvjCLteKT6Q5lWvdb40Xj0R37HbmflHP0JqTHv0GFJhoHuimJLdz3QZ8BPIUXqfMnwSe6YncaDaciluOF+mDZbjDZqhESMpNX4C5pjZV3pUpvwziTtMp35QP3YInmkEf/b9eyxPXbDdi0kXmtlenKQ6GjmYdCWqdZ1/Q2gvXWTx7bkZTbWWgHwfxneV3zIq1lPVXbaQLRD3OXr3qH6ACV+c97+MFH12z/sGoOYTrDSt6EKNFjyKp3PS23ViiAI3o/nC1YD7I7hI4n0yIo3zRv0f6BmUHZmeVMk3lxMo49/LfYH44x/TwIDAQAB",
	//  SIGN_TYPE="RSA2";
	// AlipayClient alipayClient = new DefaultAlipayClient(URL, APP_ID, APP_PRIVATE_KEY, FORMAT, CHARSET, ALIPAY_PUBLIC_KEY, SIGN_TYPE);

	export default {
		data() {
			return {
				defaulting: 'http://image2.suning.cn/uimg/b2c/newcatentries/0000000000-000000000721208036_1_400x400.jpg',
				//支付方式 
				Pay: [{
						icon: 'icon-zhifubaozhifu',
						Payname: '支付宝支付(推荐)',
						iconshow: true, 
						type: "alipay"
					},
					{
						icon: 'icon-weixinzhifu',
						Payname: '微信支付',
						iconshow: false,
						type: "wxpay"
					}
				],
				//是否显示地址
				ifshowaddress: true,
				ordergoodslist: [],
				//总价格
				totalPrice: 0,
				//收货地址数据
				address: [],
				html:''
			};
		},
		onLoad(options) {
			this.ordergoodslist = JSON.parse(options.goodsdata)
			this.address = JSON.parse(options.address)
		},
		onShow() {
			this.ordersumprice();
		},
		methods: {
			//返回上一页
			handlegoto() {
				uni.navigateBack();
			},
			//计算总价格
			ordersumprice() {
				let totalPrice = 0;
				this.ordergoodslist.forEach(v => {
					totalPrice += v.cont * v.goods_price || 1 * v.goods_newprice;
				});
				this.totalPrice = totalPrice;
			},
			//选择支付方式
			handlePay(index) {
				this.Pay.forEach((v, i) => (i === index ? (v.iconshow = true) : (v.iconshow = false)));
			},
			//调用支付
			handlePayorder() {
				uni.showActionSheet({
					itemList: ["支付未开通"],
					itemColor: '#2aff27'
				});
				// uni.getProvider({
				// 	service: "payment",
				// 	success: (res) => {
				// 		this.Pay.forEach(v => v.iconshow ? this.requestPayment(v.type, res.provider) : '')
				// 	},
				// 	fail: (e) => {

				// 	}
				// })
			},
			//2.异步支付先获取订单信息
			async requestPayment(Paytype, provider) {
				if (Paytype == provider[0]) {
					//支付宝支付
					let orderInfo = await this.getOrderInfo(Paytype);
					console.log(orderInfo)
					this.html = JSON.stringify(orderInfo)
					uni.requestPayment({
						provider: 'alipay',
						orderInfo: torderInfo,
						success: function(res) {
							console.log('success:' + JSON.stringify(res));
						},
						fail: function(err) {
							console.log('fail:' + JSON.stringify(err)); 
						}
					})
				} else {
					//微信支付
				}
			},
			//3.获取订单信息
			getOrderInfo(e) {
				return new Promise((res) => {
					this.$request1({
						url: e == 'alipay' ? '/AddCart/orderPay/Alipay' : '/AddCart/orderPay/wxpay',
						method: 'post',
						data: {
							price: this.totalPrice,
							subject: "支付信息"
						},
					}).then(Res => {
						res(Res)
					}).catch(e => {
						res(e)
					})
				})
			}
		},
		onPageScroll(e) {
			// this.getadressbox(e)
		},
		created() {},
		mounted() {}
	};
</script>

<style scoped lang="less">
	.Pay_wrap {
		width: 100vw;
		margin-bottom: 115rpx;

		.header_top {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			background-color: #e6e6e6;
			width: 100%;
			padding-top: 60rpx;
			line-height: 60rpx;

			text {
				height: 60rpx;
				line-height: 60rpx;
				font-size: 40rpx;
				font-weight: 700;
			}

			text:nth-child(1) {
				font-size: 40rpx;
			}
		}

		.user_address_wrap {
			width: 100%;
			height: 200rpx;
			margin-top: 140rpx;

			.address_main {
				display: flex;
				width: 97%;
				height: 100%;
				margin: auto;
				padding: 20rpx;
				background-color: #ffffff;
				border-radius: 20rpx;

				.icon-dingwei {
					flex: 0.5;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #d81e06;
					font-size: 50rpx;
				}

				.address_content {
					flex: 5;
					font-size: 30rpx;

					.user_phone_box {
						padding: 10rpx 0;

						.user_name {}

						.user_phone {
							margin-left: 10rpx;
							color: #cccccc;
						}
					}

					.user_address {
						display: block;
						padding-top: 15rpx;
					}
				}

				.icon {
					flex: 0.5;
					display: flex;
					justify-content: center;
					align-items: center;

					.icon-fanhui1 {
						color: #cccccc;
						font-size: 40rpx;
					}
				}
			}
		}

		.addBtn {
			width: 100%;
			height: 100rpx;
			margin-top: 140rpx;
		}

		.user_address_ifshow {
			margin-top: 140rpx;
			margin-bottom: 30rpx;
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;

			.user_address_box {
				width: 97%;
				margin: auto;
				display: flex;

				button {
					width: 100%;
					background-color: #F95978;
				}

				text {
					height: 100%;
					line-height: 100rpx;
				}

				text:nth-child(1) {
					flex: 0.5;
					font-size: 40rpx;
					color: #FFFFFF;
				}

				text:nth-child(2) {
					flex: 5;
					font-size: 30rpx;
				}

				text:nth-child(3) {
					flex: 0.5;
					display: flex;
					justify-content: center;
					align-items: center;
					color: #cccccc;
					font-size: 40rpx;
				}
			}
		}

		.order_goods_list {
			width: 100%;

			.order_goods_main {
				position: relative;
				width: 97%;
				margin: 20rpx auto;
				padding: 20rpx;
				background-color: #ffffff;
				border-radius: 20rpx;
				overflow: hidden;

				.order_content {
					display: flex;
					width: 100%;

					.img_box {
						padding: 10rpx;
						flex: 2;

						image {
							width: 200rpx;
							height: 200rpx;
						}
					}

					.goods_name {
						flex: 5;
						font-size: 25rpx;
					}

					.goods_price {
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;

						text {
							font-size: 20rpx;
							margin: 10rpx 0;
							color: #666;
						}
					}
				}

				.order_pay_cont {
					position: absolute;
					bottom: 20rpx;
					right: 20rpx;
					font-size: 20rpx;

					text:nth-child(2) {
						margin: 0 10rpx;
					}

					text:nth-child(3) {
						color: red;
					}
				}
			}
		}

		.Pay_methds {
			width: 100%;
			margin-top: 20rpx;
			background-color: #ffffff;

			.Pay_main {
				position: relative;
				width: 97%;
				margin: auto;
				padding: 20rpx 0;
				font-size: 30rpx;

				.Pay_main_content {
					position: relative;
					height: 80rpx;
					width: 100%;
					border-bottom: 1rpx solid #e7e7e7;

					icon {
						position: absolute;
						right: 20rpx;
						line-height: 80rpx;
					}

					text {
						height: 80rpx;
					}

					text:nth-child(1) {
						height: 80rpx;
						width: 80rpx;
						line-height: 80rpx;
						text-align: center;
						font-size: 50rpx;
					}

					.icon-weixinzhifu {
						color: #04be02;
					}

					.icon-zhifubaozhifu {
						color: #1e90ff;
					}

					text:nth-child(2) {
						position: absolute;
						left: 100rpx;
						line-height: 80rpx;
					}

					text:nth-child(3) {
						line-height: 80rpx;
					}
				}
			}
		}

		.bottm_order_nav {
			width: 100%;
			height: 100rpx;
			background-color: #ffffff;
			position: fixed;
			bottom: 0;
			left: 0;

			.bottom_order_cont {
				position: relative;
				position: absolute;
				right: 0;
				bottom: 0;
				width: 70%;
				height: 100rpx;
				line-height: 100rpx;

				text {
					text-align: center;
				}

				text:nth-child(1) {
					color: #666;
					font-size: 20rpx;
				}

				text:nth-child(2) {
					font-size: 26rpx;
					margin: 0 10rpx;
				}

				text:nth-child(3) {
					color: red;
					font-size: 25rpx;
				}

				text:nth-child(4) {
					position: absolute;
					right: 10rpx;
					top: 50%;
					transform: translateY(-50%);
					height: 70rpx;
					width: 240rpx;
					background-color: #d81e06;
					border-radius: 40rpx;
					overflow: hidden;
					text-align: center;
					line-height: 70rpx;
					color: #ffffff;
					font-size: 30rpx;
					font-weight: 700;
				}
			}
		}
	}
</style>
