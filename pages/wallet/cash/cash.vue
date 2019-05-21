<template>
	<view class="uni-padding-wrap">
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner uni-center">
					当前可提现余额 {{walletFixed}}
				</view>
			</view>
		</view>
		<view class="uni-card">
			<view class="uni-card-input-inner uni">
				<input type="number" class="uni-input" :placeholder="placeWord" v-model="applyAmount" />
			</view>
		</view>
		<trans-password ref="password" className="inputPd0" placeholder="请输入交易密码"></trans-password>
		<view class="btn-box">
			<button type="primary" @tap="submit">提交申请</button>
		</view>
		<view class="tip">说明：提交申请后，平台将在72小时内进行审核，同意后可发起“卖出聚德”，等待匹配打款。</view>
	</view>
</template>

<script>
	import transPassword from '@/components/trans_password'
	import {cashApply,walletOverage,crashApplyParams} from '@/common/getData'
	import graceChecker from '@/common/graceChecker.js'
	export default {
		components: {
			transPassword
		},
		data() {
			return {
				walletAmount:'--',
				applyAmount:'',
			  minCashAmount:'',
			  blockCashAmount:''
			};
		},
		onShow(){
			walletOverage().then(res=>{
				let result=res.data;
				if(result.code==='1'){
					this.walletAmount=result.data;
				}
			})
		  crashApplyParams().then(res=>{
		    let result=res.data;
		    if(result.code==='1'){
		      this.minCashAmount=result.data.minCashAmount;
		      this.blockCashAmount=result.data.blockCashAmount;
          
		    }
		  })
		},
		computed:{
		  placeWord(){
		    return '请输入提现金额（最小金额为'+this.minCashAmount+','+this.blockCashAmount+'倍数）'
		  },
      walletFixed(){
        return Number(this.walletAmount)?Number(this.walletAmount).toFixed(2):'--'
      }
		},
		methods:{
			submit(){
				let rule = [{
						name: "payPassword",
						checkType: "reg",
						checkRule: "^[a-zA-Z0-9]{6,20}$",
						errorMsg: "请输入正确格式的交易密码"
					}],
				data = {
					payPassword:this.$refs.password.password,
					applyAmount:this.applyAmount
				},
				checkRes = graceChecker.check(data, rule);
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: 'none'
					})
					return false;
				}
        if(this.walletAmount-this.minCashAmount<0){
          uni.showToast({
          	title: '当前可提现金额不足起提金额'+this.minCashAmount+'元',
          	icon: 'none'
          })
          return false;
        }else if(this.applyAmount-this.minCashAmount<0){
          uni.showToast({
          	title: '输入金额小于起提金额'+this.minCashAmount+'元',
          	icon: 'none'
          })
          return false;
        }else if(this.applyAmount-this.walletAmount>0){
          uni.showToast({
          	title: '输入金额大于当前可提现余额',
          	icon: 'none'
          })
          return false;
        }else if((this.applyAmount-this.minCashAmount)%this.blockCashAmount>0){
          uni.showToast({
          	title: '提现金额超出'+this.minCashAmount+'部分必须为'+this.blockCashAmount+"的倍数",
          	icon: 'none'
          })
          return false;
        }
				uni.showLoading({
					mask:true
				})
				cashApply(data).then(res=>{
					let result=res.data;
					if(result.code==='1'){
						setTimeout(()=>{
							uni.navigateBack()
						},1500)
					}
					uni.showToast({
						title:result.msg,
						icon:'none'
					})
				}).catch(res=>{
					uni.showToast({
						title:'请求超时，请检查网络',
						icon:'none'
					})
				})
			}
		}
	}
</script>

<style lang="less">
  page{
    background-color: #1A1A24;
  }
	.uni-padding-wrap {
		overflow: hidden;
	}

	.uni-input {
		position: relative;
    padding-left: 0;
		&:after {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 1px;
			background-color: #ccc;
			transform: scaleY(0.5);
		}
	}

	.uni-card-input-inner {
		padding: 15upx 30upx;
	}

	.btn-box {
		margin-top: 60upx;
	}

	.tip {
		margin-top: 60upx;
		color: #999;
	}
</style>
