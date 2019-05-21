<template>
	<view>
		<view class="tip-top" @tap="toSystem">
      <view class="tip-title">
        <image src="../../static/horn.png" mode="aspectFit"></image>
        <view class="title">系统公告</view>
      </view>
      <uni-badge v-if="badgeMsg>0" :text="badgeMsg" type="danger"></uni-badge>
		</view>
    <template v-if="totalCount===0">
			 <view class="data-none">暂无数据</view>
		</template>
		<template v-else>
      <view class="uni-list">
          <bulletinList v-for="(item,k) in list" :item="item" :key="k" @tapEvent="tapEvent"></bulletinList>
      </view>
      <load-more ref="loadMore" :loadingType="loadingType"  @more="load"></load-more>
    </template>  
  </view>
</template>

<script>
  import uniBadge from '@/components/uni-badge'
  import loadMore from '@/components/loadMore'
  import bulletinList from '@/components/bulletin-list'

  import {messageList,messageUnreadCount} from '@/common/getData'
	export default {
    components: {
      uniBadge,loadMore,bulletinList
    },
		data() {
			return {
        badgeMsg:0,
				list:[],
        pageIndex:1,
        limit:20,
        totalCount:'',
				loadingType:0
			};
		},
    onShow(){
      //获取消息列表
      this.load();
      //获取公告未读消息数
      messageUnreadCount({type:1}).then(res=>{
       let result=res.data;
       if(result.code=='1'){
         this.badgeMsg=result.data
       } 
      })
    },
    onReachBottom() {
        this.load();
    },
    methods:{
      load(){
				if(!this.loadingType){
				  this.loadingType=1;
          messageList({
            pageIndex:this.pageIndex,
            limit:this.limit
          }).then(res=>{
            let result=res.data;
            if(result.code=='1'){
                this.totalCount=result.data.totalCount;
                result.data.list.forEach((item)=>{
                  this.list.push(item)
                })
								if(this.list.length>=this.totalCount){
									this.loadingType=2
								}else{
									this.loadingType=0
								}
                this.pageIndex++;
              //TODO
            }else{
              this.loadingType=3
            }
          }).catch(()=>{
            this.loadingType=3
          })
				}
      },
      tapEvent(item){
        item.status='1';
        uni.navigateTo({
        	url:'bulletin_detail?from=message&id='+item.id
        })
      },
      toSystem(){
        uni.navigateTo({
        	url:'bulletin'
        })
      }
    }
	}
</script>

<style lang="less">
  .uni-list{
    margin-top: 20upx;
    background-color: #21212B;  
  }
	.tip-top{
    position: relative;
    z-index: 99;
		height: 80upx;
		line-height: 80upx;
		display: flex;
		width: 100%;
		padding:0 30upx;
		box-sizing: border-box;
		align-items: center;
		justify-content: space-between;
    color: #fff;
    background-color: #21212B;
		image{
			width: 48upx;
			height: 48upx;
      margin-right: 20upx;
		}
		.tip-title{
      display: flex;
    }
	}
</style>
