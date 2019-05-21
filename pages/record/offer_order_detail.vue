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
						<view>买入聚德类型：</view><view>{{orderType[info.orderType]}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>买入聚德金额：</view><view>￥{{info.amount}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>支付方式：</view>
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
						<view>打款开始时间：</view><view>{{info.beginTime?info.beginTime:""}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>打款截止时间：</view><view>{{info.deadTime?info.deadTime:""}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>打款完成时间：</view><view>{{info.finishTime?info.finishTime:''}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view>状态：</view>
						<view class="status" :class="supplyStatus[info.status?info.status:0].className">{{supplyStatus[info.status?info.status:0].text}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card" >
			<view class="uni-list">
				<view class="uni-list-cell" >
					<view class="uni-list-cell-navigate uni-navigate-right ccc blue" @tap="navigate(info.id)">
						<text>相关交易记录</text>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-card">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view >卖出提现状态：</view>
						<view :class="offerOrderType[info.saleStatus?info.saleStatus:0].className">{{offerOrderType[info.saleStatus?info.saleStatus:0].text}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view >实际获得金额：</view>
						<view >￥{{info.orginAmount}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view >可卖出金额：</view>
						<view >￥{{info.saleAmount}}</view>
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view >剩余零头金额：</view>
						<view >￥{{info.blankAmount}}</view>
						
					</view>
				</view>
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate">
						<view >上次补充金额：</view>
						<view >￥{{info.fillAmount}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'

	import {supplyDetail} from '@/common/getData'
	import recordList from '../../components/record_paid_list'

	export default {
		components: {
			recordList
		},
		data() {
			return {
				recordShow:false,
				info: {
					payWay:''
				}
			};
		},
		computed:{
			...mapState('module_0', ['orderType','dealStatus','supplyStatus','offerOrderType'])

		},
		onLoad(e){
			uni.showLoading();
			supplyDetail({
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
        	url:'/pages/record/paid?id='+pid
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
