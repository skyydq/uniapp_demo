import {checkBankAndPayPasswd} from './getData.js'
export const checkPayPass=(callback)=>{
	uni.showLoading({
		mask:true
	})
	checkBankAndPayPasswd().then(res=>{
		let result=res.data;
		if(result.code==='0'){
			uni.showModal({
				content: result.msg,
				showCancel: false,
				confirmColor:'#E5BC2D',
				confirmText: "确定",
				success(){
					uni.navigateTo({
						url:'/pages/personal_data/personal_data'
					})
				}
			})
		}else{
			callback()
		}
	}).finally(()=>{
		uni.hideLoading()
	})
}