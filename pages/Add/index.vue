<template>
	<view class="Add_wrap">
		<uni-popup style="z-index: 200;" ref="popup1" type="dialog">
			<uni-popup-dialog  title="是否保存当前信息？" type="info" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
		<uni-popup style="z-index: 200;margin-top: 50rpx;" ref="popup2" type="message">
			<uni-popup-message type="warn" message="商品信息不能为空" :duration="2000"></uni-popup-message>
		</uni-popup>
		<uni-popup style="z-index: 200;" ref="popup3" type="message">
			<uni-popup-message type="warn" :message="Message" :duration="2000"></uni-popup-message>
		</uni-popup>
		<view class="Add_main">
			<view class="header_nav">
				<view class="Add_Nav">
					<text @click="navigateBack">取消</text>
					<text>发布</text>
					<text @click="release">发布</text>
				</view>
			</view>
			<view class="textarea">
				<textarea @blur="bindTextAreaBlur" placeholder-style="color:#666" :placeholder="text" />
				</view>
			<view class="Goodsimg_wrap">
				<view class="Goodsimg_main">
					<view class="Goodsimg_list">
						<uni-grid :column="3" :showBorder="false">
						    <uni-grid-item class="grid-item" v-for="(item,index) in Selectimg" :key="index">
										<text class="iconfont icon-quxiao" @click="DeleteImg(item,index)"></text>
						        <image @click="preview(item,index)" :src="item"></image>
						    </uni-grid-item>
								<uni-grid-item class="last_item" v-if="Selectimg.length>=9?false:true">
								    <text @click="Selectpc" class="iconfont icon-jiahao"></text>
								</uni-grid-item>
						</uni-grid>
					</view> 
				</view>
			</view>
			<view class="address_wrap">
				<view class="address_main">
					<text class="iconfont icon-dingwei"></text>
					<text>发货位置:</text>
					<text>{{Goodsaddress.province}}</text>
					<text>{{Goodsaddress.city}}</text>
					<text>{{Goodsaddress.district}}</text>
				</view> 
			</view>
			<view class="goods_pirce"  @click="open">>
				<view class="pirce_box">
					<text class="iconfont icon-jiagebaohu"></text>
					<text>价格</text>
							<text>{{GoodsList.newprice?(function(){
								if(Number.isInteger((GoodsList.newprice)*1)){
									return ((GoodsList.newprice)*1).toFixed(2)
								}else{
									return GoodsList.newprice
								}
							})():"￥0.00"}} 
							</text>
							<text>{{GoodsList.free}}</text>
					<text class="iconfont icon-fanhui1"></text>
				</view>
			</view>
			<uni-popup style="z-index: 100;" ref="popup" type="share">
				<view class="cont_price" :style="{height:Keyheight?(Keyheight/10)+20:Keyheight1 +'vh'}">
					<view class="price_content">
						<view class="new_price">
							<text>价格</text>
							<input  @focus="handleinput(1)" type="digit" v-model="GoodsList.newprice" placeholder="￥0.00" />
						</view> 
						<view class="old_price">
							<text>入手价</text>
							<input @focus="handleinput(2)" type="digit" v-model="GoodsList.oldprice"  placeholder="￥0.00" />
						</view>
						<view class="freight">
							<text>运费</text>
							<input @focus="handleinput(3)" :type="checked? 'text' : 'digit'" v-model="GoodsList.free" placeholder="￥0.00"/>
							<checkbox-group>
									<label style="font-size: 30rpx;" @click="ifchecked">
											<checkbox  :checked="checked"/>包邮
									</label>
							</checkbox-group>
						</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>
