//计数同时异步请求的次数()
let ajaxTimes = 0;
export const request = (params) => {
	ajaxTimes++;
	uni.showLoading({
		title: "加载中...",
		mask: true
	}) 
	/**
	 * 在安卓手机注意:地址必须是电脑的ip地址
	 * */ 
	const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + params.url,
			method:params.methods||"GET",
			data:params.data || {},
			dataType:params.dataType || "json",
			header:{
				"content-type":"application/x-www-form-urlencode"
			},
			success: (res) => {
				resolve(res.data.message)
			},
			fail: (err) => { 
				console.log(err)
			},
			complete: () => {
				ajaxTimes--;
				if (ajaxTimes === 0) {
					//等所有的请求完毕后才关闭加载效果
					uni.hideLoading()
				}
			}
		})
	})
}

