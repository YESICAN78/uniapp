<template>
	<view class="Home-top">
		<view class="img" @click.stop="hadleTop($event)">
			<image src="../static/img/hometop.png" mode="widthFix"></image>
		</view>
	</view>
</template>
<script>
	export default{
		name:"HomeTop",
		data(){
			return{
				
			}
		},
		methods:{
			hadleTop(e){
				e.preventDefault()
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 0
				});
			}
		}
	}
</script>

<style scoped lang="less">
	.Home-top{
		.img{
			height: 75rpx;
			width: 75rpx;
			overflow: hidden;
			border-radius: 50%;
			background-color: #FFFFFF;
			vertical-align: middle;
			image{
				height: 75rpx;
				width: 75rpx;
			}
		}
	}
</style>