<script>
	import uniGrid from "@/components/uni-grid/uni-grid.vue"
	import uniGridItem from "@/components/uni-grid-item/uni-grid-item.vue"
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	
	import baseUrl from '../../config/config.js'
  export default {
	components: {
				uniGrid,
				uniGridItem, 
				uniPopup,
        uniPopupMessage,
        uniPopupDialog
				},
	data() {
		return { 
			text:"品牌型号,新旧程度,转手原因...",
			Selectimg:[],
			Goodsaddress:{},
			checked:false,
			//数据键盘
			Keyheight:500,
			Keyheight1:50,
			Num:['1','2','3','4','5','6','7','8','9','.','0'],
			GoodsList:{
				Content:"",
				Img:[],
				oldprice:"",
				newprice:"",
				free:""
			},
			Message:'',
			
		};
	},
	onLoad() {
		
	},
	onShow() {
		this.Address()
		
	},
	methods: {
		//点击不保存
		 close(done){
			done()
			uni.navigateBack(1);
		},
		//点击保存
		 confirm(done,value){
			 console.log(done,value)
			done()
	},
		bindTextAreaBlur(e) {
			this.GoodsList.Content = e.detail.value;
		},
	   Selectpc() {
			uni.chooseImage({
				count: 9, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], //从相册选择
				success:(res)=>{
					var that = this;
					let imgArry = [...this.Selectimg,...res.tempFilePaths];
					this.Selectimg = imgArry;
				//上传图片接口
				let tempFilePaths = res.tempFilePaths
				var  Arr = []
				for (var i = 0; i < tempFilePaths.length; i++) {
					uni.uploadFile({
						url: `${baseUrl}/AddCart/addcart/Uploade`,
						filePath: tempFilePaths[i],
						name: 'file',
						method: "POST",
						header: {
							'X-Requested-With': 'XMLHttpRequest',
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						},
						success:(res) => { 
							let arr = JSON.parse(res.data)
							let  Arr1 = [arr]
							let Arr2 = Arr1.map(v=>v.GoodsImg)
							Arr.push(...Arr2)
							this.GoodsList.Img = Arr;
						},
						fail: function fail(err) {
							console.log(err)
						}
					})
				}
				}
			});
		},
		preview(item,index){
			// 预览图片
			uni.previewImage({
					urls: this.Selectimg,
			}); 
		},
		//删除图片
		DeleteImg(item,index){
			this.Selectimg.forEach((v,i)=>{
				if(index===i){
					this.Selectimg.splice(i,1)
					return
				}
			})
		},
		open(){
		  this.$refs.popup.open()
		 },
		navigateBack() {
			this.$refs.popup1.open()
		},
		
		//发布商品
		release(){
			//构造要发布的商品信息
			if(!this.GoodsList.Content || !this.GoodsList.oldprice || !this.GoodsList.newprice || !this.GoodsList.free){
				this.$refs.popup2.open()
			}else{
				const Userid = this.$iflogin()
				if(!Userid._id){
					uni.navigateTo({
						url: '/pages/Login/index',
						animationType: 'slide-in-left',
					});
					return
				}
				this.GoodsList.Userid = Userid._id;
				this.GoodsList.Username = Userid.Userphone_1;
				this.GoodsList.address = this.Goodsaddress.province+this.Goodsaddress.city+this.Goodsaddress.district;
				this.$request1({
					url:'/AddCart/Fbu/product',
					method:'post',
					data:this.GoodsList
				}).then(res=>{ 
					if(res.code==0){
						this.GoodsList = {}
						uni.showToast({
							 title:res.message,
							 duration: 1000,
						})
						uni.navigateTo({
							url: '/pages/SecondHandmarket/index',
							animationType: 'slide-in-left',
						});
					}else{
						this.Message = res.message
						this.$refs.popup3.open()
					}
				}).catch(e=>{
					console.log(e)
				})
				
			}
		},
		Address(){
			uni.getLocation({
			    type: 'wgs84',
					geocode:true,
			    success:(res)=>{
						this.Goodsaddress = res.address
			    }
			});
		},
		handleinput(){
			//监听键盘的高度变化
			uni.onKeyboardHeightChange(res=>{
				this.Keyheight = res.height;
			})
		},
		ifchecked(){
			this.checked = !this.checked;
			if(this.checked){
				this.GoodsList.free = "包邮"
			}else{
				this.GoodsList.free = ""
			}
		}
	}
};
</script>

