<template>
	<view class="content">
     <view class="pos">
       <image src="/static/mall.jpg" mode="widthFix"></image>
     </view>
		 <view class="text">商铺火爆招募中</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="less">
 page{
   height: 100%;
   
 }
 .content{
   height: 100%;
   overflow: hidden;
   position: relative;
   display: flex;
   align-items: center;
   justify-content: center;
   color: #fff;
   .text{
     font-size: 70upx;
     color: #dfba3c;
     position: relative;
     z-index: 10;
     font-weight: 600;
     background-image:-webkit-linear-gradient(0, #F8B071, #ED783E);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
   }
   .pos{
     position: absolute;
     left: 0;
     top: 0;
     width: 100%;
     height: 100%;
     image{
       width: 100%;
       height: 100%;
     }
   }
 }
</style>
