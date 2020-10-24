<template>
	<view class="FL_wrap">
		<view class="cates_container">
			<!-- 左边滚动区域 -->
			<scroll-view scroll-y class="left_menu">
				<view :class="['ment_item', { active: index === currentIndex }]" v-for="(item, index) in leftMenuList" :key="item.index"@click="handleleftItem(index)">{{ item }}</view>
			</scroll-view>
			<!-- 左边滚动区域结束 -->
			<!-- 右边的滚动区域开始 -->
			<scroll-view class="right_contnent" scroll-y :scroll-top="scrollTop">
				<view class="goods_group" v-for="item in rightContentList" :key="item.cat_id">
					<view class="goods_title">
						<text class="delimiter">/</text>
						<text class="title">{{ item.cat_name }}</text>
						<text class="delimiter">/</text>
					</view>
					<view class="goods_list">
						<view class="navigate" hover-class="none" v-for="item1 in item.children" :key="item1.cat_id" @click="handleItemList(item1.cat_id)">
							<image :src="item1.cat_icon" mode="widthFix"></image>
							<view class="goods_name">{{ item1.cat_name }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 右边的滚动区域结束 -->
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				//左侧的菜单数据
				leftMenuList: [],
				//右边的数据
				rightContentList: [],
				cateList: [],
				//左侧点击选中时的下标
				currentIndex: 0,
				//每次点击菜单 右侧 滚动条 置顶
				scrollTop: 0
			};
		},
		methods: {
			async getcatelist() {
				const res = await this.$request({
					url: '/categories'
				});
				this.cateList = res;
				//把数据存储到本地
				uni.setStorageSync('cates', {
					time: Date.now(),
					data: this.cateList
				});
				//构造左侧的数据
				this.leftMenuList = this.cateList.map(v => v.cat_name);
				//构造右侧的数据
				this.rightContentList = this.cateList[0].children;
			},
			handleleftItem(index) {
				this.currentIndex = index;
				this.rightContentList = this.cateList[index].children;
				this.scrollTop = 0;
			},
			//分类商品跳转到详情页
			handleItemList(id) {
				uni.navigateTo({
					url: `/pages/goods_list/index?cid=${id}`,
					animationType: 'zoom-out',
				})
			}
		},
		onPullDownRefresh() {
			this.getcatelist()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 2000)
		},
		onLoad() {
			//页面打开时 判断本地是否有数据
			const Cates = uni.getStorageSync('cates');
			if (!Cates) {
				this.getcatelist();
			} else {
				//有旧的数据 定义过期时间
				if (Date.now() - Cates.time > 1000 * 10) {
					//10秒后发送请求
					this.getcatelist();
				} else {
					//可以使用旧的数据
					this.cateList = Cates.data;
					//构造左侧的数据
					this.leftMenuList = this.cateList.map(v => v.cat_name);
					//构造右侧的数据
					this.rightContentList = this.cateList[0].children;
				}
			}
		},
		onShow() {}
	};
</script>

<style scoped lang="less">
	.FL_wrap {
		.cates_container {
			/*在less中使用less注意*/
			height: 100vh;
			display: flex;

			.left_menu {
				background-color: #e2e2e2;
				flex: 2;

				view {
					height: 80rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 35rpx;
				}

				.active {
					color: #f95978;
					font-size: 40rpx;
					border-left: 5rpx solid #f95978;
					background-color: #ffffff;
				}
			}

			.right_contnent {
				background-color: #FFFFFF;
				flex: 5;

				.goods_group {
					.goods_title {
						height: 80rpx;
						display: flex;
						justify-content: center;
						align-items: center;

						.delimiter {
							color: #ccc;
							padding: 0 10rpx;
							font-size: 35rpx;
						}

						.title {
							font-size: 35rpx;
						}
					}

					.goods_list {
						display: flex;
						flex-wrap: wrap;

						.navigate {
							width: 33.33%;
							text-align: center;
							margin-bottom: 30rpx;
							font-size: 30rpx;

							image {
								width: 50%;
							}

							.goods_name {}
						}
					}
				}
			}
		}
	}
</style>
