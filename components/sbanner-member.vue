<template>
  <view class="sbanner">
    <view class="uni-banner" style="background:#FFFFFF;" v-if="bannerShow">
      <view class="uni-banner-title">
          <view class="uni-banner-title-content" v-if="showNum">当前剩余数:{{ableNum}}</view>
          <view class="uni-banner-title-close" @tap="closeBanner">
            <view style="justify-content:flex-end; text-align:right; padding:20upx;">
              <text class="uni-icon uni-icon-close"></text>
            </view>
          </view>    
      </view>

      <view class="uni-card-content-inner">
        <view class="input-box">
          <input class="uni-input" type="text" v-model="account" @change="getMember"  placeholder="输入转入人账号">
        </view>
        <view class="input-box">
          <input class="uni-input" type="text" disabled="" :value="name" @tap="getMember" placeholder="点击显示姓名">
        </view>
        <view class="input-box">
          <input class="uni-input" type="number" v-model="num"  placeholder="输入转出个数">
        </view>
        <view class="input-box uni-form-item">
          <input
            autocomplete=""
            class="uni-input"
            v-model="psw"
            placeholder="输入交易密码"
            :password="!showPassword"
          />
          <view
            class="uni-icon uni-icon-eye"
            :class="[showPassword ? 'uni-active' : '']"
            @tap="changePassword"
          ></view>
        </view>
        <view class="btn-box"><button type="primary" @tap="submit" :loading="disabled" :disabled="disabled">提交</button></view>
      </view>
    </view>
    <view class="uni-mask" v-if="bannerShow"></view>
  </view>
</template>
<script>
import {queryTeamUserByAccount} from '@/common/getData.js'
let id;
export default {
  data() {
    return {
      psw: '',
      showPassword: false,
      bannerShow: false,
      name:'',
      account:'',
      num:""
    };
  },
  props: {
		disabled:{
			default:false,
			type:Boolean
		},
    ableNum:'',
    showNum:{
      type:Boolean,
      default:false
    }
  },
  onBackPress() {
    if (this.bannerShow) {
      this.bannerShow = false;
      return true;
    }
  },
  methods: {
    getMember(){
      queryTeamUserByAccount({
        account:this.account
      }).then(res=>{
       let result=res.data;
         if(result.code=='1'){
           this.name=result.data.name;
           id=result.data.id
         }
         else{
           uni.showToast({
           	title:'账号不存在或无权转出',
            icon:'none'
           })
           this.name='';
           id='';
         }
      })
    },
    closeBanner() {
      this.bannerShow = false;
    },
    showBanner() {
      this.bannerShow = true;
    },
    submit() {
      let data = {
        num: this.num,
        psw: this.psw,
        account:this.account,
        id:id
      };
      this.$emit('submit', data);
      this.psw='';
      this.account='';
      this.name='';
      this.num='';
      id='';
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
}
.uni-banner-title{
  position: relative;
  .uni-banner-title-content{
   position: absolute;
   width: 100%;
   height: 100%;
   display: flex;
   align-items: center;
   justify-content: center;
  }
  .uni-banner-title-close{
    position: relative;
    z-index: 10;
  }
}
.uni-form-item {
  .uni-icon {
    position: relative;
    z-index: 99;
    width: 80upx;
    height: 80upx;
    line-height: 80upx;
  }
}
.input-box {
  position: relative;
  z-index: 99;
  padding: 0;
  margin-bottom: 40upx;
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 200%;
    height: 200%;
    transform-origin: 0 0;
    transform: scale(0.5);
    border: 2upx solid #ccc;
    border-radius: 6upx;
    box-sizing: border-box;
  }
}
.btn-box {
  margin-top: 40upx;
}
</style>
