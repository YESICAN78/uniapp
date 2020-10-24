export const iflogin = ()=>{
	let userInfo = {}
	const getinfo = uni.getStorageSync('Userinfo') || {};
	if(!getinfo.Userphone_1){
		userInfo = {}
	}else{
		userInfo = getinfo
	}
	return userInfo
}
