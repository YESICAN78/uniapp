<template>
	<view class="problem">
		<view class="problem_main">
			<view class="title">
				反馈类型
			</view>
			<radio-group class="uni-list" @change="radioChange">
				<view class="type">
					<view class="type_item" v-for="(item,index) in radioItems" :key="index">
						<radio :id="item.name" :value="item.name" :checked="item.checked"></radio>
						<text>{{item.name}}</text>
					</view>
				</view>
			</radio-group>
			<view class="problem_content">
				<view class="textarea">
					<textarea @blur="bindTextAreaBlur" placeholder-style="color:#666" :placeholder="text" />
					</view>
			</view>
			<view class="contact">
				<input class="input"  @input="input" type="text" v-model="from.contact_type"  placeholder="请填写你的联系方式(QQ或手机号)" />
			</view>
			
		</view>
		<view class="btn">
			<button type="warn" @click="Submit" >提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				text:"您的反馈或建议会使我们的软件更加完美",
				radioItems: [{
						id: 1,
						name: "产品建议",
						checked: true,
					},
					{
						id: 2,
						name: "程序错误",
						checked: false,
					},
					{
						id: 3,
						name: "缺少类容",
						checked: false,
					},
				],
				changed:{},
				from:{
					Feedback_type:0,
					Sub_content:'',
					contact_type:''
				}
			}
		},
		onLoad() {

		},
		onShow() {

		},
		methods: {
			radioChange: function(e) {
				var checked = e.target.value
				var changed = {}
				for (var i = 0; i < this.radioItems.length; i++) {
					if (checked.indexOf(this.radioItems[i].name) !== -1) {
						changed['radioItems[' + i + '].checked'] = true
					} else {
						changed['radioItems[' + i + '].checked'] = false
					}
				}
				this.changed=changed;
			},
			bindTextAreaBlur(e) {
					this.from.Sub_content = e.detail.value;
			},
			input(e) {
					this.from.contact_type = e.detail.value;
			},
			Submit(){
				const Userid = this.$iflogin();
				const Contact_Type=[]
				for(let key in this.changed){
					Contact_Type.push(this.changed[key])
				}
				Contact_Type.forEach((v,i)=>v?this.from.Feedback_type=i:"")
				if(!Userid._id){
					uni.navigateTo({
						url: '/pages/Login/index',
						animationType: 'slide-in-left',
					});
					return
				}
				if(this.from.Sub_content==""||this.from.contact_type==""){
					uni.showActionSheet({
						itemList: ["请您填写完整建议类容"],
						itemColor: '#ff0000'
					});
					return
				}
				this.from.Userphone = Userid.Userphone_1;
				this.$request1({
					url:"/AddCart/problem/",
				  method:'post',
				  data:this.from
				}).then(res=>{
					uni.showToast({
						 title:res.message,
						 duration: 1000,
					})
					setTimeout(()=>{
						uni.switchTab({
							url: '/pages/My/index',
							animationType: 'slide-in-right',
						})
					},2000)
				}).catch(e=>{
					uni.showActionSheet({
						itemList: ["网络错误"],
						itemColor: '#ff0000'
					});
				})
			}
		}
	}
</script>

<style scoped lang="less">
	.problem {
		width: 100vw;
		background-color: #FFFFFF;
		.problem_main {
			width: 97%;
			margin: auto;

			.title {
				width: 100%;
				height: 70rpx;
				font-size: 30rpx;
				line-height: 80rpx;
				border-bottom: 1rpx solid #C0C0C0;
			}

			.uni-list {
				.type {
					height: 100rpx;
					padding: 20rpx 0;
					display: flex;
					justify-content: center;
					align-items: center;
					border-bottom: 1rpx solid #C8C7CC;

					.type_item {
						flex: 1;

						text {
							font-size: 35rpx;
						}
					}
				}
			}
			.problem_content{
				margin: 30rpx 0;
				width: 100%;
				padding: 20rpx 10rpx;
				border: 1rpx solid #C0C0C0;
				border-radius: 20rpx;
				overflow: hidden;
				.textarea{
					
				}
			}
			.contact{
				padding: 10rpx;
				margin-bottom: 40rpx;
				height: 70rpx;
				line-height: 70rpx;
				border: 1rpx solid #C0C0C0;
				border-radius: 10rpx;
				overflow: hidden;
			}
		}
		.btn{
			width: 97%;
			margin: auto;
		}
	
	}
</style>
