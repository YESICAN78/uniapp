<template>
	<view class="My">
		<view class="My_top">
			<view class="Not_login">
				<view class="My_set">
					<navigator class="navigator" url="/pages/Setinfo/index" open-type="navigate" hover-class="none">
						<text class="iconfont icon-shezhi"></text>
					</navigator>
				</view>
				<view class="login_main" v-if="iflogin">
					<view class="user_log">
						<image src="../../static/img/my.png" mode="widthFix"></image>
					</view>
					<navigator class="login_btn" url="/pages/Login/index" open-type="navigate">
						立即登录
					</navigator>
				</view>
				<view class="Yes_login" v-if="iflogin1">
					<view class="user_log">
						<image :src="Userinfo.Userphoto" mode="widthFix"></image>
					</view>
					<view class="login_name">
						欢迎
						<text style="">{{Userinfo.Userphone_1}}</text>
					</view>
				</view>
				<view class="goods_info">
					<view class="cart_list">
						<view class="cart_list_item">
							<text>{{Userinfo.Userphone_1?Userinfo.Cartgoods.length:'-'}}</text>
							<text>购物车</text>
						</view>
						<view class="cart_list_item">
							<text>{{Userinfo.Userphone_1?Userinfo.Footprint.length:'-'}}</text>
							<text>足迹</text>
						</view>
						<view class="cart_list_item">
							<text>{{Userinfo.Userphone_1?Userinfo.Bill.length:'-'}}</text>
							<text>账单</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="My_bottom">
			<view class="My_bottom_main">
				<text class="title">我的交易</text>
				<view class="user_info">
					<view class="My_transaction" @click="handleUrl(MYFB)">
						<text v-if="Userinfo.Userphone_1" class="iconfont">{{MYFB.length}}</text>
						<text v-else class="iconfont icon-shangpinguanli"></text>
						<text>我发布的</text>
					</view>
					<view class="My_transaction">
						<text v-if="Userinfo.Userphone_1" class="iconfont">{{Userinfo.Mysellout.length}}</text>
						<text v-else class="iconfont icon-qian"></text>
						<text>我卖出的</text>
					</view>
					<view class="My_transaction">
						<text v-if="Userinfo.Userphone_1" class="iconfont">{{Userinfo.Mybuy.length}}</text>
						<text v-else class="iconfont icon-qian"></text>
						<text>我买到的</text>
					</view>
					<view class="My_transaction">
						<text v-if="Userinfo.Userphone_1" class="iconfont">{{Userinfo.Collection.length}}</text>
						<text v-else class="iconfont icon-shoucangguanzhu"></text>
						<text>我的收藏</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 功能区域 -->
		<view class="function">
			<view class="function_main">
				<uni-grid :column="3" :highlight="false" :showBorder="false" :square="true">
					<navigator url="/pages/SecondHandmarket/index" hover-class="none">
						<uni-grid-item class="grid-item">
							<text class="iconfont icon-jishushichang-copy"></text>
							<text class="text">二手市场</text>
						</uni-grid-item>
					</navigator>
					<navigator url="/pages/Address/AddressList" hover-class="none">
						<uni-grid-item class="grid-item">
							<text class="iconfont icon-dingwei"></text>
							<text class="text">地址管理</text>
						</uni-grid-item>
					</navigator>
					<navigator url="/pages/problem/index" hover-class="none">
						<uni-grid-item class="grid-item">
							<text class="iconfont icon-wentifankui"></text>
							<text class="text">问题反馈</text>
						</uni-grid-item>
					</navigator>
				</uni-grid>
			</view>
		</view>
	</view>
