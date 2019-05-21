<template>
  <view class="uni-media-list">
    <view class="uni-media-list-body">
      <view class="uni-media-list-text-top">
        <view class="title"><slot name="top"></slot></view>
				<slot name="tag"></slot>
        
      </view>
      <view class="uni-media-list-text-bottom uni-ellipsis"><slot name="bottom"></slot></view>
    </view>
  </view>
</template>

<script>

export default {
  data() {
    return {};
  },
  props: ['list','plain']
  
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
