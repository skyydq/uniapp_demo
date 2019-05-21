<template>
	<view class="content">
		<view class="uni-card">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>申请人账号：</view><view>{{info.applyAccount}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>申请时间：</view><view>{{info.applyTime?info.applyTime:''}}</view>	
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>卖出聚德类型：</view><view>{{orderType[info.orderType]}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>卖出聚德金额：</view><view>￥{{info.amount}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>收款方式：</view>
						<view v-if="info.payWay.indexOf(',')>=0">
							<block v-for="pay in info.payWay.split(',')">
								<text v-if="pay==='1'">
									银行卡
								</text>
								<text v-else-if="pay==='2'">
									/微信支付
								</text>
								<text v-else-if="pay==='3'">
									/支付宝支付
								</text>
							</block>
						</view>
						<view v-else>
							<text v-if="info.payWay==='1'">
									银行卡
								</text>
								<text v-else-if="info.payWay==='2'">
									微信支付
								</text>
								<text v-else-if="info.payWay==='3'">
									支付宝支付
								</text>
							</block>
						</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>收款完成时间：</view><view>{{info.finishTime?info.finishTime:''}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>状态：</view>
						<view :class="acceptStatus[info.status?info.status:0].className">{{acceptStatus[info.status?info.status:0].text}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card" >
			<view class="uni-list">
				<view class="uni-list-cell" >
					<view class="uni-list-cell-navigate  uni-navigate-right ccc blue" @tap="navigate(info.id)">
						<text>相关交易记录</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'

	import {receiptDetail} from '@/common/getData'
	import recordList from '../../components/record_collect_list'
	export default {
    components: {
    	recordList
    },
		data() {
			return {
				info: {
					payWay:''
				}
			};
		},
		computed:{
			...mapState('module_0', ['orderType','dealStatus_','acceptStatus'])

		},
		onLoad(e){
			uni.showLoading();
			receiptDetail({
				id:e.id
			}).then(res=>{
				let result=res.data;
				if(result.code==='1'){
					this.info=result.data
					uni.hideLoading()
				}else{
					uni.showToast({
						title:result.msg,
						icon:'none'
					})
				}
			}).catch(()=>{
				uni.showToast({
					title:"请求超时，请检查网络",
					icon:'none'
				})
			})
		},
		methods:{
      navigate(pid){
        uni.navigateTo({
        	url:'/pages/record/collected?id='+pid
        })
      }
			
		}
	}
</script>

<style lang="less">
   page,.content{
     background-color:#1a1a24;
   }
   .content{
     padding: 0 20upx;
   }
  .uni-list {
    color: #fff;
    .uni-list-cell::after{
      left: 0;
      opacity: 0.12;
      background: #979797;
    }
  }
	.uni-card {
		box-shadow: none;
	}
	.name {
		max-width: 400upx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.ccc{
		color: #ccc;
		&.blue{
		color: #0066FF;
		}
	}
</style>