</template>
<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	export default {
		components: {
			uniGrid,
			uniGridItem
		},
		data() {
			return {
				iflogin: true,
				iflogin1: false,
				Userinfo: {},
				Cart_List: [],
				//我的发布商品
				MYFB: []
			}
		},
		onLoad() {},
		onShow() {
			this.GetMyFb()
			this.getUserinfo()
		},
		computed: {},
		methods: {
			//获取用户登录信息
			getUserinfo() {
				const userinfo = this.$iflogin()
				if (!userinfo.Userphone_1) {
					this.iflogin = true
					this.iflogin1 = false
					this.Userinfo = {
						Cartgoods: []
					}
				} else {
					this.iflogin = false
					this.iflogin1 = true
					this.$request1({
							url: '/AddCart/Getuserinfo/Getuser',
							method: 'post',
							data: {
								Userid: userinfo._id
							}
						})
						.then(res => {
							uni.setStorageSync('Userinfo', res.data)
							const userinfo = this.$iflogin()
							this.Userinfo = userinfo
						})
						.catch(e => {
							console.log(e);
						});
				}
			},
			//跳转到发布页面
			handleUrl(MYFB) {
				const UserInfo = this.$iflogin()
				if (!UserInfo._id) {
					uni.showActionSheet({
						itemList: ["亲请先登录"],
						itemColor: '#ff0000'
					});
					return
				}
				uni.navigateTo({
					url: "/pages/MyFbu/index?MyFb=" + encodeURIComponent(JSON.stringify(MYFB)),
					animationType: 'pop-in'
				})
			},
			//获取我的发布信息
			GetMyFb() {
				const UserInfo = this.$iflogin();
				if (!UserInfo._id) {

				} else {
					this.$request1({
						url: "/AddCart/Fbu/getMyFb",
						method: "post",
						data: {
							Userid: UserInfo._id
						}
					}).then(res => {
						this.MYFB = res.data
					}).catch(e => {
						console.log(e)
					})
				}
			}
		},
		onPullDownRefresh() {
			this.getUserinfo()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		mounted() {},
		created() {

		},

	}
</script>
<style scoped lang="less">
	.My {
		width: 100vw;

		.My_top {
			position: relative;
			width: 100vw;
			height: 35vh;
			background-color: #F95978;

			.Not_login {
				width: 97%;
				margin: auto;

				.My_set {
					position: fixed;
					top: 0;
					left: 0;
					z-index: 100;
					width: 100%;
					padding-top: 60rpx;
					box-sizing: border-box;

					.navigator {
						position: absolute;
						right: 0;
						width: 30%;

						text {
							display: block;
							text-align: right;
							margin-right: 20rpx;
							font-size: 50rpx;
							color: #FFFFFF;
							font-weight: 700;
						}
					}
				}

				.login_main {
					width: 60%;
					margin: auto;
					padding-top: 100rpx;
					box-sizing: border-box;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;

					.user_log {
						border-radius: 50%;
						overflow: hidden;

						image {
							width: 90rpx;
							height: 90rpx;
						}
					}

					.login_btn {
						width: 200rpx;
						height: 50rpx;
						text-align: center;
						line-height: 50rpx;
						background-color: #e1e1e1;
						font-size: 30rpx;
						margin-top: 20rpx;
						border-radius: 30rpx;
					}
				}

				.Yes_login {
					width: 94%;
					margin: auto;
					padding-top: 100rpx;
					box-sizing: border-box;
					display: flex;

					.user_log {
						border-radius: 50%;
						overflow: hidden;
						width: 90rpx;
						height: 90rpx;

						image {
							width: 90rpx;
							height: 90rpx;
						}
					}

					.login_name {
						margin-left: 20rpx;
						font-size: 40rpx;
						color: #FFFFFF;
						font-weight: 700;
						padding-top: 20rpx;
						box-sizing: border-box;
					}
				}

				.goods_info {
					position: absolute;
					bottom: 80rpx;
					width: 97%;
					margin: auto;

					.cart_list {
						width: 93%;
						height: 80rpx;
						margin: 10rpx auto;
						display: flex;

						.cart_list_item {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;

							text {
								margin-top: 10rpx;
								color: #FFFFFF;
								font-size: 30rpx;
							}
						}
					}
				}
			}
		}

		.My_bottom {
			position: relative;
			width: 100vw;
			background-color: pink;

			.My_bottom_main {
				position: absolute;
				top: -60rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 95%;
				padding: 30rpx;
				background-color: #FFFFFF;
				border-radius: 20rpx;
				overflow: hidden;

				.title {
					font-size: 35rpx;
					font-weight: 700;
				}

				.user_info {
					display: flex;

					.My_transaction {
						margin-top: 20rpx;
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						.iconfont {
							font-size: 50rpx;
							color: #F95978;
							margin-bottom: 20rpx;
						}

						text {
							font-size: 30rpx;
						}
					}
				}
			}
		}

		.function {
			margin-top: 230rpx;
			width: 100%;

			.function_main {
				width: 95%;
				margin: auto;
				padding: 30rpx 20rpx;
				background-color: #FFFFFF;
				border-radius: 20rpx;

				.grid-item {
					text-align: center;
					line-height: 100rpx;

					text:nth-child(1) {
						font-size: 80rpx;
						color: #F95978;
					}

					text:nth-child(2) {
						font-size: 30rpx;
						color: #000000;
					}
				}
			}
		}

	}
</style>
