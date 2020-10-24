<template>
	<view class="Home_wrap">
		<Serach 
		:Fixed="fixed"
		:Userinfo="Userinfo"
		></Serach>
		<Serach v-if="fixed"></Serach>
		<Sweiper ref="swiper" :swipers="swiper"></Sweiper>
		<view class="Home-Top" v-if="showTop">
			<HomeTop></HomeTop>
		</view>
	</view>
</template>
<script>
import Serach from '../../component/index/serach.vue';
import Sweiper from '../../component/index/swiper.vue';
import HomeTop from "../../component/HomeTop.vue"
export default {
	components: {
		Serach,
		Sweiper,
		HomeTop
	},
	data() {
		return {
			swiper: [],
			fixed: false,
			showTop:false,
			Userinfo:{
				iflogin:false,
				userdata:{}
			},
		};
	},
	onLoad() {
		this.getswiper();
	},
	onShow() {
		this.getUserinfo()
	},
	methods: {
		async getswiper() {
			const swiper = await this.$request({
				url: '/home/swiperdata'
			});
			this.swiper = swiper;
		},
		getUserinfo(){
			try{
				const UserInfo = this.$iflogin()
				if(!UserInfo.Userphone_1){
					this.Userinfo.iflogin = false,
					this.Userinfo.userdata = {}
				}else{
					this.Userinfo.iflogin = true,
					this.Userinfo.userdata = UserInfo
				}
			}catch(e){
			}
		},
	},
	onPageScroll(e) {
		try{
			if (e.scrollTop > 0) {
				this.fixed = true;
			} else {
				this.fixed = false;
			}
			if(e.scrollTop>400){
				this.showTop = true
			}else{
				this.showTop = false
			}
		}catch(e){
			
		}
		
	},
	onPullDownRefresh() {
		this.$refs.swiper.getcatelist()
		this.$refs.swiper.getfloorlist()
		setTimeout(()=>{
			uni.stopPullDownRefresh()
		},1000)
	},
	onReachBottom(){
		this.$refs.swiper.Bottomgoods()
	},
};
</script>

<style scoped lang="less">
.Home_wrap {
	.Home-Top{
		position: fixed;
		bottom: 20rpx;
		right: 20rpx;
	}
}
</style>
