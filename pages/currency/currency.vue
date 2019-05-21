<template>
  <view>
    <view class="uni-list header">
      <view class="uni-list-cell ">
        <view class="uni-list-cell-navigate " @tap="toDetail">
          <view class="uni-list-text-top">当前可用</view>
          <view class="uni-list-text-bottom ">
            <view class="num">{{ member.quequCoinCount }}</view>
            <view class="applyBtn">
              <view class="info" v-if="member.parentId=='0'" @tap.stop="applyAdd">申请更多</view>
              <view class="info" @tap.stop="turnOut">直接转出</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <block v-if="member.parentId=='0'">
      <view class="nav">
        <view class="nav-list" :class="{ active: active === 1 }" @click="changeActive(1)">
          <view>转出记录</view>
        </view>
        <view class="nav-list" :class="{ active: active === 0 }" @click="changeActive(0)">
          <view>购买记录</view>
        </view>
      </view>
    </block>
    <block v-else>
      <view class="nav">
        <view class="nav-list" :class="{ active: active === 1 }" @click="changeActive(1)">
          <view>转出记录</view>
        </view>
        <view class="nav-list" :class="{ active: active === 0 }" @click="changeActive(0)">
          <view>转入记录</view>
        </view>
      </view>
    </block>
    <view class="nav-section">
      <view class="nav-section-list" v-if="active === 0">
        <block v-if="!lists">
          <view class="loading">
            <view class="uni-icon uni-icon-spinner"></view>
          </view>
        </block>
        <view v-else-if="lists.length===0" class="uni-list">
          <view class="uni-list-cell uni-list-cell-last">
            <view class="uni-list-cell-navigate nodata">
              没有更多数据了
            </view>
          </view>
        </view>
        <view class="uni-list" v-else>
          <template v-for="(item, k) in lists">
            <currencyList1 :parent="member.parentId=='0'" :item="item" :key="k"></currencyList1>
          </template>
        </view>
      </view>
      <view class="nav-section-list list_2" v-else>
        <block v-if="!lists_">
          <view class="loading">
            <view class="uni-icon uni-icon-spinner"></view>
          </view>
        </block>
        <view v-else-if="lists_.length===0" class="uni-list">
          <view class="uni-list-cell uni-list-cell-last">
            <view class="uni-list-cell-navigate nodata">
              没有更多数据了
            </view>
          </view>
        </view>
        <view class="uni-list" v-else>
          <template v-for="(item, k) in lists_">
            <currencyList :item="item" @tap="applySupply(item.id,item.buyNumber,k)" :key="k"></currencyList>
          </template>
        </view>
      </view>
    </view>
    <sbanner ref="sbannerAdd" :disabled="isSending" :num="num" @submit="add">
      <input class="uni-input" type="text" v-model="num" placeholder="输入排单币个数">
    </sbanner>
    <sbanner ref="sbannerSupply" :disabled="isSending" :num="supplyNum" @submit="supply">
      <input class="uni-input" type="text" disabled="" :value="'转出数量：'+supplyNum">
    </sbanner>
    <sbannerMember ref="sbannerMember" :disabled="isSending" @submit="turn"></sbannerMember>

  </view>
</template>

