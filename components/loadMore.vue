<template>
		<view v-show="loadingType!==''" class="uni-loadmore"   @tap="load">
			<view class="uni-icon uni-icon-spinner" v-show="loadingType === 1"></view>
			<text class="loading-text" >{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? contentText.contentrefresh :(loadingType==2 ?contentText.contentnomore:contentText.contenterror))}}</text>
		</view>
</template>

<script>
	export default {
		props:{
			loadingType: {
				//上拉的状态：0-loading前；1-loading中；2-没有更多了
				type: Number,
				default: 0
			},
			contentText: {
				type: Object,
				default () {
					return {
						contentdown: "上拉显示更多",
						contentrefresh: "正在加载",
						contentnomore: "没有更多数据了",
            contenterror:'加载出错，请重试'
					};
				}
			}
    },
    methods:{
      load(){
         if (this.loadingType===0) {
           this.$emit('more')
        }
      }
    }
	}
</script>

<style lang="less" scoped="">
 .uni-loadmore{
   background-color: #21212B;
   color: #7F8094;
   font-size: 24upx;
   position: relative;
   
   &:before{
     content: '';
     position: absolute;
     width: 100%;
     height: 1px;
     left: 0;
     opacity: 0.12;
     background: #979797;
     transform: scaleY(0.5);
   }
 }
.uni-icon{
	animation: load 1.56s linear infinite ;
	font-size:32upx;
	line-height: 1;
	margin-right: 40upx;
}
</style>
