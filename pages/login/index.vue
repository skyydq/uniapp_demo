<template>
  <view class="pagebox">
    <image class="bg" src="/static/bg1.jpg" mode="aspectFill"></image>
    <view class="column-content">
        <view class="logo"><image src="/static/logo.png" alt="" /></view>
        <view class="uni-common-mt">
          <view class="uni-form-item uni-column">
            <view class="with-fun with-border userAccount">
              <image src="/static/sign_icon_account.png" mode="aspectFill"></image>
              <input
                class="uni-input"
                placeholder="请输入您的账号"
                v-model="account"
              />
              <view class="uni-icon uni-icon-clear" v-if="account" @click="clearIcon"></view>
            </view>
          </view>
          <view class="uni-form-item uni-column ">
            <view class="with-fun with-border">
              <image src="/static/menu_shop_click.png" mode="aspectFill"></image>
              <input class="uni-input" v-model="loginPassword" placeholder="请输入您的密码" :password="!showPassword" />
              <view
                class="uni-icon uni-icon-eye"
                :class="[showPassword ? 'uni-active' : '']"
                @click="changePassword"
              ></view>
            </view>
          </view>
    			<verify-code ref="verifyCode"></verify-code>	
        </view>
        <view class="btn-row">
          <button type="primary" plain="true" class="btn primary" @tap="toResigter">注册</button>
          <button type="primary" class="btn primary" @tap="bindLogin">登录</button>
        </view>
        <view class="reset" @tap="toReset">
          忘记密码
        </view>
      </view>
    
  </view>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import verifyCode from '@/components/verifyCode'
  import { baseUrl } from '@/common/until.js'
  import {login,checkCode} from '@/common/getData.js'
  import graceChecker from '@/common/graceChecker.js'
  export default {
    components:{
      verifyCode
    },
    data() {
      return {
        showPassword:false,
        checkCode:'',
        loginPassword:'',
        account:'',
        verifyImg:'',
        uuid:''
      };
    },
    computed:{
      ...mapState('module_0', ['registerInfo'])
    },
    onLoad(e){
      if(this.registerInfo.account){
        this.account=this.registerInfo.account
      }
      if(this.registerInfo.loginPassword){
        this.loginPassword=this.registerInfo.loginPassword
      }
    },
    methods: {
      ...mapActions('module_0', ['logOn']),
      clearIcon() {
        this.account = '';
      },
      changePassword() {
        this.showPassword = !this.showPassword;
      },
      toResigter() {
        uni.navigateTo({
          url: '/pages/register/register'
        });
      },
      bindLogin(){
        var data={
          account:this.account,
          loginPassword:this.loginPassword,
          uuid: this.$refs.verifyCode.uuid,
          checkCode:this.$refs.verifyCode.checkCode,
        },
        rule = [
            {name:"account", checkType : "reg", checkRule:"^[a-zA-Z0-9]{6,20}$",  errorMsg:"请输入正确账号"},
            {name:"loginPassword", checkType : "reg", checkRule:"^[a-zA-Z0-9]{6,20}$",  errorMsg:"请输入正确密码"},
            {name:"checkCode", checkType : "notnull", checkRule:"",  errorMsg:"请输入验证码"}];
        let checkRes = graceChecker.check(data, rule);
        if(!checkRes){
          uni.showToast({
            title:graceChecker.error,
            icon:'none'
          })
          return false;
        }
        uni.showLoading({
          mask:true
        })
        login(data).then(res=>{
          let result=res.data;
          uni.showToast({
            title:result.msg,
            icon:'none'
          })
          if(result.code=='1'){
            this.logOn(result.data);
            setTimeout(()=>{
              uni.switchTab({
                url:'/pages/tabBar/exchange/exchange'
              })
            },1000)
          }else{
            this.$refs.verifyCode.getVerify();
          }
        }).catch(()=>{
          uni.showToast({
            title: '请求超时，请检查网络',
            icon: 'none'
          })
        })
      },
      toReset(){
        uni.navigateTo({
        	url:'/pages/reset/reset'
        })
      }
    }
  };
</script>

<style lang="less">
page {
  position: relative;
  min-height: 100%;
	.bg{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
  }
}
.column-content {
  position: relative;
  z-index: 10;
  padding: 62upx 104upx;
  display: block;
  .logo {
    width:316upx;
    height: 316upx;
    margin: 48upx auto;
    image{
      display: block;
      height: 100%;
      width: 100%;
    }
  }
}
.uni-form-item{
   .with-fun{
    background-color: transparent;
   }
}

.with-border {
  margin-bottom: 4upx;
  align-items: center;
  padding-bottom: 16upx;
  &:after{
    opacity: 0.3;
    height: 1px;
    width: 100%;
    transform: scaleY(0.5);
    top: auto;
    bottom:0;
    background-color:#E4E4E4;
  }
  image{
    width: 48upx;
    height: 48upx;
    display: block;
  }
  .uni-input{
    padding-left: 20upx;
    color: #fff;
  }
  
	.uni-icon{
		position: relative;
		z-index: 90;
	}
}
.btn-row {
  display: flex;
  padding-top: 10upx;
  margin-top: 60upx;
  justify-content: space-between;
  .btn {
    margin: 0;
    line-height: 88upx;
    height: 88upx;
    width: 260upx;
  }
}
.reset{
  margin-top: 20upx;
  text-align: center;
  color: #D4D4D4;
  text-decoration: underline;
  font-size: 30upx;
}

</style>
