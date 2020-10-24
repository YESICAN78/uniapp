<template>
	<view class="Successpay">
		支持成功
	</view>
</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			hh(){
				// uni.requestPayment({
				// 	provider: 'alipay',
				// 	orderInfo: `app_id=2016102600762104&charset=UTF-8&version=1.0&timestamp=2020-11-011 08:08:08&method=alipay.trade.app.pay&notify_url=http://192.168.43.127:9090/#/pages/Pay/successpay&sign_type=RSA2&sign=RZYhvvNJECExJPywjVywaw==&version=1.0&biz_content= {
				// 		"body": "对一笔交易的具体描述信息。如果是多种商品，请将商品描述字符串累加传给body。",
				// 		"subject": "大乐透",
				// 		"out_trade_no": "70501234111S001111119",
				// 		"timeout_express": "90m",
				// 		"total_amount": "4800.00",
				// 		"product_code": "QUICK_MSECURITY_PAY",
				// 		"tips": "测试一笔支付"
				// 	}`, //微信、支付宝订单数据
				// 	success: function(res) {
				// 		console.log('success:' + JSON.stringify(res));
				// 	},
				// 	fail: function(err) {
				// 		console.log('fail:' + JSON.stringify(err));
				// 	}
				// });
				// let TYPE = '';
				// this.Pay.forEach(v => v.iconshow ? TYPE = v.tpye : TYPE = 'wxpay')
				// this.$request1({
				// 	url: TYPE == 'alipay' ? '/AddCart/orderPay/Alipay' : '/AddCart/orderPay/wxpay',
				// 	method: 'post',
				// 	data: {
				// 		subject: "缴费",
				// 		price: this.totalPrice,
				// 		time: new Date().getTime()
				// 	}
				// }).then(res => {
				// 	console.log(res)
				// 	this.alipayWap = res;
				// 	this.$nextTick(() => {
				// 		this.$refs.alipayWap.children[0].submit();
				// 	})
				// 	console.log(res)
				// }).catch(e => {})
			}
		}
	}
</script>

<style>
</style>
