<template>
  <view class="uni-media-list">
    <view class="uni-media-list-body">
      <view class="uni-media-list-text-top">
        <view class="title">
          <block v-if="parent">
            <view class="type">购入个数：</view>
            <view class="num">{{ item.buyNumber }}</view>
          </block>
          <block v-else>
            <view class="type">转入</view>
            <view class="num">{{ item.buyNumber }}</view>
            <view class="name" style="line-height: 1;margin-left: 6px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">来自{{item.supplyAccount}}-{{item.supplyAccountName}}</view>
          </block>
        </view>
				<view class="status warn" v-if="item.applyStatus=='1'" >
					已申请
				</view>
				<view class="status primary" v-else-if="item.applyStatus==='2'">
					已发放
				</view>
        <view class="status" v-else>
        	已作废
        </view>
      </view>
      <view class="uni-media-list-text-bottom uni-ellipsis">
        <view class="bottom">
        	<view class="time" v-if="item.applyStatus=='1'">申请时间：{{item.applyTime}}</view>
        	<view class="time" v-else>发放时间：{{item.txnTime}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniTag from '@/components/uni-tag.vue'
export default {
  components: {
    uniTag
  },
  data() {
    return {};
  },
  props: ['item','parent'],
  methods:{
    tapEvent(){
      this.$emit('tap')
    }
  }
  
};
</script>

<style lang="less" scoped="">
@red: red;
.uni-media-list{
  padding:30upx 12upx;
  margin-bottom: 14upx;
  background: #21212B;
}
.uni-media-list-body {
  height: auto;
  view{
    line-height: 1;
  }
  .uni-media-list-text-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    .spot {
      background-color: #ccc;
      margin-right: 16upx;
    }
    .title {
      flex: 1;
      display: flex;
      margin-right: 16upx;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      view {
        margin-right: 16upx;
        font-size: 28upx;
        &.name {
          max-width: 260upx;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
  }
  .uni-media-list-text-bottom{
    margin-top: 16upx;
  }
}
</style>
