<template>
  <view class="content wrap-btn-bottom-padding">
    <view class="uni-list" v-if="queueInfo">
      <view class="uni-list-cell" v-for="(item, k) in queueInfo" :class="{'uni-list-cell-last':k===queueInfo.length-1}"  :key="k">
        <view class="uni-list-cell-navigate">
          <view>排单币</view>
          <view :class="status[item.status-1].className">{{ status[item.status-1].text }}</view>
        </view>
      </view>
    </view>
    <load-more ref="loadMore" :contentText="contentText" :loadingType="loadingType"  @more="load"></load-more>
    <!-- <view class="btn-bottom"><button type="primary">直接转出供应</button></view> -->
  </view>
</template>

<script>
import loadMore from '@/components/loadMore'
import {queueOrderList,queueCoinUnusedList} from '@/common/getData'
export default {
	components:{
		loadMore
	},
  data() {
    return {
      status: [{
          code: 1,
          text: '未使用',
          className: 'primary'
        },
        {
          code: 2,
          text: '已使用',
          className: 'default'
        }
      ],
			loadingType:0,
			totalCount:'',
			queueInfo:null,
			contentText:{
						contentdown: "上拉显示更多",
						contentrefresh: "正在加载",
						contentnomore: "暂无更多数据"
			}
    };
  },
  onLoad(){
		this.load()
  },
  onReachBottom() {
     // this.load();
  },
  methods:{
		load(){ 
			if(!this.loadingType){
				this.loadingType=1;
				queueCoinUnusedList().then(res=>{
					//TODO
					let result=res.data;
					if(result.code==='1'){
						this.queueInfo=[];
						this.queueInfo=result.data;
					}
				}).finally(()=>{
					this.loadingType=2;
				})
			}
		}
  }
};
</script>

<style lang="less">
page,
.content {
  min-height: 100%;
  background-color: #1A1A24;
}
.content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.uni-list{
  margin-top: 20upx;
  background-color: #21212b;
  color: #fff;
}
</style>