<style scoped lang="less">
.Add_wrap {
	width: 100vw;
	background-color: #FFFFFF;
	.Add_main{
		margin:auto;
		width: 100%;
		height: 100%;
		.header_nav{
			position: fixed;
			padding-top: 70rpx;
			padding-bottom: 20rpx;
			width: 100%;
			background-color: #FFFFFF;
			z-index: 100;
		.Add_Nav{
			width: 97%;
			margin: auto;
			display: flex;
			text:nth-child(1){
				flex:1;
				display: flex;
				align-items: center;
				font-size: 30rpx;
			}
			text:nth-child(2){
				flex:5;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 40rpx;
				font-weight: 700;
			}
			text:nth-child(3){
				flex:1.5;
				padding: 14rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30rpx;
				border-radius: 40rpx;
				background-color: #D81E06;
			}
		}
	}
		.textarea{
			padding-top: 140rpx;
			width: 97%;
			margin: auto;
			textarea{
				width: 100%;
				padding: 10rpx 10rpx 0 10rpx ;
			}
		}
		.Goodsimg_wrap{
			width: 100%;
			margin-top:30rpx;
			.Goodsimg_main{
				width: 97%;
				margin: auto;
				.Goodsimg_list{
					width: 100%;
					image{
						width: 100%;
						width: 100%;
					}
					.grid-item{
						position: relative;
						margin: 5rpx 0rpx;
						text-align: center;
						text{
							position:absolute;
							top: -10rpx;
							right: 0;
							z-index: 20;
							font-size: 50rpx;
							text-align: center;
							color: #D81E06;
						}
					}
					.last_item{
						background-color: #CCCCCC;
						margin: 5rpx 2rpx;
						.iconfont{
							height: 100%;
							width: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							font-size: 100rpx;
							font-weight: 600;
							color: #666666;
						}
					}
				}
			}
		}
		.address_wrap{
			width: 97%;
			height: 60rpx;
			margin: 30rpx auto;
			.address_main{
				height: 100%;
				background-color: #e5e5e5;
				border-radius: 30rpx;
				line-height: 60rpx;
				padding-left: 20rpx;
				display:-webkit-box;
				-webkit-box-orient:vertical;
				-webkit-line-clamp:1;
				overflow: hidden;
				text{
					height: 60rpx;
					line-height: 60rpx;
					margin: 0 5rpx;
					font-size: 30rpx;
					color: #9d9d9d;
				}
				text:nth-child(1){
					font-size: 30rpx;
				}
			}
		}
		.goods_pirce{
			width: 100%;
			border-top: 1rpx solid #CCCCCC;
			border-bottom: 1rpx solid #CCCCCC;
			.pirce_box{
				padding: 20rpx 0;
				width: 97%;
				line-height: 60rpx;
				margin: auto;
				position: relative;
				text:nth-child(1){
					color: #CCCCCC;
					font-size: 40rpx;
				}
				text:nth-child(2){
					position:absolute;
					font-size: 30rpx;
					left: 50rpx;
				}
				text:nth-child(3){
					position:absolute;
					right: 100rpx;
					margin-right: 20rpx;
					font-size: 30rpx;
					font-weight: 700;
					color: red;
				}
				text:nth-child(4){
					position:absolute;
					right: 40rpx;
					font-size:30rpx;
					font-weight: 700;
					color: #666666;
				}
				text:nth-child(5){
					position: absolute;
					right: 0;
					font-size:40rpx;
					color: #666666;
				}
				span{
					
				}
			}
		}
		.cont_price{
			width: 100%; 
			background-color: #FFFFFF;
			border-top-left-radius: 30rpx;
			border-top-right-radius: 30rpx;
			overflow: hidden;
			.price_content{
				width: 95%;
				margin: auto;
				padding-top: 20rpx;
				.new_price,.old_price{
					padding: 40rpx 0;
					display: flex;
					border-bottom: 1rpx solid #CCCCCC;
					height: 70rpx;
					justify-content: center;
					align-items: center;
					}
					text{
						flex:1;
						text-align: center;
						font-size: 30rpx;
					}
					input{
						flex:6;
						font-size: 25rpx;
				}
				.freight{
					height: 70rpx;
					line-height: 70rpx;
					display: flex;
					align-items: center;
					text{
						line-height: 70rpx;
						flex:1;
						text-align: center;
					}
					input{
						flex:2;
						display: flex;
						justify-content: center;
					}
					checkbox-group{
						flex:4;
						color: #CCCCCC;
						text-align: right;
					}
				}
			}
			.Key_num{
				width: 100%;
				height: calc(50vh - 250rpx);
				display: flex;
				.num_r{
					flex:4;
					display: flex;
					flex-wrap: wrap;
					justify-content: space-around;
					text{
						width: 33.33%;
						height: 25%;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 40rpx;
						font-weight: 700;
						border-left: 1rpx solid #CCCCCC;
						border-bottom: 1rpx solid #CCCCCC;
					}
					text:nth-child(1){
						border-top: 1rpx solid #CCCCCC;
					}
					text:nth-child(2){
						border-top: 1rpx solid #CCCCCC;
					}
					text:nth-child(3){
						border-top: 1rpx solid #CCCCCC;
						border-right: 1rpx solid #CCCCCC;
					}
					text:nth-child(6){
						border-right: 1rpx solid #CCCCCC;
					}
					text:nth-child(12){
						font-size: 50rpx;
					}
				}
				.num_l{
					flex:1;
					display: flex;
					flex-direction: column;
					text:nth-child(1){
						display: flex;
						height: 50%;
						font-size: 70rpx;
						justify-content: center;
						align-items: center;
						border-top: 1rpx solid #CCCCCC;
					}
					text:nth-child(2){
						display: flex;
						height: 50%;
						font-size: 50rpx;
						font-weight: 700;
						background-color: #D81E06;
						justify-content: center;
						align-items: center;
					}
				}
			}
		}
	}
}
</style>
