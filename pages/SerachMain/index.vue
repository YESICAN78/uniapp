<template>
	<view class="SerachMain">
		<view class="header_serach">
			<uni-nav-bar @clickLeft="handleLeft" @clickRight="handleRight" :shadow="true" left-icon="back">
				<view slot="default" class="center_Serach">
					<view class="serach_box">
						<text class="iconfont icon-sousuo"></text>
						<input type="text" v-model="serachvalue" @input="input" placeholder="输入要搜索的类容" />
						<text class="iconfont icon-quxiao" v-show="ifshowdeletebtn" @click="deletevalue"></text>
					</view>
				</view>
				<view slot="right">
					<text class="Serach_btn">搜索</text>
				</view>
			</uni-nav-bar>
		</view>
		<view class="Serach_content">
			<view class="serachlist" v-if="serachlist.length>0">
				<view class="item" v-for="item in serachlist" :key="item.goods_id" @click="listItem(item.goods_id)">
					{{item.goods_name}}
				</view>
			</view>
			<view class="Serach_historay" v-else>
				<view class="Serach_h_header">
					<text>历史搜索</text>
					<text class="iconfont icon-shanchu" @click="deletehistoray"></text>
				</view>
				<view class="hietoray_list">
					<text @click="handlehistoray(item)" v-for="(item,index) in Inputarray" :key="index">{{item}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	export default {
		components: {
			uniNavBar,
			uniSearchBar
		},
		data() {
			return {
				//搜索返回的数据
				serachlist: [],
				serachvalue: '',
				Inputarray: [],
				// 是否显示清楚输入框按钮
				ifshowdeletebtn: false,
			}
		},
		onLoad() {

		},
		onShow() {
			this.getinputhistoray()
		},
		methods: {
			//点击返回
			handleLeft() {
				uni.navigateBack(1)
			},
			//点击搜索按钮搜索
			handleRight() {
				let value = this.serachvalue;
				if (!value == "") {
					this.qserach(value)
					this.SetinputValue(value)
				} else {
					this.emptyfunc('请输入搜索类容')
				}
			},
			//点击输入框的按钮搜索
			confirm(e) {
				let value = this.serachvalue;
				if (!value == "") {
					this.qserach(value)
					this.SetinputValue(value)
				} else {
					this.emptyfunc('请输入搜索类容')
				}

			},
			//请求方法
			async qserach(query) {
				if (!query == "") {
					let res = await this.$request({
						url: "/goods/qsearch?query=" + query,
						method: 'get'
					})
					this.serachlist = res
					if (res.length == 0) {
						this.emptyfunc('该类容无法搜索请谅解')
					}
				} else {
					this.emptyfunc('请输入搜索类容')
				}
			},
			//保存搜索历史
			SetinputValue(value) {
				this.Inputarray = []
				let inputhistoray = uni.getStorageSync("inputhistoray")
				let inputvalueArray = [...inputhistoray];
				inputvalueArray.unshift(value)
				let Arr = new Set(inputvalueArray)
				let NewArr = Array.from(Arr)
				uni.setStorageSync("inputhistoray", NewArr)
				let inputArray = uni.getStorageSync("inputhistoray")
				this.Inputarray = inputArray
			},
			//获取搜索历史
			getinputhistoray() {
				this.Inputarray = []
				this.Inputarray = uni.getStorageSync("inputhistoray")
			},
			// 监听输入框事件
			input(e) {
				const value = e.target.value;
				if (!value == "") {
					this.ifshowdeletebtn = true
				} else {
					this.ifshowdeletebtn = false
				}
			},
			// 清楚输入框的类容按钮
			deletevalue() {
				this.serachvalue = "";
				this.serachlist = []
				this.ifshowdeletebtn = false
			},
			//点击搜索历史
			handlehistoray(item) {
				this.serachvalue = item;
				this.ifshowdeletebtn = true
				this.qserach(item)
			},
			//删除搜索历史
			deletehistoray() {
				uni.showModal({
					title: '提示',
					content: '你确定要删除吗？',
					success: (res) => {
						if (res.confirm) {
							uni.removeStorageSync("inputhistoray")
							this.getinputhistoray()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 类容为空的提示方法
			emptyfunc(v) {
				uni.showActionSheet({
					itemList: [v],
					itemColor: '#ff0000'
				});
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
	}
</script>

<style scoped lang="less">
	.SerachMain {
		width: 100vw;
		min-height: 100vh;
		background-color: #ffffff;

		.header_serach {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 100;
			width: 100%;
			padding-top: 60rpx;
			box-sizing: border-box;
			background-color: #FFFFFF;

			.center_Serach {
				position: relative;
				width: 530rpx;
				height: 65rpx;
				margin: auto;
				border-radius: 40rpx;
				border: 1rpx solid #C0C0C0;

				.serach_box {
					width: 80%;
					height: 100%;
					line-height: 65rpx;

					.iconfont {
						float: left;
						padding: 0 10rpx;
						box-sizing: border-box;
						line-height: 65rpx;
						color: #C0C0C0;
					}

					input {
						position: absolute;
						left: 60rpx;
						height: 100%;
						line-height: 65rpx;
						width: 70%;
					}

					.icon-quxiao {
						position: absolute;
						right: 10rpx;
						font-size: 40rpx;
					}
				}

			}

			.Serach_btn {
				font-size: 35rpx;
			}
		}

		.Serach_content {
			width: 95%;
			margin: auto;
			padding-top: 140rpx;

			.serachlist {
				margin-top: 50rpx;

				.item {
					width: 100%;
					height: 80rpx;
					font-size: 30rpx;
					line-height: 80rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
					border-bottom: 0.5rpx solid #ccc;
				}
			}

			.Serach_historay {
				width: 100%;

				.Serach_h_header {
					position: relative;
					height: 100rpx;
					font-size: 40rpx;
					color: #C8C7CC;
					line-height: 100rpx;

					.iconfont {
						position: absolute;
						right: 0;
						font-size: 40rpx;
					}
				}

				.hietoray_list {
					margin: 30rpx 0;

					text {
						margin: 10rpx;
						display: inline-block;
						height: 50rpx;
						background-color: #e2e1e6;
						border-radius: 15rpx;
						padding: 10rpx 30rpx;
						line-height: 35rpx;
						text-align: center;
						font-size: 30rpx;
					}
				}
			}

		}
	}
</style>
