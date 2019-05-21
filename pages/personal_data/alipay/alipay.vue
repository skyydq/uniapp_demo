<template>
	<view class="uni-padding-wrap">
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<input type="text" v-model="text" :placeholder="placeholderText" />
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import graceChecker from '@/common/graceChecker.js'
	import {updateALiPay,updateWechat} from '@/common/getData.js'
	import {mapState,mapActions} from 'vuex'
	export default {
		data() {
			return {
				text: '',
				target:null,
				info:'',
			};
		},
		onLoad(e){
			this.target=e.target
		},
    onShow(){
      uni.setNavigationBarTitle({
      	title:this.placeholderText.replace('请输入','')
      })
      if(this.target==='alipay'){
        this.text=this.member.alipayAccount?this.member.alipayAccount:'';
      }else{
       this.text=this.member.wechatAccount?this.member.wechatAccount:'';
        }
    },
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				let rule = [{name: "text",checkType: "notnull",checkRule: "",errorMsg: `请输入${this.placeholderText}`}],
					data={
						text:this.text,
					},
					checkRes = graceChecker.check(data, rule);
				if(!checkRes){
					uni.showToast({
						title:graceChecker.error,
						icon:'none'
					})
					return false;
				}
				//
				uni.showLoading({
					mask:true
				})
				if(this.target=='alipay'){
					this.info={alipayAccount:this.text};
					
					updateALiPay(this.info).then(this.updateMember).catch(res=>{
						uni.showToast({
							title:'请求超时，请检查网络',
							icon:'none'
						})
					})
				}else{
					this.info={wechatAccount:this.text};
					updateWechat(this.info).then(this.updateMember).catch(res=>{
						uni.showToast({
							title:'请求超时，请检查网络',
							icon:'none'
						})
					})
				}
			}
		},
		computed:{
      ...mapState('module_0',['member']),
			placeholderText(){
				if(this.target==='alipay'){
          
					return `请输入支付宝账号`
				}else {
					return `请输入微信账号`
				}
			}
		},
		methods: {
			...mapActions('module_0', ['changemember']),
			updateMember(res){
				let result=res.data;
				if(result.code==1){
					this.changemember(this.info);
          setTimeout(()=>{
            uni.navigateBack();
          },1500)
          
				}
				uni.showToast({
					title:result.msg,
					icon:'none'
				})
			}
		}
	}
</script>

<style>

</style>
