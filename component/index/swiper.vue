<template>
	<view class="swiper_wrap">
		<swiper class="swiper" :indicator-dots="true" indicator-color="#fff" indicator-active-color="#D81E06" :circular="true"
		 :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item   class="item" v-for="item in swipers" :kye="item.goods_id" @click="listItem(item.goods_id)">
				<view class="swiper-item ">
					<image :src="item.image_src" mode="widthFix"></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- 导航开始 -->
		<view class="index_cate">
			<view v-for="item in catitems" :key="item.name">
				<image :src="item.image_src" mode="widthFix"></image>
			</view>
		</view>
		<view class="">
			<uni-notice-bar scrollable="true" single="true" :text="text" :speed="50" color="#666" showIcon="true"></uni-notice-bar>
		</view>
		<!-- 导航结束 -->
		<!-- 楼层 开始 -->
		<view class="index_floor">
			<view class="floor_group" v-for="item in floorlist" :key="item.index">
				<!-- 标题 -->
				<view class="floor_title">
					<image mode="widthFix" :src="item.floor_title.image_src"></image>
				</view>
				<!-- 类容 -->
				<view class="floor_list">
					<navigator v-for="(item1, index) in item.product_list" :key="item1.name" :url="item1.navigator_url" :open-type=item1.open_type>
						<image :mode="index === 0 ? 'widthFix' : 'scaleToFill'" :src="item1.image_src"></image>
					</navigator>
				</view>
			</view>
		</view>
		<!-- 楼层结束 -->
		<view class="bottomgoods">
			<Bottomgoods ref="math" :Cid="cid"></Bottomgoods>
		</view>
	</view>
</template>
<script>
	import Bottomgoods from "./bottomlikes.vue"
	export default {
		components: {
			Bottomgoods
		},
		data() {
			return {
				text: '哈哈',
				catitems: [],
				floorlist: [],
				cid: 0,
			};
		},
		props: ['swipers'],
		methods: {
			//导航请求数据请求
			async getcatelist() {
				const catitems = await this.$request({
					url: '/home/catitems'
				});
				this.catitems = catitems;
			},
			//楼层数据亲请求
			async getfloorlist() {
				const floorlist = await this.$request({
					url: '/home/floordata'
				});
				this.floorlist = floorlist;
				const index = Math.ceil(Math.random() * 10)
				this.cid = floorlist[index].cat_id
			},
			// 点击挑跳转到相应的详情页
			listItem(id) {
				uni.navigateTo({
					url: `/pages/Goods_detail/index?goods_id=${id}`,
					animationType: 'zoom-out',
					animationDuration: 200
				})
			},
			//触发Bottomgoods事件
			Bottomgoods() {
				this.$refs.math.handleScrollBottom()
			}
		},
		created() {
			this.getcatelist();
			this.getfloorlist();
		},
		mounted() {}
	};
</script>

<style scoped lang="less">
	.swiper_wrap {
		width: 97%;
		margin: auto;
		overflow: hidden;

		.swiper {
			width: 100%;

			.item {
				width: 100%;

				.swiper-item {
					width: 100%;
					vertical-align: middle;

					image {
						width: 100%;
					}
				}
			}
		}

		.index_cate {
			display: flex;

			view {
				padding: 20rpx;
				flex: 1;

				image {
					width: 100%;
				}
			}
		}

		.index_floor {
			.floor_group {
				width: 97%;
				margin: auto;

				.floor_title {
					image {
						width: 100%;
					}
				}

				.floor_list {
					width: 97%;
					margin: auto;

					//清除浮动
					navigator {
						float: left;
						width: 33.33%;

						//后四个连接
						&:nth-last-child(-n + 4) {
							//原图的宽高 323*386
							//第一张图片的高
							height: 30.5vw * 386 / 232 / 2;
							border-left: 11rpx solid #fff;
						}

						image {
							width: 100%;
							height: 100%;
						}

						&:nth-child(2),
						&:nth-child(3) {
							border-bottom: 10rpx solid #fff;
						}
					}
				}
			}
		}

		.bottomgoods {
			width: 97%;
			margin: auto;
		}
	}
</style>
