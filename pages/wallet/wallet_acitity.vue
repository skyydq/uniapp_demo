<template>
  <view>
    <view class="uni-list uni-list-first">
      <view class="uni-list-cell uni-list-cell-last">
        <view class="uni-list-cell-navigate">
          <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" :styleType="styleType"
            :activeColor="activeColor"></uni-segmented-control>
        </view>
      </view>
    </view>
    <view class="content">
      <view v-show="current === 0">
        <view class="uni-list">
          <template v-if="lists1&&lists1.length>0">

            <view class="uni-list-cell" v-for="(list,k) in lists1" :key="k">
              <view class="uni-list-cell-navigate uni-column">
                <view class="item">
                  <view>￥{{list.profitAmount}}({{list.baseAmount+'*'+list.rate}})</view>
                  <view class="time">{{list.profitTime?list.profitTime:""}}</view>
                </view>
                <view class="item uni-media-list-text-bottom">
                  {{list.profitDesc}}
                </view>
              </view>
            </view>
          </template>
          <template v-else>
            <view class="uni-list-cell nodata">
              <view class="uni-list-cell-navigate tcenter">
                暂无数据
              </view>
            </view>
          </template>
        </view>
      </view>
      <view v-show="current === 1">
        <view class="uni-list">
          <template v-if="lists2&&lists2.length>0">

            <view class="uni-list-cell" v-for="(list,k) in lists2" :key="k">
              <view class="uni-list-cell-navigate uni-column">
                <view class="item">
                  <view>￥{{list.applyAmount}}</view>
                  <view :class="walletStatusActivity[list.status].className">{{walletStatusActivity[list.status].text}}</view>
                </view>
                <view class="item uni-media-list-text-bottom" v-if="list.status==='0'">
                 申请时间： {{list.applyTime?list.applyTime:""}}
                </view>
                <view class="item uni-media-list-text-bottom" v-else-if="list.status==='1'">
                 允许时间： {{list.agreeTime?list.agreeTime:""}}
                </view>
                <view class="item uni-media-list-text-bottom" v-else-if="list.status==='2'">
                 提现开始时间： {{list.receiptBeginTime?list.receiptBeginTime:""}}
                </view>
                <view class="item uni-media-list-text-bottom" v-else-if="list.status==='3'">
                 提现完成时间： {{list.receiptFinishTime?list.receiptFinishTime:""}}
                </view>
              </view>
            </view>
          </template>
          <template v-else>
            <view class="uni-list-cell nodata">
              <view class="uni-list-cell-navigate tcenter">
                暂无数据
              </view>
            </view>
          </template>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
  import uniSegmentedControl from '@/components/uni-segmented-control.vue';
  import {
    dynamicAwardList,
    dynamicCrashList
  } from '@/common/getData'
  import {mapState} from 'vuex'
  export default {
    components: {
      uniSegmentedControl
    },
    data() {
      return {
        items: [
          '奖励明细',
          '提现记录'
        ],
        current: 0,
        activeColor: '#E5BC2D',
        styleType: 'button',
        styleIndex: 0,
        colorIndex: 0,
        lists1: [],
        lists2: []
      };
    },
    computed:{
      ...mapState('module_0',['walletStatusActivity'])
    },
    onShow(e) {
      dynamicAwardList().then(res => {
        let result = res.data;
        if (result.code === '1') {
          this.lists1 = result.data
        }
      })
      dynamicCrashList().then(res => {
        let result = res.data;
        if (result.code === '1') {
          this.lists2 = result.data
        }
      })
    },
    onNavigationBarButtonTap(e) {
      if (e.index === 0) {
        uni.navigateTo({
          url: 'cash/cash'
        })
      }
    },
    methods: {
      onClickItem(index) {
        if (this.current !== index) {
          this.current = index;
        }
      },
    }
  }
</script>

<style lang="less">
  page{
    background-color: #1A1A24;
  }
  
  .content{
    padding:20upx;
  }
  .nodata{
    color: #7F8094;
    background-color: #21212b;
    padding: 0;
    height: 80upx;
    line-height: 80upx;
  }
  .uni-list{
    background-color:#21212b;
    color: #fff;
  }
  .uni-list-first {
    &:after {
      content: none;
    }
  }

  .tcenter {
    justify-content: center;
  }

  .uni-column {
    .item {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-size:30upx;
      view{
        font-size: 30upx;
      }
      .time{font-size: 28upx;}
    }
    .uni-media-list-text-bottom{
      font-size: 24upx;
    }
    .uni-navigate-bottom {
      color: #999;
    }
  }
</style>
