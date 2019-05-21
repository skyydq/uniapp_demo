<template>
    <view
      class="uni-list-cell"
      hover-class="uni-list-cell-hover"
   
			@tap="tapEvent(list)"
    >
      <view class="uni-media-list">
        <view class="uni-media-list-body">
          <view class="uni-media-list-text-top">
            <view class="title">
              <view class="name" v-if="list.supplyMemberAccount">{{ list.supplyMemberAccount}}</view>
              <view class="type">转给我</view>
              <view class="num">￥{{list.remitAmount}}</view>
            </view>
            <view class="status" :class="dealStatus_[list.status].className">{{dealStatus_[list.status].text}}</view>
          </view>
          <view class="uni-media-list-text-bottom uni-ellipsis">打款时间： {{ list.remitTime }}</view>
        </view>
      </view>
    </view>
  
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	export default {
		props: ['list'],
		data(){
			return {
			}
		},
		computed:{
			...mapState('module_0', ['orderType','dealStatus_'])
		},
		methods:{
			tapEvent(item){
				this.$emit('tapEvent',item)
			}
		}
	};
</script>

<style lang="less" scoped="">
@red: red;
.uni-media-list-body {
  .uni-media-list-text-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .spot {
      background-color: #ccc;
      margin-right: 16upx;
    }
    .title {
      flex: 1;
      display: flex;
      margin-right:16upx;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      view{
        margin-right: 16upx;
        &.name{
          max-width: 260upx;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }
    }
    .status {
      color: #E5BC2D;
      &.active {
        color: @red;
      }
      font-size: 28upx;
    }
  }
}
</style>
