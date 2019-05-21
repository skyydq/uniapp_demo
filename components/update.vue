<template>
  <view class="sbanner">
    <view class="uni-banner" style="background:#FFFFFF;" v-if="bannerShow">
      <view class="uni-banner-title">
          <view class="uni-banner-title-content">
            <view>
              发现新版本（{{version}}）
            </view>
            <view>
              更新内容
            </view>
          </view>
      </view>
      <view class="uni-card-content-inner">
        <view class="version-content">
          <view>{{versionDesc?versionDesc:""}}</view>
        </view>
        <block v-if="percent">
          <progress :percent="percent" active active-mode="forwards" show-info stroke-width="2" activeColor="#DFBA3C" />
        </block>
        <view class="btn-box">
          <button type="default"  @tap="closeBanner">暂时忽略</button>
          <button type="primary" @tap="submit" :loading="disabled" :disabled="disabled">下载更新</button>
        </view>
      </view>
    </view>
    <view class="uni-mask" v-if="bannerShow"></view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      bannerShow: false,
    };
  },
  props: {
		disabled:{
			default:false,
			type:Boolean
		},
    version:'',
    versionDesc:"",
    percent:{
      type:[String,Number]
    }
  },
  onBackPress() {
    if (this.bannerShow) {
      this.bannerShow = false;
      return true;
    }
  },
  methods: {
    closeBanner() {
      this.bannerShow = false;
      this.$emit('cancel');
    },
    showBanner() {
      this.bannerShow = true;
    },
    submit() {
      this.$emit('submit');
    },
    changePassword() {
      this.showPassword = !this.showPassword;
    }
  }
};
</script>

<style lang="less" scoped="">
.sbanner {
  position: relative;
  z-index: 999;
}
/* 遮罩层 */
.uni-mask {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1;
}

/* 弹出层形式的广告 */
.uni-banner {
  width: 70%;
  position: fixed;
  z-index: 99;
  left: 50%;
  top: 50%;
  background: #fff;
  border-radius: 10upx;
  z-index: 99;
  transform: translate(-50%, -50%);
  .uni-card-content-inner {
    padding-top: 0;
  }
  view{
    font-size: 14px;
  }
}
.uni-banner-title{
  background-color: #f87915;
  color: #fff;
  padding: 20upx;
}
.version-content{
  padding: 20upx 0;  
}
.btn-box {
  margin-top: 40upx;
  display: flex;
  justify-content: space-between;
  button{
    line-height: 60upx;
    font-size: 28upx;
    margin: 0;
    width: 45%;
  }
}
</style>
