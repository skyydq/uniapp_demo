<template>
	<view class="model-popup" v-show="showPopup">
		<view class="popup">
			<view class="uni-list">
				<view class="uni-list-cell" @tap="navigate('/pages/record/offer_order')">
						买入聚德记录
				</view>
				<view class="uni-list-cell"  @tap="navigate('/pages/record/accept_order')">
						卖出聚德记录
				</view>
				<view class="uni-list-cell"  @tap="navigate('/pages/record/paid')">
						打款交易记录
				</view>
				<view class="uni-list-cell uni-list-cell-last"  @tap="navigate('/pages/record/collected')">
						收款交易记录
				</view>
			</view>
		</view>
		<view class="mask" @click="hide"></view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				showPopup:false
			}
		},
		methods:{
			show(){
				this.showPopup=true;
			},
			hide(){
				this.showPopup=false;
			},
			navigate(url){
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="less" scoped="">
	.model-popup{
		position: absolute;
		z-index: 999;
		top: 88upx;
		left: 0;
		width: 100%;
		bottom: 0;
		.mask{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height:100%;
			z-index: 99;
		}
		.popup{
			position: absolute;
			z-index: 999;
      top: -10upx;
			padding-top: 30upx;
			right: 24upx;
			text-align: center;
			&:before{
				content: '';
				display: block;
				position: absolute;
				z-index: 99;
				top: -8upx;
				right:2upx;
				height: 0;
				border: 20upx solid #21212B;
        opacity: 0.9;
				border-top-color:transparent;
				border-left-color: transparent;
				border-right-color: transparent;
			}
			.uni-list{
        padding:10upx 0;
				opacity: 0.9;
        background: #21212B;
        border-radius: 6upx;
				&::before,&::after{
					content: none;
				}
			}
			.uni-list-cell{
        color: #fff;
				padding:14upx 24upx ;
        line-height: 1;
        font-size: 26upx;
			}
		}
	}
</style>
