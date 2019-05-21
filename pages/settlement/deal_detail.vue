<template>
	<view>
		<view class="uni-padding-wrap" >
			<view class="uni-card">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							打款人账号：{{info.supplyMemberAccount}}
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
					<view class="uni-list-cell uni-list-cell-last">
						<view class="uni-list-cell-navigate">
							打款人上级手机号： {{info.supplyParentTelephone}}
						</view>
					</view>
				</view>
			</view>
			<view class="uni-card">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							收款人账号： {{info.receiptMemberAccount}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							收款人真实姓名：{{info.receiptMemberName}}
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-last">
						<view class="uni-list-cell-navigate">
							收款人手机号： {{info.receiptMemberTelephone}}
						</view>
					</view>
				</view>
			</view>
			<view class="uni-card">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							开始打款时间：{{info.remitBeginTime?info.remitBeginTime:""}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							需打款金额：{{info.remitAmount}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							打款时间： {{info.remitTime?info.remitTime:''}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<text>打款凭证截图：</text>
							<image v-for="(item, i) in imageList" :key="i" class="preview_img" @click="previewImage(item)" :src="item"
							 mode="aspectFit"></image>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-last">
						<view class="uni-list-cell-navigate">
							<view>打款是否超时： 
								<text class="primary" v-if="info.isOvertime==='0'">未超时</text>
								<text class="warn" v-else>已超时</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="uni-card">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<view class="uni-flex listmr">
								<text >收款账号类型：</text>
								<text v-for="(item,k) in receiptWay" :key="k">{{receiptWayText[item-1]}}</text>
							</view>
						</view>
					</view>
          <view class="uni-list-cell uni-list-cell-last">
          	<view class="uni-list-cell-navigate">
          		<view>
          			收款账号：
          			<text >{{info.receiptAccount?info.receiptAccount:""}}</text>
          		</view>
          	</view>
          </view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							确认收款时间：{{info.receiptTime?info.receiptTime:''}}
						</view>
					</view>
				</view>
			</view>
			<view class="uni-card">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							<view>
								状态：
								<text :class="dealStatus[info.status?info.status:0].className"> {{dealStatus[info.status?info.status:0].text}}</text>
							</view>
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-last">
						<view class="uni-list-cell-navigate">
							备注：{{info.remark?info.remark:""}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {dealDetail} from '@/common/getData'
	import transPassword from '@/components/trans_password'
	import graceChecker from '@/common/graceChecker'
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				info:{},
				receiptWay:[],
        receiptWayText:['银行卡','微信','支付宝'],
				imageList: [],
			};
		},
		computed:{
			...mapState('module_0',['dealStatus'])
		},
		onLoad(e) {
      uni.showLoading({
        mask: true
      });
			dealDetail({
				id: e.id
			}).then(res => {
				let result = res.data;
				if (result.code === '1') {
          uni.hideLoading()
					this.info = result.data;
					this.imageList.push(result.data.remitImageUrl?result.data.remitImageUrl:'')
					this.receiptWay=result.data.receiptWay?result.data.receiptWay:''.split(',');
				}else{
          uni.showToast({
          	title:result.msg,
            icon:'none'
          })
        }
			}).catch(() => {
        uni.showToast({
          title: '请求超时，请检查网络',
          icon: 'none'
        });
      });
		},
		methods: {
			previewImage: function(current) {
				uni.previewImage({
					current: current,
					urls: this.imageList
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

	.btn-box {
		margin-top: 40upx;
		padding-bottom: 40upx;
	}
	.listmr{
		text{
			margin-right: 10upx;
		}
	}
	.preview_img {
		width: 190upx;
		height: 190upx;
		margin: 10upx 10upx 0;
	}
	.uni-list{
		&::before,&::after{
			content: none;
		}
	}
</style>