<script>
  import currencyList from '@/components/list/currency-list'
  import currencyList1 from '@/components/list/currency-list.1'
  import uniTag from '@/components/uni-tag.vue'
  import {
    mapState,
    mapActions
  } from 'vuex'
  import sbanner from '@/components/sbanner'
  import graceChecker from '@/common/graceChecker.js'
  import sbannerMember from '@/components/sbanner-member'

  import {
    queueCount,
    queueOrderAdd,
    queueOrdersupply,
    queueOrderList,
    queueCoinOrderSupplyList,
    queueCoinForward
  } from '@/common/getData'
  export default {
    components: {
      currencyList,
      currencyList1,
      sbanner,
      sbannerMember,
      uniTag
    },
    data() {
      return {
        active: 1,
        num: '',
        supplyId: '',
        lists: null,
        lists_: null,
        isSending: false,
        supplyIndex: '', //确认转出下标
        supplyNum: '' //转出数量
      };
    },
    onLoad() {
      this.load();
      this.loadTurn()
    },
    computed: {
      ...mapState('module_0', ['isLogin', 'member'])
    },

    methods: {
      ...mapActions('module_0', ['changemember']),
      loadTurn(){
        queueCoinOrderSupplyList().then(res => {
          let result = res.data;
          if (result.code === '1') {
            this.lists_ = result.data
          } else {
            this.lists_ = []
          }
        }).catch(() => {
          this.lists_ = []
        })
      },
      load() {
        queueOrderList().then(res => {
          let result = res.data;
          if (result.code === '1') {
            this.lists = result.data
          } else {
            this.lists = []
          }
        }).catch(() => {
          this.lists = []
        })
      },
      loadCount() {
        queueCount().then(res => {
          let result = res.data;
          if (result.code == '1') {
            this.changemember({
              'quequCoinCount': result.data
            });
          }
        })
      },
      changeActive(v) {
        this.active = v;
      },
      toDetail() {
        uni.navigateTo({
          url: 'currency_detail'
        })
      },
      checkValue(data) {
        let rule = [{
            name: "num",
            checkType: "int",
            checkRule: "0,6",
            errorMsg: "请输入正确的排单币个数"
          }, {
            name: "psw",
            checkType: "reg",
            checkRule: "^[a-zA-Z0-9]{6,20}$",
            errorMsg: "请输入正确格式的交易密码"
          }],
          checkRes = graceChecker.check(data, rule);
        if (!checkRes) {
          uni.showToast({
            title: graceChecker.error,
            icon: 'none'
          })
          return false;
        }
        return true;
      },
      applyAdd() {
        this.checkPayPass(this.$refs.sbannerAdd.showBanner)
      },
      applySupply(v, num, index) {
        this.supplyId = v;
        this.supplyNum = num;
        this.supplyIndex = index
        this.checkPayPass(this.$refs.sbannerSupply.showBanner)
      },
      add(data) {
        this.isSending = true;
        if (!this.checkValue(data)) {
          this.isSending = false;
          return false
        }
        queueOrderAdd({
          buyNumber: data.num,
          payPassword: data.psw
        }).then(res => {
          let result = res.data;
          uni.showToast({
            title: result.msg,
            icon: 'none'
          })
          this.$refs.sbannerAdd.closeBanner();
          if (result.code === '1') {
            this.load();
          }

        }).finally(() => {
          this.isSending = false
        })
      },
      supply(data) {
        this.isSending = true;
        if (!this.checkValue(data)) {
          this.isSending = false;
          return false
        }
        queueOrdersupply({
          id: this.supplyId,
          buyNumber: data.num,
          payPassword: data.psw
        }).then(res => {
          let result = res.data;
          uni.showToast({
            title: result.msg,
            icon: 'none'
          })
          this.$refs.sbannerSupply.closeBanner();
          if (result.code === '1') {
            this.loadCount();
            this.$set(this.lists_[this.supplyIndex], 'applyStatus', "2");
          }

        }).finally(() => {
          this.isSending = false
        })
      },
      turnOut() {
        this.$refs.sbannerMember.bannerShow = true;
      },
      turn(data) {
        this.isSending = true;
        if (!this.checkValue(data)) {
          this.isSending = false;
          return false
        }
        if (!data.id) {
          uni.showToast({
            title: '请输入正确转入人账号',
            icon: 'none'
          })
          return false
        }
        queueCoinForward({
          applyId: data.id,
          buyNumber: data.num,
          payPassword: data.psw
        }).then(res => {
          let result = res.data;
          if (result.code === '1') {
            this.changemember({'quequCoinCount':this.member.quequCoinCount-data.num})

            this.loadTurn()
          }
          uni.showToast({
            title: result.msg,
            icon: 'none'
          })
          this.$refs.sbannerMember.closeBanner();
        }).finally(() => {
          this.isSending = false;
        })
      }

    }
  };
</script>


<style lang="less">
  page {
    background: #1A1A24;
  }

  .header {
    background: url(../../static/img4.jpg) no-repeat 0 0;
    background-size: cover;
    height: 230upx;
    margin: 20upx;
    width: auto;
    border-radius: 10upx;

    &.uni-list {

      &::before,
      &:after {
        content: none
      }

      .uni-list-cell-navigate {
        flex-direction: column;
        font-size: 32upx;
        padding: 77upx 26upx 0;

        .uni-list-text-top {
          color: #fff;
          width: 100%;
          font-size: 24upx;
          line-height: 1;
        }

        .uni-list-text-bottom {
          text-align: center;
          display: flex;
          width: 100%;
          margin-top: 27upx;
          justify-content: space-between;
          align-items: center;

          .num {
            font-weight: 600;
            font-size: 80upx;
            line-height: 80upx;
            -webkit-background-clip: text;
            /*必需加前缀 -webkit- 才支持这个text值 */
            -webkit-text-fill-color: transparent;
            /*text-fill-color会覆盖color所定义的字体颜色： */
            background-image: linear-gradient(180deg, #F4DF58, #E5BC2D);
          }

          .info {
            border: 2px solid #fff;
            border-radius: 30upx;
            height: 60upx;
            line-height: 60upx;
            width: 156upx;
            color: #fff;
          }
        }
      }
    }
  }

  .nav {
    display: flex;
    background: #21212B;
    justify-content: space-between;
    height: 80upx;
    color: #999999;
    padding: 0 30upx;

    .nav-list {
      width: 50%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 10upx 0 0;

      &.active {
        &:after {
          content: '';
          display: block;
          width: 40%;
          height: 4upx;
          border-radius: 2upx;
          background-color: #ED783E;
        }

        color: #ED783E;
      }
    }
  }

  .nodata {
    color: #7F8094;
  }

  .nav-section {
    padding: 20upx;

    .nav-section-list .uni-list {

      &:before,
      &:after {
        content: none;
      }

      background-color: #1A1A24;
    }
  }

  .type {
    margin-right: 16upx;
    line-height: 1;

    view {
      line-height: 1;
    }
  }

  .num {
    line-height: 1;
  }

  .status {
    line-height: 1;
  }

  .bottom {
    display: flex;

    view {
      font-size: 24upx;
      line-height: 1;
    }

    justify-content: space-between;
  }

  .warn {
    color: #D95353 !important;
  }

  .primary {
    color: #4DCA96 !important;
  }
  .applyBtn {
    display: flex;
  
    .info {
      margin-left: 10upx;
      font-size: 28upx;
    }
  }
</style>
<style>
  .list_2 .status.active {
    border: 1px solid red;
  }
</style>
