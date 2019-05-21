<template>
  <view class="uni-list-cell uni-collapse">
    <view class="uni-list-cell-navigate" hover-class="uni-list-cell-hover" @tap="trigerCollapse(list)">
      <view class="title">
        <view>
          <text class="line"></text>
        </view>
       <view class="name"  @tap.stop="todetail(list)">
       <text>{{list.account+"-"+list.name}}</text>

       </view>
        <view class="tag">
          <view>
            <uni-tag text="活" className="member small" v-if="list.isActivate=='1'" type="primary" size="small"></uni-tag>
            <uni-tag text="活" className="member small" v-else-if="list.isActivate=='0'" type="default" size="small"></uni-tag>
            <uni-tag text="冻" className="member small" v-else-if="list.isActivate=='2'" type="warn" size="small"></uni-tag>
            <uni-tag text="解" className="member small" v-else-if="list.isActivate=='3'" type="warn" size="small"></uni-tag>
          </view>
          <view>
            <uni-tag v-if="list.isPrepay==='1'" text="场" className="prepay small" type="primary " size="small"></uni-tag>
            <uni-tag text="场" v-else-if="list.isPrepay=='2'" className="prepay small" type="warn prepay" size="small"></uni-tag>
            <uni-tag text="场" v-else type="default prepay" className="prepay small" size="small"></uni-tag>
          </view>
        </view>
      </view>
      <view v-if="list.childCount">
        <uni-badge :text="list.childCount" type="primary"></uni-badge>
      </view>
    </view>
    <view v-if="list.children && list.children.length > 0" class="uni-list uni-collapse" :class="list.show ? 'uni-active' : ''">
      <block>
        <template v-for="(item, v) in list.children">
          <manager-list :key="v" :list="item">
          </manager-list>
        </template>
      </block>
    </view>
  </view>
</template>

<script>
  import uniTag from '@/components/uni-tag.vue'
  import uniBadge from "@/components/uni-badge.vue";
  import eventBus from '@/components/eventBus'
  import managerList from '@/components/manager_list/manager_list.2'

  export default {
    data() {
      return {};
    },
    components: {
      uniTag,
      uniBadge,
      managerList
    },
    props: ["list", "index"],

    methods: {

      trigerCollapse(value) {
        value.show = !value.show;
        eventBus.$emit('post-message', {
          name: 'trigerTap',
          value
        })

      },
      todetail(value) {
        eventBus.$emit('post-message', {
          name: 'toManager',
          value
        })
      }
    }
  };
</script>

<style lang="less" scoped="">
  .uni-list {
    background-color: transparent;
  }

  .uni-list-cell {
    background-color: #21212b;
  }

  .uni-list-cell::after,
  .uni-list::after,
  .uni-list::before {
    left: 0;
    opacity: 0.12;
    background: #979797;
  }

  .uni-badge-primary {
    background-color: #fff;
    color: #333;
  }

  .uni-list-cell-navigate {
    padding: 30upx 12upx;
    color: #fff;
  }

  .title {
    display: flex;
    align-items: center;

    view {
      font-size: 30upx;
      line-height: 30upx;
    }

    .line {
      display: block;
      width: 4upx;
      height: 30upx;
      background-color: #DFBA3C;
      border-radius: 2upx;
      margin-right: 12upx
    }

    .tag {
      margin-left: 30upx;
      display: flex;
      >view {
        flex: none;
        margin-right: 30upx;
      }
    }
  }
</style>
