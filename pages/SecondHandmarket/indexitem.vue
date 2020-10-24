<template>
	<view class="Add_detailes">
		<view class="Add_detailes_main">
			<view class="User_info">
				<view class="photo">
					<image :src="Item_list.User_id.Userphoto" mode="widthFix"></image>
				</view>
				<view class="User_box">
					<view class="phone">
						{{Item_list.User_id.Userphone_1.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")}}
					</view>
					<view class="address">
						<text>发布于:</text>
						<text>{{Item_list.goods_address}}{{Item_list.goods_data|getTime}}</text>
					</view>
				</view>


			</view>
			<view class="goods_price">
				<text>￥{{Item_list.goods_newprice}}</text>
				<text>￥{{Item_list.goods_oldprice}}</text>
			</view>
			<view class="content">
				<view class="goods_name">
					{{Item_list.goods_name}}
				</view>
				<view class="goods_img_box">
					<view class="img_item" v-for="item in Item_list.goods_img" @click="handleimge(Item_list.goods_img)">
						<image :src="item" mode="widthFix"></image>
					</view>
				</view>
				<view class="goods_browse">
					<text>浏览{{Item_list.goods_browse}}</text>
				</view>
			</view>
		</view>
		<transition name="up">
			<view :class="['Nav_bottom',{'showNav':shownav}]">
				<view class="">
					 <button style="padding: 0; margin: 0;height: 100%;border: none;"@click="handleorder(Item_list)"  type="warn">立即下单</button>
				</view>
			</view>
		</transition>

	</view>
</template>

<script>
	function toTow(num) {
		return (num < 10 ? "0" : "") + num;
	}
	export default {
		data() {
			return {
				Item_list: {},
				scroll: 0,
				shownav: true,
				Address:[],
			}
		},
		onLoad(options) {
			const item = JSON.parse(decodeURIComponent(options.goods_item));
			this.Item_list = item;
		},
		onShow() {
			this.getAddress()
		},
		filters: {
			getTime(val) {
				let date = new Date(val);
				let YY = toTow(date.getFullYear()),
					MM = toTow(date.getMonth() + 1),
					DD = toTow(date.getDate()),
					H = toTow(date.getHours()),
					M = toTow(date.getMinutes()),
					S = toTow(date.getSeconds());
				return `${YY}/${MM}/${DD}/${H}:${M}:${S}`;
			}
		},
		methods: {
			handleorder(Item_list){
				let ItemArr = []
				ItemArr.push(Item_list)
				uni.navigateTo({
					 url:`/pages/Pay/index?goodsdata=${encodeURIComponent(JSON.stringify(ItemArr))}&address=${encodeURIComponent(JSON.stringify(this.Address))}`,
					animationType: 'slide-in-left',
				});
			},
			//获取收货地址
			getAddress(){
				const AddressItem = uni.getStorageSync('Address')
				this.Address=AddressItem
			},

			handleimge(imgArr) {
				uni.previewImage({
					urls: imgArr,
				});
			},
			updatabrowse() {
				let goods_id = this.Item_list._id;
				//10秒钟更新数据
				setTimeout(() => {
					this.$request1({
						url: "/AddCart/Fbu/updatabrowse",
						method: 'post',
						data: {
							goods_id: goods_id
						}
					}).then(res => {
						console.log(res)
					}).catch(e => {
					
					})
				}, 10000)
			},

		},
		mounted() {
			this.updatabrowse()
		},
		created() {
		
		},
		destroyed() {
			uni.$off('updatabrowse', this.updatabrowse)
		},
		onPageScroll(e) {
			if (this.scroll > e.scrollTop) {
				this.shownav = false
			} else {
				this.shownav = true
			}
			this.scroll = e.scrollTop;
		}
	}
</script>

<style scoped lang="less">
	.Add_detailes {
		position: relative;
		width: 100vw;
		background-color: #FFFFFF;

		.Add_detailes_main {
			padding-top: 10rpx;
			padding-bottom: 100rpx;
			width: 95%;
			margin: auto;

			.User_info {
				padding-bottom: 15rpx;
				display: flex;
				border-bottom: 1rpx solid #CCCCCC;

				.photo {
					width: 70rpx;
					height: 70rpx;
					border-radius: 10rpx;
					overflow: hidden;

					image {
						width: 70rpx;
					}
				}

				.User_box {
					margin-left: 20rpx;
					flex: 10;

					.phone {
						margin-bottom: 20rpx;
						font-size: 30rpx;
						font-weight: 700;
					}

					.address {
						color: #8f8f8f;
						text {
							margin-left: 10rpx;
							font-size: 25rpx;
						}
					}
				}
			}

			.goods_price {
				height: 100rpx;
				line-height: 100rpx;
				width: 100%;

				text:nth-child(1) {
					color: red;
					font-size: 50rpx;
					font-weight: 800;
				}

				text:nth-child(2) {
					color: #CCCCCC;
					font-size: 25rpx;
					margin-left: 20rpx;
					text-decoration: line-through
				}
			}

			.content {
				width: 100%;

				.goods_name {
					line-height: 40rpx;
					text-spacing: 10rpx;
					font-size: 30rpx;
					font-weight: 700;
				}

				.goods_img_box {
					margin-top: 30rpx;
					border-radius: 30rpx;
					overflow: hidden;

					.img_item {
						image {
							width: 100%;
						}
					}
				}

				.goods_browse {
					position: relative;
					width: 100%;
					height: 50rpx;

					text {
						color: #CCCCCC;
						font-size: 30rpx;
						line-height: 50rpx;
						position: absolute;
						right: 0;
					}
				}
			}
		}

		.Nav_bottom {
			position: fixed;
			width: 100%;
			height: 100rpx;
			bottom: -100rpx;
			background-color: red;
		}
		
		.showNav {
			position: fixed;
			width: 100%;
			height: 100rpx;
			bottom: 0;
			background-color: red;
		}
	}
</style>
