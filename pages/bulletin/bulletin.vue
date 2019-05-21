<template>
	<view>
		
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
  import {broadcastList} from '@/common/getData'
	export default {
    components: {
      uniBadge,loadMore,bulletinList
    },
		data() {
			return {
				list:[],
        pageIndex:1,
        limit:20,
        totalCount:'',
				loadingType:0
			};
		},
    onLoad(){
      //获取消息列表
      this.load();
    },
    onReachBottom() {
        this.load();
    },
    methods:{
      load(){
				if(!this.loadingType){
					this.loadingType=1;
					broadcastList({
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
            this.loadingType=2;
            uni.showToast({
            	title:result.msg,
              icon:'none'
            })
          }
					})
				}
					
      },
      tapEvent(item){
				item.status='1'
        uni.navigateTo({
        	url:'bulletin_detail?from=bulletin&id='+item.id
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
</style>
