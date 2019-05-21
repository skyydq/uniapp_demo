<template>
  <view class="content">
    <scroll-view scroll-y="true">
      <view class="uni-list">
        <view class="uni-list-cell uni-search">
          <view class="input-view" @tap="navigateTo('search/search')">
            <uni-icon type="search" size="22" color="#666666"></uni-icon>
            <input confirm-type="search" disabled="" class="input" type="text" placeholder="输入手机号，账号，姓名查询" />
          </view>
        </view>
        <block v-if="!loaded">
          <view class="loading"><view class="uni-icon uni-icon-spinner"></view></view>
        </block>
        <block v-else>
          <template v-for="(list, index) in person.children">
            <manager-list :key="index" :list="list" :index="index + 1">
            </manager-list>
          </template>
        </block>
        
      </view>
    </scroll-view>
    <view class="btn-bottom">
      <button type="primary" @tap="navigateTo('register/register?parentAccount=' + member.account+'&parentId='+member.id)">
        协助注册直推会员
      </button>
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex';
  import managerList from '@/components/manager_list';
  import uniIcon from '@/components/uni-icon';
  import {
    getCurrUserInfo,
    getChildUserInfo
  } from '@/common/getData';
  import eventBus from '@/components/eventBus'
  export default {
    data() {
      return {
        show: false,
        peoples: [],
        parentAccount: '',
        loaded:false,
        person: {
          account: '',
          children: []
        },
      };
    },
    components: {
      managerList,
      uniIcon
    },
    computed: {
      ...mapState('module_0', ['member'])
    },
    onLoad(e) {
      this.parentAccount = e.account;

    },
    onShow() {
      this.inidMember();
    },
    mounted() {
      eventBus.$on('post-message', (msg) => {
        if (msg.name === 'trigerTap') {
          this.trigerTap(msg.value)
        } else {
          this.toManager(msg.value)
        }
      })
    },
    destroyed() {
      eventBus.$off('post-message')
    },
    methods: {
      ...mapMutations('module_0', ['CHANGEDATAOBJECT']),
      inidMember() {
        this.loaded=false;
        this.person.account = this.parentAccount;
        this.person.children = [];
        this.getMembers(0, this.person)
      },
      navigateTo(path) {
        uni.navigateTo({
          url: path
        });
      },
      trigerTap(value) {
        if(!value.childCount){
          uni.showToast({
            title: '没有团队成员',
            icon: 'none'
          })
        }else if(value.label>=6){
          uni.showModal({
            content: '您的团队成员已超过6代，需要再新页面单独查看',
            confirmColor: '#E5BC2D',
            success: e => {
              if (e.confirm) {
                this.parentAccount = value.account;
                this.inidMember();
              }
            }
          })
        }else{
          value.children=[];
          this.getMembers(value.label, value)
        }
      },
      toManager(value) {
        uni.navigateTo({
          url: '/pages/manager/detail/detail?id=' + value.id
        });
      },
      getMembers(index, parent) {
        ++index;
        uni.showLoading({
          mask:true
        })
        new Promise((resolve, reject) => {
          console.log(parent.name)
          getChildUserInfo({
            account: parent.account
          }).then(res => {
            this.loaded=true;
            let result = res.data;
            if (result.code == '1') {
              result.data.forEach(children => {
                children.children = [];
                children.show = false;
                children.label=index;
                parent.children.push(children);
              });
            }
          }).finally(()=>{
            uni.hideLoading()
          })
        })
      }
    }
  };
</script>

<style lang="less">
  page,
  .content {
    height: 100%;
  }

  page {
    position: relative;
    width: 100%;
    background: #1A1A24;
  }

  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    padding: 20upx;

    scroll-view {
      height: 100%;
      padding-bottom: 120upx;
      box-sizing: border-box;
    }
  }

  .input-view {
    width: 100%;
    display: flex;
    background-color: #21212B;
    height: 60upx;
    border-radius: 15px;
    padding: 0 4%;
    flex-wrap: nowrap;
    line-height: 60upx;
    margin-bottom: 20upx;
  }

  .input-view .uni-icon {
    line-height: 60upx !important;
  }

  .input-view .input {
    height: 30px;
    line-height: 30px;
    width: 94%;
    padding: 0 3%;
  }

  .uni-list {
    background-color: transparent;

    &::before,
    &::after {
      content: none
    }

    .uni-list-cell.uni-search::after {
      content: none
    }
  }
</style>
