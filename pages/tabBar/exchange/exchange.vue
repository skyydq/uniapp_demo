<template>
  <view class="page-wrap page-content" :class="{ active: isLogin }">
    <view class="wrapper">
      <view class="header">
        <view class="header-nav">
          <!-- #ifdef APP-PLUS-->
          <view class="status_bar "></view>
          <!-- #endif-->
          <uni-nav-bar @click-left="navLeft" backgroundColor="transparent" @click-right="navRight">
            <block slot="left">
              <image class="icon left" src="/static/icon_news.png" mode="aspectFit"></image>
              <view class="badge-msg" v-if="badgeMsg > 0">
                <uni-badge :text="badgeMsg" type="danger"></uni-badge>
              </view>
            </block>
            <block slot="right">
              <image class="icon" src="/static/icon_menu.png" mode="aspectFit"></image>
            </block>
          </uni-nav-bar>
        </view>
        <view class="header-swiper">
          <swiper indicator-dots="true" autoplay="true" circular="true">
            <swiper-item v-for="(img, key) in imgUrls" :key="key">
              <image class="swiper-img" :src="img" />
            </swiper-item>
          </swiper>
        </view>
      </view>
      <view class="activation">
        <view class="ac-code" @tap="tohelp">
          <view class="icon">
            <image src="/static/homepage_icon_purchase.png" mode="aspectFit"></image>
          </view>
          <view class="uni-column">
            <view class="title">买入聚德</view>
            <view class="text">交易创造财富</view>
          </view>
        </view>
        <view class="ac-code" @tap="toaccept">
          <view class="icon">
            <image src="/static/homepage_icon_sellout.png" mode="aspectFit"></image>
          </view>
          <view class="uni-column">
            <view class="title">卖出聚德</view>
            <view class="text">交易创造财富</view>
          </view>
        </view>
      </view>
      <view class="panic" @tap="topromotion">
        <view class="left">
          <view class="title">
            <text>抢购中心</text>
            <image src="/static/homepage_icon_into.png" mode=""></image>
          </view>
          <view class="text">把握未来机遇,实现财富梦想</view>
        </view>
        <view class="right" v-if="canPanic===false">
          <view class="panic-title">{{canPanicTime}}</view>
          <view class="panic-text">准点开抢</view>
        </view>
        
        <view class="right" v-else-if="canPanic===true">
          <view class="panic-title">{{canPanicNum}}</view>
          <view class="panic-text">当前剩余</view>
        </view>
        <view class="icon" v-else>
           <image src="/static/homepage_img1.png" mode=""></image> 
        </view>
      </view>
      <view class="activation activation_2">
        <view class="ac-code" @tap="navigate('/pages/activation/activation')">
          <view class="icon">
            <image src="/static/homepage_icon_single.png" mode="aspectFit"></image>
          </view>
          <view class="uni-column">
            <view class="title">
              激活码：
              <text>{{ member.acitvateCodeCount }}</text>
            </view>
          </view>
        </view>
        <view class="ac-code" @tap="navigate('/pages/currency/currency')">
          <view class="icon">
            <image src="/static/homepage_icon_active.png" mode="aspectFit"></image>
          </view>
          <view class="uni-column">
            <view class="title">
              排单币：
              <text class="spec">{{ member.quequCoinCount }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- <view class="btn-group">
        <button type="warn" class="btn warn" @tap="tohelp">提供帮助</button>
        <button type="primary" class="btn primary" @tap="toaccept">接受帮助</button>
      </view> -->
      <view class="section">
        <view class="nodata">—— 处理任务 ——</view>
        <view class="nodata" v-if="supplyList && receiptList && receiptList.length === 0 && supplyList.length === 0">
          —— 当前没有未处理任务 ——
        </view>
        <view v-else class="section-list">
          <block v-if="!supplyList">
            <view class="loading">
              <view class="uni-icon uni-icon-spinner"></view>
            </view>
          </block>
          <block v-else>
            <template v-for="(list,k) in supplyList">
              <exchange-list :key="k" typeText="提供" :list="list" @offerEvent="helpTap('offer',list.id)" @tapEvent="supplyTap"></exchange-list>
            </template>
          </block>
          <template v-for="(list,k) in receiptList">
            <exchange-list :key="list.k" className="accept" typeText="接受" @acceptEvent="helpTap('accept',list.id)"
              :list="list" @tapEvent="receiptTap"></exchange-list>
          </template>
        </view>
      </view>
    </view>
    <model-popup ref="popup"></model-popup>
    <update :version="newversion" :versionDesc="versionDesc" ref="updateBanner" :percent="percent" @cancel="cancel"
      @submit="toUpdate"></update>

  </view>
</template>

<script>
  import {
    mapState,
    mapActions
  } from 'vuex';
  import uniNavBar from '@/components/uni-nav-bar.vue';
  import uniIcon from '@/components/uni-icon.vue';
  import modelPopup from '@/components/model-popup';
  import uniBadge from '@/components/uni-badge';
  import exchangeList from '@/components/exchange-list';
  import update from '@/components/update.vue'
  import {
    activateCount,
    queueCount,
    applyVerify,
    promotionVerify,
    messageUnreadCount,
    receiptVerify,
    supplyCurrDeal,
    receiptCurrDeal,
    getCurrUserInfo,
    getVersion,
    getCurrDayDatas
  } from '@/common/getData';
  let downLoadUrl, downloadTask,downloading=false;
  export default {
    components: {
      uniNavBar,
      uniIcon,
      modelPopup,
      uniBadge,
      exchangeList,
      update
    },
    data() {
      return {
        badgeMsg: '', //未读消息数
        supplyList: null, //提供帮助订单
        receiptList: null, //接受帮助订单
        imgUrls: ['/static/banner.jpg', '/static/banner2.jpg'],
        newversion: '',
        versionDesc: "",
        percent: '',
        version: "",
        canPanic:'',
        canPanicTime:'',
        canPanicNum:'0'
      };
    },
    computed: {
      ...mapState('module_0', [
        'isLogin',
        'member',
        // 'activateCount',
        // 'queueCount',
        'supplyStatus',
        'dealStatus'
      ])
    },
    onLoad() {
      this.routePush();
      // #ifdef APP-PLUS
      this.version = plus.runtime.version;
      // #endif
    },
    onShow() {
      activateCount().then(res => {
          let result = res.data;
          if (result.code == '1') {
            this.changemember({
              acitvateCodeCount: result.data
            });
          }
        }),
        queueCount().then(res => {
          let result = res.data;
          if (result.code == '1') {
            this.changemember({
              quequCoinCount: result.data
            });
          }
        }),
        messageUnreadCount().then(res => {
          let result = res.data;
          if (result.code == '1') {
            this.badgeMsg = result.data - 999 > 0 ? '999' : result.data;
          }
        });
        
      //接受帮助订单
      supplyCurrDeal()
        .then(res => {
          let result = res.data;
          if (result.code === '1') {
            this.supplyList = result.data;
            // this.supplyList = [];

            //TODO
          }
        })
        .catch(error => {
          this.supplyList = [];
        });
      //提供帮助订单
      receiptCurrDeal()
        .then(res => {
          let result = res.data;
          if (result.code === '1') {
            this.receiptList = result.data;
          }
        })
        .catch(error => {
          this.receiptList = [];
        });
      setTimeout(()=>{
        this.checkVersion()
      },1000)
      getCurrDayDatas().then(res=>{
        let result=res.data;
        if(result.code=='1'){
          if(result.data.length<=0){
            return false;
          }
          let startTime= result.data[0].beginTime,
              endTime=result.data[0].endTime,
              time=startTime.replace(/-/g,':').replace(' ',':').split(':'),
              time2=endTime.replace(/-/g,':').replace(' ',':').split(':'),
              start= new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]).getTime(),
              end= new Date(time2[0],(time2[1]-1),time2[2],time2[3],time2[4],time2[5]).getTime(),
              nowTme= new Date(),
              now =nowTme.getTime(),
              count = start - now,
              count2=now-end;
          if(count>0){
            this.canPanic=false;
            this.canPanicTime=`${time[3]}:${time[4]}`
          }else if(count<=0&&count2<=0){
            this.canPanic=true;
            this.canPanicNum=result.data[0].unusedCount;
          }
        }
      })  
    },
    onHide() {
      this.$refs.popup.hide();
    },
    methods: {
      ...mapActions('module_0', ['changemember', 'logOn', 'init']),
      navLeft() {
        uni.navigateTo({
          url: '/pages/bulletin/message'
        });
      },
      navRight() {
        console.log(this.$refs.popup);
        this.$refs.popup.show();
      },
      navigate(path) {
        uni.navigateTo({
          url: path
        });
      },
      beforeConfirm(callback) {
        uni.showModal({
          content: '投资有风险，入行需谨慎',
          cancelText: '取消',
          confirmText: '继续',
          confirmColor: '#E5BC2D',
          success: e => {
            if (e.confirm) {
              callback();
            }
          }
        });
      },
      tohelp() {
        this.tohelpNext()
      },
      tohelpNext() {
        uni.showLoading({
          mask: true
        });
        applyVerify()
          .then(res => {
            let result = res.data;
            if (result.code == '1') {
              this.beforeConfirm(()=>{
                uni.navigateTo({
                  url: '/pages/processing/advance'
                });
              });
              uni.hideLoading();
            } else if (result.code == '2') {
              this.beforeConfirm(()=>{
                uni.navigateTo({
                  url: '/pages/processing/investment'
                });
              });
              uni.hideLoading();
            } else {
              uni.showToast({
                title: result.msg,
                icon: 'none'
              });
            }
          })
          .catch(() => {
            uni.hideLoading();
          });
      },
      toaccept() {
        uni.showLoading({
          mask: true
        });
        receiptVerify()
          .then(res => {
            let result = res.data;
            if (result.code == '1') {
              uni.navigateTo({
                url: '/pages/processing/accept'
              });
              uni.hideLoading();
            } else {
              uni.showToast({
                title: result.msg,
                icon: 'none'
              });
            }
          })
          .catch(() => {
            uni.showToast({
              title: '请求超时，请检查网络',
              icon: 'none'
            });
          });
      },
      topromotion() {
        this.topromotionNext()
        
      },
      topromotionNext() {
        uni.showLoading({
          mask: true
        });
        promotionVerify()
          .then(res => {
            let result = res.data;
            if (result.code == '1') {
              this.beforeConfirm(()=>{
                uni.navigateTo({
                  url: '/pages/processing/competition'
                });
              });
              uni.hideLoading();
            } else {
              uni.showToast({
                title: result.msg,
                icon: 'none'
              });
            }
          })
          .catch(() => {
            uni.hideLoading();
          });
      },
      helpTap(type, id) {
        let url;
        if (type === 'offer') {
          url = 'offer_order_detail?id=' + id;
        } else {
          url = 'accept_order_detail?id=' + id;
        }
        uni.navigateTo({
          url: '/pages/record/' + url
        });
      },
      supplyTap(item) {
        let url = '';
        if (item.status === '1') {
          url = '/pages/settlement/paid?id=' + item.id;
        } else {
          url = '/pages/settlement/deal_detail?id=' + item.id;
        }
        uni.navigateTo({
          url
        });
      },
      receiptTap(item) {
        let url = '';
        if (item.status === '2') {
          url = '/pages/settlement/accept?id=' + item.id;
        } else {
          url = '/pages/settlement/deal_detail?id=' + item.id;
        }
        uni.navigateTo({
          url
        });
      },
      routePush() {
        let token = uni.getStorageSync('token');
        //#ifndef H5
        if (token) {
          getCurrUserInfo()
            .then(res => {
              let result = res.data;
              if (result.code == '1') {
                this.logOn({
                  member: result.data,
                  token
                });
              } else {
                uni.reLaunch({
                  url: '/pages/login/index'
                });
              }
            })
            .catch(error => {
              uni.reLaunch({
                url: '/pages/login/index'
              });
            });
        } else {
          uni.reLaunch({
            url: '/pages/login/index'
          });
        }
        //#endif
      },
      checkVersion() {
        let type = null;
        // #ifdef H5
        type = 1;
        // #endif
        
        // #ifdef APP-PLUS
        type = uni.getSystemInfoSync().platform.toLocaleLowerCase().indexOf('ios') > -1 ? '3' : '2';
        this.percent = 0;
        getVersion({
          type
        }).then(res => {
          let result = res.data;
          if (result.code == 1) {
            if (result.data.versionLevel - this.version.replace(/\./g, '')>0) {
              if (type == 2) {
                downLoadUrl = result.data.downloadUrl;
                this.newversion = result.data.versionCode;
                this.versionDesc = result.data.versionDesc;
                this.$refs.updateBanner.bannerShow = true;
              } else {
                uni.showToast({
                  title: '有新版本发布，请更新',
                  icon:'none'
                })
              }
            } 
          }
        })
        // #endif
      },
      toUpdate() {
        if(!downloading){
          downloading=true;
          downloadTask = uni.downloadFile({
            url: downLoadUrl,
            success: (res) => {
              if (res.statusCode === 200) {
                uni.saveFile({
                  tempFilePath: res.tempFilePath,
                  success: function (res) {
                    plus.runtime.install(res.savedFilePath);
                  }
                });
              } else {
                console.log(JSON.stringify(res))
                uni.showToast({
                  title: '下载出错',
                  icon: 'none'
                })
                this.percent=0;
              }
              downloading=false
            },
            fail:(error)=>{
              uni.showToast({
                title: '下载出错',
                icon: 'none'
              })
              downloading=false
            }
          });
          downloadTask.onProgressUpdate((res) => {
            if (res.progress <= 100) {
              if( res.progress<=0){
                this.percent=1
              }else{
                this.percent = res.progress;
              }
              
            }
          });
        }
      },
      cancel() {
        if (downloadTask) {
          downloading=false
          downloadTask.abort();
        }
      }

    }
  };
