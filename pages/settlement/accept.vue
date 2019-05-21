<template>
	<view>
		<view class="uni-page-head">
			<view class="icon iconfont icon-tongzhi"></view>
			<view class="text">
				收到已打款通知后尽快进行收款确认，如果超过2小时未确认，系统将强制确认，并且您的账号将被临时关闭。
			</view>
		</view>

		<view class="uni-padding-wrap">
			<view class="title">
				打款人信息：
			</view>
			<view class="uni-card">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							打款人账号： {{info.supplyMemberAccount}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							打款人真实姓名： {{info.supplyMemberName}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							打款人手机号： {{info.supplyMemberTelephone}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							打款人上级手机号： {{info.supplyParentTelephone}}
						</view>
					</view>
					
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							需打款金额： {{info.remitAmount}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							打款时间：{{info.remitTime}}
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-last">
						<view class="uni-list-cell-navigate">
							<view>收款确认倒计时：<text class="warn">{{countDownTime}}</text></view>
						</view>
					</view>
					
				</view>
			</view>
			<!--  -->
			<view class="title">
				<view>对方转账的收款账号 *</view>

			</view>
			<view class="uni-card">
				<view class="uni-card-content-inner" v-for="item in receiptWay">
					<block v-if="item==1">
						银行卡：{{info.receiptMemberBankNumber?info.receiptMemberBankNumber:""}}
					</block>
					<block v-else-if="item==2">
						微信：{{info.receiptMemberWechatAccount?info.receiptMemberWechatAccount:''}}
					</block>
					<block v-else>
						支付宝：{{info.receiptMemberAlipayAccount?info.receiptMemberAlipayAccount:""}}
					</block>
				</view>
			</view>
			<view class="title">
				对方的打款凭证截图 *
			</view>
			<view class="uni-card">
				<view class="uni-card-content-inner">
					<image v-for="(item, i) in imageList" :key="i" class="preview_img" @click="previewImage(item)"  :src="item" mode="aspectFit"></image>
				</view>
			</view>
			<view class="title">
				输入交易密码：
			</view>
			<transPassword ref="password"></transPassword>
			<view class="btn-box">
				<button type="primary" @tap="submit">确认收款并通知对方</button>
			</view>
		</view>

	</view>
	</view>
</template>

<script>
	import {dealDetail,dealReceipt} from '@/common/getData'
	import transPassword from '@/components/trans_password'
	import graceChecker from '@/common/graceChecker'
	import {getCountDown} from '@/common/until'
	export default {
		components: {
			transPassword
		},
		data() {
			return {
				info:{},
				countDownTime:'',
				receiptWay:[],
				imageList: [],
			};
		},
		onLoad(e) {
			dealDetail({
				id: e.id
			}).then(res => {
				let result = res.data;
				if (result.code === '1') {
					this.info = result.data;
					this.countDown(result.data.receiptDeadTime);
					this.receiptWay=result.data.receiptWay?result.data.receiptWay.split(','):[];

					this.imageList.push(result.data.remitImageUrl?result.data.remitImageUrl:'')
				}
			})
		},
		methods: {
			countDown(data) {
       if(!data){
         return ''
       }
				let time=data.replace(/-/g,':').replace(' ',':').split(':');
				time = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]).getTime();
				var nowTime = new Date().getTime();
				var count = time - nowTime;
				if (count <= 0) {
					this.countDownTime = "00:00:00"
				} else {
					this.countDownTime=getCountDown(count);
					setInterval(() => {
						nowTime = new Date().getTime();
						count = time - nowTime;
						this.countDownTime=getCountDown(count)
					}, 1000)
				}
			},
			previewImage(current) {
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			submit(){
				let rule = [{
						name: "payPassword",
						checkType: "reg",
						checkRule: "^[a-zA-Z0-9]{6,20}$",
						errorMsg: "请输入正确格式的交易密码"
					}],
				data = {
					id: this.info.id,
					payPassword: this.$refs.password.password
				},
				checkRes = graceChecker.check(data, rule);console.log(data)
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: 'none'
					})
					return false;
				}
				uni.showLoading({
					mask:true
				})
				dealReceipt(data).then(res=>{
					let result=res.data;
					if(result.code==='1'){
						uni.showToast({
							title:"收款确认成功",
							icon:'none'
						})
						setTimeout(()=>{
							uni.navigateBack()
						},1500)
					}else{
						uni.showToast({
							title:result.msg,
							icon:'none'
						})
					}
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
	.uni-page-head {
		background-color: #21212B;
		display: flex;
		align-items: top;
		text-align: left;
		color: #7F8094;
		.icon {
			flex: none;
			font-size: 48upx;
			width: 40upx;
			line-height: 1;
			margin-right: 20upx;
		}
	}
	.title {
		font-size: 28upx;
		color: #7F8094;
		line-height: 80upx;

		&.uni-flex {
			justify-content: space-between;
		}

		&+.uni-card {
			margin-top: 0;
		}
	}
	.btn-box{
	  margin-top: 40upx;
	  padding-bottom: 40upx;
	}
	.preview_img{
		width: 190upx;
		height: 190upx;
		margin: 10upx;
	}
</style>
