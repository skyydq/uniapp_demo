<template>
	<view class="uni-padding-wrap uni-common-mt">
    <view class="uni-card" v-show="title">
    	<view class="uni-card-header">{{title}}</view>
    	<view class="uni-card-content">
    		<view class="uni-card-content-inner">
          <rich-text :nodes="htmlString"></rich-text>
    		</view>
    	</view>
    	<view class="uni-card-footer">{{updateTime}}</view>
    </view>
  </view>
</template>

<script>
  import {broadcastRead,broadcastInfo,messageRead,messageinfo} from '@/common/getData'

  export default {
    data(){
      return {
      	title: '',
      	htmlString: "",
        updateTime:''
      }
    },
    onLoad(parms){
      uni.showLoading({
      	title:''
      })
      if(parms.from==='bulletin'){
         broadcastRead({broadcastId:parms.id});
         broadcastInfo({id:parms.id}).then(this.getInfo).finally(()=>{
           uni.hideLoading()
         })
      }else{
          messageRead({id:parms.id});
          messageinfo({id:parms.id}).then(this.getInfo).finally(()=>{
            uni.hideLoading()
          })
      }
      
    },
    methods:{
      getInfo(res){
        let result=res.data;
        if(result.code==='1'){
          this.title=result.data.title;
          this.htmlString=result.data.content;
          this.updateTime=result.data.updateTime;
          uni.setNavigationBarTitle({
            title: this.title
          });
        }
      }
    }
  }
</script>

<style lang="less">
  .article-meta{
    .article-title{
      font-size: 36upx;
      line-height: 80upx;
      height: 80upx;
    }
    .article-info{
      color: #999;
      .article-time{margin-left: 20upx;}
    }
  }
</style>