</script>

<style lang="less">
  page {
    position: relative;
    background-color: #1a1a24 !important;
  }

  page,
  .page-wrap {
    min-height: 100%;
  }

  .page-wrap {
    position: absolute;

    .header {
      position: relative;

      .header-nav {
        position: absolute;
        z-index: 10;
        top: 0;
        width: 100%;
      }
    }
  }

  .page-content,
  .wrapper,
  .section {
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .section {
    padding: 0 20upx;
  }

  .section-list {
    padding-bottom: 100upx;
  }

  .nodata {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #21212b;
    border-radius: 2upx;
    height: 80upx;
    color: #7f8094;
    font-size: 24upx;
  }

  .icon-box {
    width: 50upx;
  }

  .badge-msg {
    margin-left: -18upx;
  }

  .icon {
    width: 48upx;
    height: 100%;

    image {
      width: 100%;
      height: 100%;
    }

    &.left {
      margin-left: 24upx;
    }
  }

  swiper,
  .swiper-img {
    width: 750upx;
    height: 375upx;
  }

  .swiper-block {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    font-size: 36upx;
    color: #fff;
    width: 280upx;
    height: 80upx;
    text-align: center;
    line-height: 80upx;
    border-radius: 10upx;

    background-color: rgb(255, 153, 0);
  }

  .activation {
    display: flex;
    background: #1a1a24;
    padding: 20upx;

    .ac-code {
      flex: 1;
      display: flex;
      align-items: center;
      background: #21212b;
      color: #fff;
      padding: 30upx;
      height: 88upx;

      &+.ac-code {
        margin-left: 22upx;
      }

      .title {
        font-size: 32upx;
        line-height: 1;
      }

      .text {
        margin-top: 16upx;
        color: #7f8094;
        line-height: 1;
        font-size: 28upx;
      }

      .icon {
        width: 88upx;
        height: 88upx;
        margin-right: 14upx;
      }
    }

    &.activation_2 {
      .icon {
        width: 58upx;
        height: 58upx;
      }

      .title {
        font-size: 26upx;
        display: flex;
        align-items: center;

        text {
          color: #ed783e;
          font-size: 34upx;

          &.spec {
            color: #e5bc2d;
          }
        }
      }
    }
  }

  .panic {
    background: #21212b;
    border-radius: 2upx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 26upx;
    margin: 0 20upx;
    .title {
      font-size: 34upx;
      color: #f87915;
      letter-spacing: 0;
      display: flex;
      align-items: center;
      text {
        line-height: 34upx;
      }
      image {
        margin-left: 24upx;
        width: 34upx;
        height: 34upx;
      }
    }
    .text {
      font-size: 24upx;
      color: #7f8094;
      letter-spacing: 0;
      text-align: center;
      margin-top: 14upx;
    }
    .right{
      display: flex;
      flex-direction: column;
      color: #f29d39;
      justify-content: center;
      
      height: 90upx;
      width: 180upx;
      border: 1px solid #f29d39;
      border-radius: 10upx;
      view{
        text-align: center;
        line-height: 1;
      }
      .panic-title{
        font-weight: bold;
        font-size: 46upx;
      }
      .panic-text{margin-top: 10upx;font-size: 24upx;}
    }
    .icon {
      width: 136upx;
      height: 74upx;

      image {
        height: 100%;
        width: 100%;
      }
    }
  }

  .btn-group {
    padding: 24upx;
    display: flex;
    justify-content: space-between;
    background-color: #f7f7f7;

    .btn {
      width: 44%;
      font-size: 32upx;
      height: 80upx;
      line-height: 80upx;
    }
  }
</style>
