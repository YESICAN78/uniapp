import baseUrl from '../config/config.js'
//计数同时异步请求的次数()
let ajaxTimes = 0;
export const MRequest = (params) => {
	const Method = params.method.toUpperCase()
	ajaxTimes++;
	uni.showLoading({
		title: "加载中...",
		mask: false
	})
	/**
	 * 真机调试的时候不能用本地的localhost 需要使用
	 * 电脑的IPv4地址  通过 cmd  ipconfig 查看
	 * */
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + params.url,
			method: Method,
			data: params.data || {},
			dataType: params.dataType || "json",
			header: Method == 'GET' ? { 
				'X-Requested-With': 'XMLHttpRequest',
				"Accept": "application/json",
				"Content-Type": "application/json; charset=UTF-8"
			} : {
				'X-Requested-With': 'XMLHttpRequest',
				'Content-Type': 'application/json; charset=UTF-8'
			},
			success: (res) => { 
				resolve(res.data)
			},
			fail: (err) => {
				 reject(err.data);
				console.log(err);
				uni.showToast({
						title: '请检查网络连接',
						icon: 'none'
				})
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
