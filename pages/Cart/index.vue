<template>
	<view class="Cart_wrap">
		<view class="Cart_header_main">
			<view class="Cart_header_list1" v-if="ifTopNav1">
				<view class="Cart_cart">
					<text>购物车</text>
					<text @click="handleifshowbom">{{ toptitle ? '管理' : '完成' }}</text>
				</view>
				<view class="Cart_address">
					<text>共{{ Cart_List.length }}件宝贝</text>
					<text>收货地址:</text>
					<text>{{Address.length>0?Address[0].Address_address:"请添加地址"}}</text>-
				</view>
			</view>
			<view class="Cart_header_list2" v-if="ifTopNav2">
				<view class="Cart_list_cont">购物车({{ Cart_List.length }})</view>
				<view class="Cart_guanli" @click="handleifshowbom">{{ toptitle ? '管理' : '完成' }}</view>
			</view>
		</view>
		<view class="goods_list_main">
			<view class="Cart_list_main" v-for="(item, index) in Cart_List" :key="item._id">
				<view class="radio_box" @click="handlechecked(item)">
					<radio value="r1" :checked="item.checked" />
				</view>
				<view class="img_box" @click="listItem(item.goods_id)">
					<image :src="item.goods_small_logo" mode="widthFix"></image>
				</view>
				<view class="goods_list_content">
					<view class="goods_name" @click="listItem(item.goods_id)">{{ item.goods_name }}</view>
					<view class="price_main">
						<view class="price_box">
							<text>￥{{ item.goods_price }}</text>
							<text @click="handleifshow(item, index)" v-if="item.ifshow1">x{{ item.cont }}</text>
						</view>
						<view class="goodsCont" v-if="item.ifshow2">
							<view class="list">
								<text @click="handleCont(item, -1)">-</text>
								<text>{{ item.cont }}</text>
								<text @click="handleCont(item, 1)">+</text>
								<text @click="handleoffcont(item, index)">X</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="Kon_cart" v-if="Cart_List.length<=0">
				<image src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=416722945,3632396234&fm=26&gp=0.jpg" mode="widthFix"></image>
			</view>
		</view>
		<view class="Cart_clear">
			<view class="Cart_list_wrap">
				<view class="Clear_main">
					<view class="radio_box" @click="handleBtomChecked">
						<radio value="全选" :checked="btomchecked" />
						全选
					</view>
				</view>
				<view class="clear_goods_list">
					<view class="cont_price" v-if="ifshowbom1">
						<view class="sum">包含运费</view>
						<text>合计:</text>
						<text>￥{{ totalPrice }}</text>
						<text @click="handlenavgetto">结算({{ totalNum }})</text>
					</view>
					<view class="clear_mair" v-if="ifshowbom2" @click="handledeleteCartList"><text>删除</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Bottomgoods from '../../component/index/bottomlikes.vue';
	export default {
		components: {
			Bottomgoods,
		},
		data() {
			return {
				//底部全选控制
				btomchecked: false,
				toptitle: true,
				//显示值
				ifTopNav1: true,
				ifTopNav2: false,
				//底部导航数据
				ifshowbom1: true,
				ifshowbom2: false,
				//购物车数据
				Cart_List: [],
				//总价格
				totalPrice: 0,
				//总数量 
				totalNum: 0,
				//地址数组
				AddrssArryList: [],
				Address: [],
			};
		},
		onLoad() {
			this.getCartGoods();
		},
		onShow() {
			this.getAddress()
			this.getCartGoods();
		},
		computed:{
			isselectAll(){
				return 23;
			}
		},
		methods: {
			handleifshow(item, index) {
				item.ifshow1 = false;
				item.ifshow2 = true;
			},
			handleoffcont(item, index) {
				item.ifshow2 = false;
				item.ifshow1 = true;
			},
			//是否选中商品
			handlechecked(item) {
				item.checked = !item.checked;
				this.setCart(item);
			},
			//计算价格
			setCart(cart) {
				//重新计算总价格 和 总数量
				let allchecked = true;
				//总价格 总数量
				let totalPrice = 0;
				let totalNum = 0;
				this.Cart_List.forEach(v => {
					if (v.checked) {
						totalPrice += v.cont * v.goods_price;
						totalNum += v.cont;
					} else {
						allchecked = false;
					}
				});
				//判断数组是否为空
				allchecked = this.Cart_List.length != 0 ? allchecked : false;
				this.btomchecked = allchecked;
				this.totalPrice = totalPrice;
				this.totalNum = totalNum;
			},
			//点击下面全选
			handleBtomChecked() {
				this.btomchecked = !this.btomchecked;
				this.Cart_List.forEach(v => (v.checked = !v.checked));
				this.setCart(this.Cart_List);
			},
			//改变数量
			handleCont(item, num) {
				if (num == -1) {
					//减少数量
					item.cont -= 1;
					this.setCart(item);
					if (item.cont <= 1) {
						item.cont = 1;
						uni.showActionSheet({
							itemList: ["不能在减少了"],
							itemColor: '#00ff7f'
						});
					}
				} else {
					//增加数量
					item.cont += 1;
					this.setCart(item);
				}
			},
			//点击管理事件
			handleifshowbom() {
				this.toptitle = !this.toptitle;
				if (this.toptitle) {
					(this.ifshowbom1 = true), (this.ifshowbom2 = false);
				} else {
					(this.ifshowbom1 = false), (this.ifshowbom2 = true);
				}
			},
			//请求购物车数据
			getCartGoods() {
				const Userid = this.$iflogin()
				if (!Userid._id) {
					this.Cart_List = []
					this.Address = []
				} else {
					this.Cart_List = Userid.Cartgoods
					this.$request1({
							url: '/AddCart/addcart/getCartgoods',
							method: 'get',
							data: {
								Userid: Userid._id
							}
						})
						.then(res => {
							this.Cart_List = []
							let goodsdata = res.data[0].Cartgoods
							goodsdata.forEach((v, i) => {
								v.Pics = JSON.parse(v.Pics);
								this.Cart_List = [v, ...this.Cart_List];
							});

						})
						.catch(e => {
							console.log(e);
						});
				}

			},
			//解析地址方法
			AddressMap(Address) {
				let AddressArry = Address.map((v, i) => {
					if (v.Address_shoewAddress) {
						return v;
					}
				})
				this.AddrssArryList = [...AddressArry];
			},
			//点击结算跳转到订单页面
			handlenavgetto() {
				//选中的商品
				let newgoodsdata = [];
				//判断是否选中商品
				this.Cart_List.forEach(v => {
					if (v.checked) newgoodsdata = [...newgoodsdata, v];
				});
				if (newgoodsdata.length > 0) {
					uni.navigateTo({
						url: `/pages/Pay/index?goodsdata=${encodeURIComponent(JSON.stringify(newgoodsdata))}&address=${encodeURIComponent(JSON.stringify(this.Address))}`,
						animationType: 'pop-in'
					});
				}
			},
			//删除购物车数据
			handledeleteCartList() {
				var Userid = this.$iflogin()
				this.Cart_List.forEach((v, i) => {
					if (v.checked) {
						//删除操作
						this.Cart_List.splice(i, 1);
						//改变数据库购物车数据请求
						this.$request1({
								url: '/AddCart/addcart/deleteCartList',
								method: 'post',
								data: {
									Userid: Userid._id,
									goodsid: v._id,
								}
							})
							.then(res => {
								console.log(res)
								if (res.code == 0) {
									uni.showToast({
										title: res.message,
										icon: 'success'
									});
								}
								setTimeout(() => {
									this.Cart_List = []
									this.$request1({
											url: '/AddCart/addcart/getCartgoods',
											method: 'get',
											data: {
												Userid: Userid._id
											}
										})
										.then(res => {
											this.CartList = []
											let goodsdata = res.data[0].Cartgoods
											goodsdata.forEach((v, i) => {
												v.Pics = JSON.parse(v.Pics);
												this.Cart_List = [v, ...this.Cart_List];
											});
										})
										.catch(e => {
											console.log(e);
										});
								}, 1000)
							})
							.catch(e => {
								console.log(e)
							});
					}
				});
			},
			//获取收货地址
			getAddress() {
				const AddressItem = uni.getStorageSync('Address')
				this.Address = AddressItem
			},
			//点击跳转到相应的详情页
			listItem(id) {
				uni.navigateTo({
					url: `/pages/Goods_detail/index?goods_id=${id}`,
					animationType: 'zoom-out',
					animationDuration: 200
				})
			},

		},
		onPageScroll(e) {
			if (e.scrollTop > 0) {
				this.ifTopNav1 = false;
				this.ifTopNav2 = true;
			} else {
				this.ifTopNav1 = true;
				this.ifTopNav2 = false;
			}
		},
		onPullDownRefresh() {
			this.getCartGoods()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		created() {

		},
		mounted() {}
	};
</script>

<style scoped lang="less">
	.Cart_wrap {
		width: 100vw;

		.Cart_header_main {
			width: 98%;
			position: fixed;
			left: 50%;
			transform: translateX(-50%);
			z-index: 20;
			padding-top: 60rpx;
			background-color: #f9f9f9;

			.Cart_header_list1 {
				.Cart_cart {
					position: relative;
					height: 50rpx;

					text:nth-child(1) {
						position: absolute;
						left: 5rpx;
						top: 0;
						font-size: 50rpx;
						font-weight: 700;
						line-height: 50rpx;
					}

					text:nth-child(2) {
						position: absolute;
						right: 5rpx;
						top: 0;
						font-size: 30rpx;
						height: 100%;
						line-height: 50rpx;
					}
				}

				.Cart_address {
					position: relative;
					padding: 20rpx 0;
					font-size: 30rpx;
					color: #666666;

					text:nth-child(2) {
						margin: 0 15rpx;
					}

					text:nth-child(3) {
						position: absolute;
						left: 300rpx;
						top: 50%;
						transform: translateY(-50%);
						width: 400rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
				}
			}

			.Cart_header_list2 {
				position: fixed;
				height: 100rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 100%;
				background-color: #f9f9f9;

				.Cart_list_cont {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					font-size: 40rpx;
				}

				.Cart_guanli {
					position: absolute;
					right: 0;
					top: 0;
					font-size: 30rpx;
					height: 100%;
					line-height: 50rpx;
				}
			}
		}

		.goods_list_main {
			padding-top: 200rpx;
			padding-bottom: 100rpx;
			width: 98%;
			margin: auto;

			.Cart_list_main {
				margin: 20rpx auto;
				border-radius: 20rpx;
				display: flex;
				background-color: #ffffff;

				.radio_box {
					flex: 0.5;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				.img_box {
					flex: 2;
					display: flex;
					justify-content: center;
					align-items: center;

					image {
						width: 200rpx;
						height: 200rpx;
					}
				}

				.goods_list_content {
					position: relative;
					flex: 5;
					height: 200rpx;
					width: 100%;
					padding: 0 10rpx;

					.goods_name {
						font-size: 30rpx;
						margin-top: 20rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3;
						overflow: hidden;
					}

					.price_main {
						position: relative;
						position: absolute;
						bottom: 10rpx;
						right: 0;
						width: 100%;
						height: 80rpx;

						.price_box {
							width: 100%;

							text:nth-child(1) {
								line-height: 80rpx;
								font-size: 30rpx;
								font-weight: 700;
								color: red;
							}

							text:nth-child(2) {
								position: absolute;
								top: 50%;
								right: 20rpx;
								transform: translateY(-50%);
								font-size: 30rpx;
								height: 40rpx;
								line-height: 40rpx;
								text-align: center;
								border: 1rpx solid #666666;
								border-radius: 10rpx;
							}
						}

						.goodsCont {
							position: absolute;
							top: 50%;
							transform: translateY(-35%);
							width: 300rpx;
							height: 80rpx;
							right: 10rpx;

							.list {
								width: 100%;
								height: 100%;
								display: flex;

								text {
									height: 60rpx;
									width: 80rpx;
									line-height: 60rpx;
									border: 1rpx solid black;
									text-align: center;
									font-size: 40rpx;
								}

								text:nth-child(1) {
									width: 60rpx;
									border-top-left-radius: 10rpx;
									border-bottom-left-radius: 10rpx;
								}

								text:nth-child(2) {
									width: 100rpx;
									border-left: none;
									border-right: none;
								}

								text:nth-child(3) {
									width: 60rpx;
									border-top-right-radius: 10rpx;
									border-bottom-right-radius: 10rpx;
								}

								text:nth-child(4) {
									height: 60rpx;
									width: 60rpx;
									margin-left: 20rpx;
									border-radius: 50%;
									background-color: pink;
									color: #ffffff;
									border: none;
								}
							}
						}
					}
				}
			}

			.Kon_cart {
				width: 98%;
				margin: auto;
				height: 400rpx;
				line-height: 400rpx;
				text-align: center;
				font-size: 50rpx;
				color: #CBCBCB;

				image {
					width: 100%;
				}
			}
		}

		.Cart_clear {
			position: fixed;
			bottom: 0;
			left: 0;
			background-color: #ffffff;
			width: 100%;
			height: 100rpx;

			.Cart_list_wrap {
				position: relative;
				width: 97%;
				height: 100%;
				margin: auto;

				.Clear_main {
					width: 120rpx;
					height: 100%;

					.radio_box {
						line-height: 100rpx;
						font-size: 30rpx;
						color: #cccccc;
					}
				}

				.clear_goods_list {
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					height: 100%;
					width: 80%;

					.cont_price {
						position: relative;
						width: 100%;

						text {
							margin-bottom: -24rpx;
						}

						.sum {
							color: #cccccc;
							margin-bottom: 10rpx;
							font-size: 25rpx;
						}

						text:nth-child(2) {
							font-size: 25rpx;
							color: #636363;
						}

						text:nth-child(3) {
							color: #d81e06;
							font-size: 25rpx;
						}

						text:nth-child(4) {
							position: absolute;
							right: 0;
							top: 50%;
							transform: translateY(-25%);
							padding: 10rpx 20rpx;
							font-size: 40rpx;
							margin-left: 10rpx;
							color: #ffffff;
							font-weight: 700;
							background-color: #d81e06;
							border-radius: 50rpx;
							overflow: hidden;
						}
					}

					.clear_mair {
						position: absolute;
						right: 0;
						line-height: 100rpx;

						text {
							padding: 10rpx 40rpx;
							margin-left: 20rpx;
							font-size: 40rpx;
							color: #ffffff;
							font-weight: 700;
							background-color: #d81e06;
							border-radius: 50rpx;
							overflow: hidden;
						}
					}
				}
			}
		}
	}
</style>
