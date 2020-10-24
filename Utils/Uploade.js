export const Uploade = (Params) => {
	//上传图片到服务器
	return new Promise((resolve, reject) => {
		var  Arr = []
		for (var i = 0; i < Params.filePath.length; i++) {
			uni.uploadFile({
				url: "http://192.168.100.3:9090" + Params.url,
				filePath: Params.filePath[i],
				name: 'file',
				method: "POST",
				header: {
					'X-Requested-With': 'XMLHttpRequest',
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				success:(res) => {
					let h = JSON.parse(res.data)
					let  Arr1 = [h]
					let j = Arr1.map(v=>v.GoodsImg)
					Arr.push(...j)
					resolve(Arr)
					console.log(Arr)
				},
				fail: function fail(err) {
					console.log(err)
				}
			})
		}
	})
}
