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
              <view class="type">{{orderValue[list.orderType]}}</view>
              <view class="name" v-if="list.name">{{ list.name }}</view>
              <view class="num">￥{{list.amount}}</view>
            </view>
            <view class="status" :class="supplyStatus[list.status].className">{{supplyStatus[list.status].text}}</view>
          </view>
          <view class="uni-media-list-text-bottom uni-ellipsis">申请时间： {{ list.applyTime }}</view>
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
			...mapState('module_0', ['orderValue','supplyStatus'])
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
