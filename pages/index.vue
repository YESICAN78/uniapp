<template>
	<view class="index">
		<image src="../static/img/index.jpg"></image>
		<view class="inde_main">
			{{message}}
		</view>
		<view class="timebtn" @click="handletime">
			跳过<text>{{count}}</text>
		</view>
	</view> 
</template>

<script>
	const TIME_COUNT = 10
	export default{
		data(){
			return{
				message:"谢谢你在百忙中注册，麻烦大家帮忙注册一下，搭建后台需要数据--谢谢",
				count:'',
				time:null,
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.Time()
		},
		methods:{
			Time(){
				this.count = TIME_COUNT;
				this.Times = setInterval(()=>{
					if(this.count>0 && this.count<=TIME_COUNT){
						this.count--
					}else{
						clearInterval(this.Times)
						this.time = null
						uni.switchTab({
							url:"/pages/Home/index",
						})
					}
				},1000)
			},
			handletime(){
				clearInterval(this.Times)
				uni.switchTab({
					url:"/pages/Home/index",
				})
			}
		},
	}
</script>

<style scoped lang="less">
	.index{
		position: relative;
		width: 100vw;
		height: 100vh;
		image{
			display:block;
			width: 100vw;
			height: 100vh;
		}
		.inde_main{
			position: absolute;
			padding: 0 20rpx;
			top: 10%;
			transform: translateY(-50%);
			width: 100%;
			text-align: center;
			font-size: 50rpx;
			font-weight: 700;
			color: #FFFFFF;
		}
		.timebtn{
			position: absolute;
			width: 140rpx;
			height: 60rpx;
			right: 20rpx;
			bottom: 30rpx;
			border-radius: 30rpx;
			border: 2rpx solid #FFFFFF;
			color: #FFFFFF;
			line-height: 60rpx;
			text-align: center;
			font-size: 30rpx;
		}
	}
</style>
