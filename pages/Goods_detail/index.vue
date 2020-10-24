<template>
	<view class="goods_detail">
		<uni-popup ref="popup" type="center" :duration="3000">
			<uni-popup-message type="info" :message="AddSuccess" :duration="2000"></uni-popup-message>
		</uni-popup>
		<view @click="navigateBack" class="iconfont icon-fanhui fanhui" v-if="ifshowfanhui"></view>
		<view :class="['topnav', { opacity: ifopacity }]">
			<view class="Top_nav_box">
				<view class="home_balck" @click="navigateBack">
					<view class="iconfont icon-fanhui"></view>
				</view>
				<view class="top_title">
					<text :class="item.isactive ? 'active' : ''" v-for="(item, index) in TopBar" :key="item.id" @click="HandleTopNav(index)">{{ item.name }}</text>
				</view>
			</view>
		</view>
		<view id="swiper">
			<view class="detail_swiper">
				<swiper :circular="true" :indicator-dots="true" :autoplay="false" indicator-active-color="#F95978">
					<swiper-item v-for="item in goodsObj.pics" :key="item.pics_id" @click="handlePrevewImage(item.pics_mid)">
						<image :src="item.pics_mid ? item.pics_mid : img" mode="widthFix"></image>
					</swiper-item>
				</swiper>
			</view>
			<view class="goods_content">
				<view class="goods_price_main">
					<view class="price">￥{{ goodsObj.goods_price }}</view>
					<view class="collect_tect" @click="HandleCollection">
						<view :class="['iconfont',Collection?'icon-xingxing1':'icon-xingxing']"></view>
						<text>搜藏</text>
					</view>
				</view>
				<view class="goods_name">
					<text>{{ goodsObj.goods_name }}</text>
				</view>
			</view>
		</view>
		<!-- 商品详情信息 -->
		<view id="Goodsinof" class="goods_info">
			<view class="goods_info_title">@商品介绍</view>
			<rich-text class="" :nodes="goodsObj.goods_introduce"></rich-text>
		</view>
		<!-- 商品推荐 -->
		<view id="tuijian" class="recommend_wrap">
			<view class="recommend">
				<view class="recommend_title"><text>看了又看</text></view>
			</view>
			<view class="bottomgoods">
				<Bottomgoods></Bottomgoods>
			</view>
		</view>
		<view class="btm_tool">
			<navigator class="tool_item" url="/pages/customer/index" open-type="navigate">
				<view class="iconfont icon-erji"></view>
				<view>客服</view>
			</navigator>
			<view class="tool_item" @click="handleshare">
				<view class="iconfont icon-fenxiang"></view>
				<view>分享</view>
				<button></button>
			</view>
			<navigator class="tool_item" url="/pages/Cart/index" open-type="switchTab">
				<view class="iconfont icon-gouwuche">
					<text v-if="CartList.length > 0 ? true : false">{{ CartList.length }}</text>
				</view>
				<view>购物车</view>
			</navigator>
			<view class="tool_item btn_cart" @click="handlecartadd">加入购物车</view>
			<view class="tool_item btn_buy" @click="handlegotopay">立即购买</view>
		</view>
		<view class="Home-Top" v-if="showTop">
			<HomeTop></HomeTop>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '../../components/uni-nav-bar/uni-nav-bar.vue';
	import Bottomgoods from '../../component/index/bottomlikes.vue';
	import HomeTop from '../../component/HomeTop.vue';
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		components: {
			Bottomgoods,
			HomeTop,
			uniNavBar,
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				img: 'http://image1.suning.cn/uimg/b2c/newcatentries/0000000000-000000000601395527_1_400x400.jpg',
				//商品的id值
				goods_id: 0,
				goodsObj: {},
				//商品对象
				GoodsInfo: {},
				showTop: false,
				ifopacity: false,
				TopBar: [{
						id: 0,
						name: '商品',
						isactive: true
					},
					{
						id: 1,
						name: '详情',
						isactive: false
					},
					{
						id: 2,
						name: '推荐',
						isactive: false
					}
				],
				ifshowfanhui: true,
				height1: 0,
				height2: 0,
				CartList: [],
				//添加成功
				AddSuccess: "",
				//收藏标记
				Collection: false,
				GoodsID: 0,
				// 地址数组
				Address: [],
			};
		},
		onLoad(Option) {
			const {
				goods_id
			} = Option;
			this.goods_id = goods_id;
			this.getGoodsDetail(goods_id);
			this.getfloorlist();
			this.getCartGoods()
		},
		onShow() {
			this.getAddress()
		},
		methods: {
			open() {
				this.$refs.popup.open()
			},
			//请求详情页数据
			async getGoodsDetail(id) {
				let goods_id = JSON.parse(id);
				const goodsObj = await this.$request({
					url: `/goods/detail?goods_id=${goods_id}`
				});
				this.goodsObj = {
					goods_id: goodsObj.goods_id,
					goods_name: goodsObj.goods_name,
					goods_price: goodsObj.goods_price,
					//iphone部分手机 不能识别 webp图片
					goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
					pics: goodsObj.pics,
					goods_small_logo: goodsObj.goods_small_logo,
				};
				this.GoodsInfo = {
					goods_id: goodsObj.goods_id,
					goods_name: goodsObj.goods_name,
					goods_price: goodsObj.goods_price,
					//iphone部分手机 不能识别 webp图片
					goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
					pics: goodsObj.pics,
					goods_small_logo: goodsObj.goods_small_logo,
				};
			},
			//楼层数据亲请求
			async getfloorlist() {
				const floorlist = await this.$request({
					url: '/home/floordata'
				});
				const index = Math.ceil(Math.random() * 10);
				this.cid = floorlist[index].cat_id;
			},
			//点击顶部导航
			HandleTopNav(index) {
				this.TopBar.forEach((v, i) => (index == i ? (v.isactive = true) : (v.isactive = false)));
			},
			//返回上一页
			navigateBack() {
				uni.navigateBack(1);
			},
			//点击图片方大预览
			handlePrevewImage(e) {
				//1.先构造要预览的图片数组
				const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
				//接收传递过来图片url
				const current = e;
				uni.previewImage({
					current, // 当前显示图片的http链接
					urls, // 需要预览的图片http链接列表
					loop: true,
					longPressActions: {
						itemColor: '#eb4450'
					}
				});
			},
			//购物车跳转
			hanleCartList() {
				uni.switchTab({
					url: '/pages/Cart/CartList',
					animationType: 'zoom-in'
				});
			},
			//获取轮播dom节点
			getswiper(e) {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('#swiper')
					.boundingClientRect(data => {
						this.height1 = data.height;
						let num = data.height;
						if (e.scrollTop < num) {
							this.HandleTopNav(0);
							return;
						}
					})
					.exec();
			},
			//获取详情dom节点
			getxq(e) {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('#Goodsinof')
					.boundingClientRect(data => {
						this.height2 = data.height;
						let num = this.height1 + data.height;
						if (e.scrollTop > this.height1 && e.scrollTop < num) {
							this.HandleTopNav(1);
							return;
						}
					})
					.exec();
			},
			//获取推荐dom节点
			getstj(e) {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('#tuijian')
					.boundingClientRect(data => {
						let num = this.height1 + this.height2 + data.height;
						let height = this.height1 + this.height2;
						if (e.scrollTop > height && e.scrollTop < num) {
							this.HandleTopNav(2);
							return;
						}
					})
					.exec();
			},
			//添加购物车
			handlecartadd() {
				const UserInfo = this.$iflogin()
				if (!UserInfo._id) {
					uni.navigateTo({
						url: '/pages/Login/index',
						animationType: 'slide-in-left',
					});
				} else {
					let goods_Arry = JSON.stringify(this.GoodsInfo.pics)
					if (this.GoodsInfo.goods_small_logo == "") {
						this.GoodsInfo.goods_small_logo = this.img
					}
					this.GoodsInfo.Pics = goods_Arry
					this.GoodsInfo.ifshow1 = true,
						this.GoodsInfo.ifshow2 = false,
						//标记叠加数
						this.GoodsInfo.cont = 1,
						//收藏标记
						this.GoodsInfo.Collection = false,
						//携带用户的id
						this.GoodsInfo.Userid = UserInfo._id,
						this.$request1({
							url: '/AddCart/addcart/addcartlist',
							data: this.GoodsInfo, //传数据给后台
							method: 'post'
						}).then(res => {
							if (res.code == 0) {
								this.AddSuccess = res.message
								this.open()
							} else {
								this.AddSuccess = res.message
								this.open()
							}
							this.getCartGoods()
						}).catch(e => {
							console.log(e)
						})
					UserInfo.Cartgoods.unshift(this.GoodsInfo)
				}
			},
			//足迹
			Footprint() {
				this.ifCollection(this.GoodsID)
				const UserInfo = this.$iflogin()
				if (!UserInfo._id) {

				} else {
					let goods_Arry = JSON.stringify(this.GoodsInfo.pics)
					this.GoodsInfo.Pics = goods_Arry
					this.GoodsInfo.ifshow1 = true,
						this.GoodsInfo.ifshow2 = false,
						this.GoodsInfo.checked = false
					this.GoodsInfo.cont = 1,
						this.GoodsInfo.Userid = UserInfo._id,
						this.$request1({
							url: '/AddCart/addcart/Footprint',
							data: this.GoodsInfo, //传数据给后台
							method: 'post'
						}).then(res => {}).catch(e => {
							console.log(e)
						})
				}
			},
			//请求购物车数据
			getCartGoods() {
				const Userid = this.$iflogin()
				if (!Userid._id) {
					this.CartList = []
				} else {
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
								this.CartList = [v, ...this.CartList];
							});

						})
						.catch(e => {
							console.log(e);
						});
				}
			},
			//分享详情页
			handleshare() {
				const UserInfo = this.$iflogin()
				if(!UserInfo._id){
					uni.navigateTo({
						url: '/pages/Login/index',
						animationType: 'slide-in-left',
					});
				}else{
					plus.share.sendWithSystem({
							content: '分享内容',
							href: 'https://www.dcloud.io/'
						},
						function() {
							console.log('分享成功');
						},
						function(e) {
							console.log('分享失败：' + JSON.stringify(e));
						}
					);
				}
			},
			//跳转客服页
			handlecustomer() {
				var GoodsInfo = JSON.stringify(this.GoodsInfo); // 这里转换成 字符串
				uni.navigateTo({
					url: '../customer/index?goods_info=' + GoodsInfo,
					animationType: 'zoom-in'
				});
			},
			//跳转到支付界面
			handlegotopay() {
				const UserInfo = this.$iflogin();
				if (!UserInfo._id) {
					uni.navigateTo({
						url: '/pages/Login/index',
						animationType: 'slide-in-left',
					});
				} else {
					this.goodsObj.cont = 1;
					if (this.goodsObj.goods_small_logo == "") {
						this.goodsObj.goods_small_logo = this.img
					}
					let arr = [this.goodsObj];
					uni.navigateTo({
						url: `/pages/Pay/index?goodsdata=${encodeURIComponent(JSON.stringify(arr))}&address=${encodeURIComponent(JSON.stringify(this.Address))}`,
						animationType: 'pop-in'
					});
				}
			},
			//收藏事件
			HandleCollection() {
				const UserInfo = this.$iflogin()
				if (!UserInfo._id) {
					uni.navigateTo({
						url: '/pages/Login/index',
						animationType: 'slide-in-left',
					});
				} else {
					let goods_Arry = JSON.stringify(this.GoodsInfo.pics)
					this.GoodsInfo.Pics = goods_Arry
					this.GoodsInfo.ifshow1 = true,
						this.GoodsInfo.ifshow2 = false,
						this.GoodsInfo.checked = false
					this.GoodsInfo.cont = 1,
						this.GoodsInfo.Userid = UserInfo._id,
						this.$request1({
							url: '/AddCart/addcart/Collection',
							data: this.GoodsInfo, //传数据给后台
							method: 'post'
						}).then(res => {
							if (res.code == 0) { //没收藏过
								const goodsid = (res.data[0].Collection[0].goods_id) * 1
								const goodsid1 = this.GoodsInfo.goods_id
								if (goodsid == goodsid1) {
									uni.setStorageSync('Collection', true)
									this.GoodsID = goodsid
									this.ifCollection(goodsid)
									return
								}
							} else { //收藏过
								console.log(res)
								uni.removeStorageSync('Collection')
								this.Collection = false
							}
						}).catch(e => {
							console.log(e)
						})
				}
			},
			//判断是否收藏
			ifCollection(goodsid) {
				const ifColl = uni.getStorageSync('Collection')
				if (ifColl && this.goods_id == goodsid) {
					this.Collection = true
				} else {
					this.Collection = false
				}
			},
			//获取收货地址
			getAddress() {
				const AddressItem = uni.getStorageSync('Address')
				this.Address = AddressItem
			},
		},
		onReady() {
			this.getswiper();
			this.getxq();
			this.getstj();
		},

		created() {

		},
		mounted() {
			setTimeout(() => {
				this.Footprint()
			}, 10000)
		},
		beforeMount() {

		},
		onPageScroll(e) {
			this.getswiper(e);
			this.getxq(e);
			this.getstj(e);
			if (e.scrollTop > 0) {
				this.ifopacity = true;
				this.ifshowfanhui = false;
			} else {
				this.ifopacity = false;
				this.ifshowfanhui = true;
			}
			if (e.scrollTop > 500) {
				this.showTop = true;
			} else {
				this.showTop = false;
			}
		}
	};
