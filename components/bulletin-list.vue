<template>
  <view class="uni-list-cell" hover-class="uni-list-cell-hover" @tap="tapEvent">
    <view class="uni-media-list">
      <view class="uni-media-list-body">
        <view class="uni-media-list-text-top">
          <view class="spot active" v-if="item.status==='0'"></view>
          <view class="title">{{item.title}}</view>
          <view class="time">{{item.updateTime?item.updateTime:''}}</view>
        </view>
        <view class="uni-media-list-text-bottom uni-ellipsis">
          {{item.content}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  },
  methods:{
    tapEvent(){
      this.$emit('tapEvent',this.item)
    }
  }
};
</script>
<style lang="less" scoped="">
	@red:#dd524d;
	.uni-media-list-body{
		.uni-media-list-text-top{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.spot{
        flex: none;
        width: 18upx;
        height: 18upx;
        border-radius: 50%;
				background-color: #ccc;
				margin-right:16upx;
        background-color: @red;
			}
			.title{
				flex: 1;
				margin-right: 8upx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}
			.time{
				color: #666;
				font-size: 24upx;
			}
		}
	}
</style>
