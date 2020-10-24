<template>
	<view class="goods_list_wrap">
		<view class="serach_wrap">
			<view class="serach_wrap_content">
				<view class="FH" @click="navigateBack">
					<text class="iconfont icon-fanhui"></text>
				</view>
				<view class="serach_box" @click="gotoSerach">
					<text>{{inputvalue}}</text>
				</view>
				<view class="info">...</view>
			</view>
		</view>
		<view class="goods_list_content">
			<Bottomgoods ref="math" :cid="cid"></Bottomgoods>
		</view>
		<view class="Home_top" v-if="ifhsowHome">
			<HomeTop></HomeTop>
		</view>
	</view>
</template>

<script>
	import Bottomgoods from '../../component/index/bottomlikes.vue';
	import HomeTop from "../../component/HomeTop.vue"
	export default {
		components: {
			Bottomgoods,
			HomeTop
		},
		data() {
			return {
				inputvalue:'冬季大甩卖',
				cid: 0,
				ifhsowHome: false
			};
		},
		onLoad(options) {
			this.cid = options.cid;
		},
		onShow() {},
		methods: {
			//返回上一页
			navigateBack() {
				uni.navigateBack(1)
			},
			// 跳转到搜索页面
			gotoSerach(){
				uni.navigateTo({
					url:'/pages/SerachMain/index',
					animationType: 'pop-in'
				})
			}
		},
		onReachBottom() {
			this.$refs.math.handleScrollBottom()
		},
		onPageScroll(e) {
			if (e.scrollTop > 500) {
				this.ifhsowHome = true
			} else {
				this.ifhsowHome = false
			}
		},
		created() {

		},
		mounted() {}
	};
</script>

<style scoped lang="less">
	.goods_list_wrap {
		width: 100vw;
		.serach_wrap {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 20rpx;
			height: 150rpx;
			background-color: #ececec;
			z-index: 20;
			width: 100%;
			.serach_wrap_content {
				position: absolute;
				bottom: 10rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 97%;
				height: 79rpx;
				display: flex;

				.FH {
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;

					.iconfont {
						font-size: 50rpx;
						color: #646566;
					}
				}

				.serach_box {
					flex: 6;
					height: 79rpx;
					width: 100%;
					border: 3rpx solid #F95978;
					border-radius: 50rpx;
					display: flex;
					align-items: center;
					text {
						margin-left: 40rpx;
						font-size: 30rpx;
						color: #b5b5b5;
						
					}
				}

				.info {
					height: 100%;
					flex: 0.5;
					display: flex;
					justify-content: center;
					font-size: 40rpx;
				}
			}
		}

		.goods_list_content {
			padding-top: 190rpx;
		}

		.Home_top {
			position: fixed;
			bottom: 30rpx;
			right: 20rpx;
		}
	}
</style>