</script>

<style scoped lang="less">
	.goods_detail {
		width: 97vw;
		margin: auto;

		.fanhui {
			position: fixed;
			height: 80rpx;
			width: 80rpx;
			top: 70rpx;
			left: 20rpx;
			z-index: 110;
			border-radius: 50%;
			overflow: hidden;
			font-size: 30rpx;
			text-align: center;
			line-height: 80rpx;
			font-weight: 600;
			background: rgba(0, 0, 0, 0.4);
		}

		.topnav {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			width: 100vw;
			height: 150rpx;
			opacity: 0;

			.Top_nav_box {
				position: relative;
				width: 98%;
				height: 60rpx;
				margin: 70rpx auto;
				box-sizing: border-box;

				.home_balck {
					position: absolute;
					left: 10rpx;
					height: 80rpx;
					width: 80rpx;
					text-align: center;
					line-height: 80rpx;
					font-size: 30rpx;
					font-weight: 600;
					border-radius: 50%;
					overflow: hidden;
				}

				.top_title {
					position: absolute;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);

					text {
						font-size: 30rpx;
						margin: 0 20rpx;
					}

					.active {
						border-bottom: 8rpx solid #d81e06;
					}
				}
			}
		}

		.opacity {
			background-color: #ffffff;
			opacity: 1;
		}

		.detail_swiper {
			swiper {
				height: 50vh;
				text-align: center;

				swiper-item {
					vertical-align: middle;

					image {
						width: 100%;
					}
				}
			}
		}

		.goods_content {
			width: 100%;
			background-color: #ffffff;

			.goods_price_main {
				display: flex;
				height: 70rpx;
				padding: 50rpx 0;
				box-sizing: border-box;
				align-items: center;

				.price {
					flex: 6;
					color: red;
					font-size: 40rpx;
					font-weight: 700;
				}

				.collect_tect {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;

					text {
						flex: 0.5;
						font-size: 25rpx;
					}
				}
			}

			.goods_name {
				padding: 40rpx 0;
				box-sizing: border-box;

				text {
					font-size: 35rpx;
					font-weight: 700;
				}
			}
		}

		.goods_info {
			margin-top: 30rpx;
			background-color: #ffffff;

			.goods_info_title {
				padding: 20rpx 0;
				font-size: 30rpx;
			}
		}

		.recommend_wrap {
			margin-bottom: 90rpx;

			.recommend {
				background-color: #ffffff;
				margin-top: 20rpx;
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;

				.recommend_title {
					padding: 40rpx 20rpx;

					text {
						font-size: 30rpx;
						font-weight: 700;
						border-left: 10rpx solid #d81e06;
					}
				}
			}
		}

		.btm_tool {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 90rpx;
			background-color: #fff;
			display: flex;

			.tool_item {
				flex: 1;
				display: flex;
				font-size: 30rpx;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				position: relative;

				.iconfont {
					font-size: 45rpx;
					position: relative;

					text {
						position: absolute;
						top: 10rpx;
						left: 30rpx;
						z-index: 20;
						height: 30rpx;
						width: 40rpx;
						border-radius: 30rpx;
						background-color: red;
						font-size: 20rpx;
						text-align: center;
						line-height: 30rpx;
						color: #ffffff;
					}
				}

				button {
					position: absolute;
					top: 0;
					left: 0;
					height: 100%;
					width: 100%;
					opacity: 0;
				}
			}

			.button {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 0;
			}

			.btn_cart {
				flex: 2;
				display: flex;
				margin: 10rpx 10rpx 10rpx 0;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background-color: #ffa500;
				color: #fff;
				font-size: 30rpx;
				font-weight: 700;
				border-radius: 50rpx;
			}

			.btn_buy {
				flex: 2;
				margin: 10rpx 10rpx 10rpx 0;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background-color: #eb4450;
				color: #fff;
				font-size: 30rpx;
				font-weight: 700;
				border-radius: 50rpx;
			}
		}

		.Home-Top {
			position: fixed;
			bottom: 95rpx;
			right: 20rpx;
		}
	}
</style>
