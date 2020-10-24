<script>
	export default {
		onLaunch: function() {
			//中间按钮点击事件
			uni.onTabBarMidButtonTap(()=>{
				uni.navigateTo({
					url:"/pages/Add/index",
					animationType: 'slide-in-bottom',
					animationDuration: 200
				})
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./static/reset/reset.css");
	@import url("static/style/iconfont.css");
	page{
		background-color: #e6e6e6;
	}
</style>
