<template>
	<view class="Bottomgoods">
		<view class="goods_item" v-for="(item,index) in goodsList" :key="item.index"  @click="handdledetail(item.goods_id)">
			<view class="img-box">
				<image :src="item.goods_small_logo?item.goods_small_logo:img" mode="widthFix"></image>
			</view>
			<view class="content">
				<text>
						{{item.goods_name}}
				</text>
			</view>
			<view class="price">
				<text>
					￥{{item.goods_price}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			img: 'http://image1.suning.cn/uimg/b2c/newcatentries/0000000000-000000000601395527_1_400x400.jpg',
			//接口要的参数
			QueryParams: {
				query: '',
				cid: this.cid,
				pagenum: 1,
				pagesize: 10
			},
			goodsList: [],
					//总页数
			totalPages: 1,
		}
	},
	props:["cid"],
	methods:{
		async GoodsListItem(){
			const goodslist = await this.$request({
				url: '/goods/search?data=' + this.QueryParams,
			})
			const total = goodslist.total;
			//计算总页数
			this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
			this.goodsList = [...this.goodsList, ...goodslist.goods]
		},
		//滚动触底事件
		handleScrollBottom(){
			//判断是否有下一页数据
			if(this.QueryParams.pagenum >= this.totalPages){
				//没有下一页数据了
			 uni.showToast({
					 title: '没有数据了',
					 duration: 1500,
					 mask:true
			 });
			}else{
				//还有下一页数据
				this.QueryParams.pagenum++;
				this.GoodsListItem()
			}
		},
		handdledetail(id){
			uni.navigateTo({
				url:`/pages/Goods_detail/index?goods_id=${id}`,
				animationType: 'zoom-out',
			})
		},
	},
	created() {
  this.GoodsListItem()
	},
	mounted() {
		
	},
	destroyed() {

	}
}
</script>

<style scoped lang="less">
	.Bottomgoods{
		width: 96%;
		margin: auto;
		display:flex;
		flex-wrap:wrap;
		justify-content: space-between;
		.goods_item{
			position: relative;
			width: 49%;
			height: 500rpx;
			margin: 10rpx 0;
			border-radius: 15rpx;
			overflow: hidden;
			background-color: #FFFFFF;
			.img-box{
				vertical-align: middle;
				image{
					width: 100%;
				}
			}
			.content{
				padding:0 10rpx ;
				font-size: 30rpx;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:2;
				overflow: hidden;
				
			}
			.price{
				position: absolute;
				left: 20rpx;
				bottom: 10rpx;
				text{
					font-size: 30rpx;
					color: red;
				}
			}
		}
	}
</style>
