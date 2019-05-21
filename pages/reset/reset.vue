<template>
  <view class="page">
    <image class="bg" src="/static/bg3.jpg" mode="aspectFill"></image>
    <uni-nav-bar fixed="true" left-icon="back" @click-left="back" backgroundColor="transparent" color="#fff"
     title="重置密码"></uni-nav-bar>
    <view class="column-content">
        <view>
          <view class="uni-form-item uni-column">
            <view class="with-fun with-border">
              <image class="icon" src="/static/sign_icon_account.png" mode=""></image>
              <input
                class="uni-input"
                placeholder="登录账号（6-20字母数字组合）"
                :value="account"
                data-target="account"
                @input="getInputValue"
              />
              <view class="uni-icon uni-icon-clear" v-if="account" @click="clearIcon('account')"></view>
            </view>
          </view>
          <view class="uni-form-item uni-column ">
            <view class="with-fun with-border">
              <image class="icon" src="/static/sign_icon_iphone.png" mode=""></image>
              <input
                class="uni-input"
                placeholder="注册手机"
                :value="telephone"
                data-target="telephone"
                @input="getInputValue"
              />
              <view
                class="uni-icon uni-icon-clear"
                v-if="telephone"
                @click="clearIcon('telephone')"
              ></view>
            </view>
          </view>
          <view class="uni-form-item uni-column ">
            <view class="with-fun bgtrans with-border">
              <image class="icon" src="/static/sign_icon_message.png" mode=""></image>
              <input
                class="uni-input"
                placeholder="短信验证码"
                :value="phoneCode"
                data-target="phoneCode"
                @input="getInputValue"
              />
              <view class="btn-smscode">
                <button type="primary" plain="true" class="btn primary" disabled="" v-if="getCodeText">
                  {{ getCodeText }}
                </button>
                <button
                  type="primary"
                  plain="true"
                  class="btn primary"
                  v-else
                  :disable="smscodeLoading"
                  :loading="smscodeLoading"
                  @tap="getCode"
                >
                  {{ btnVerifyText }}
                </button>
              </view>
            </view>
          </view>
    
          <view class="uni-form-item uni-column ">
            <view class="with-fun with-border">
              <image class="icon" src="/static/sign_icon_password.png" mode=""></image>
              <input
                class="uni-input"
                placeholder="新密码（6-20字母数字组合）"
                :password="!showPassword"
                :value="loginPassword"
                data-target="loginPassword"
                @input="getInputValue"
              />
              <view
                class="uni-icon uni-icon-eye"
                :class="[showPassword ? 'uni-active' : '']"
                @click="changePassword('showPassword')"
              ></view>
            </view>
          </view>
          <view class="uni-form-item uni-column ">
            <view class="with-fun with-border">
              <image class="icon" src="/static/sign_icon_password.png" mode=""></image>
              <input
                class="uni-input"
                placeholder="确认登录密码（与首次一致）"
                :password="!showPassword_"
                :value="confirmPassword"
                data-target="confirmPassword"
                @input="getInputValue"
              />
              <view
                class="uni-icon uni-icon-eye"
                :class="[showPassword_ ? 'uni-active' : '']"
                @click="changePassword('showPassword_')"
              ></view>
            </view>
          </view>
        </view>
        <view class="btn-grow"><button type="primary" class="primary" @tap="submit">提交</button></view>
        <verify-code-popup ref="verifyPopup" @clearVerify="clearVerify"></verify-code-popup>
      </view>
    
  </view>
  </template>

<script>
  import { mapState, mapMutations } from 'vuex';
  import verifyCodePopup from '@/components/verifyCode-popup';
  import graceChecker from '@/common/graceChecker.js';
  import { passwordReset, passwordResetSms } from '@/common/getData.js';
  import uniNavBar from '@/components/uni-nav-bar.vue'

  export default {
    components: {
      verifyCodePopup,uniNavBar
    },
    data() {
      return {
        account: '',
        name: '',
        idNumber: '',
        loginPassword: '',
        confirmPassword: '',
        parentAccount: '',
        telephone: '',
        phoneCode: '',
        showPassword: false,
        showPassword_: false,
        smscodeLoading: false,
        getCodeText: '',
        btnVerifyText: '获取验证码',
        smscodeSendCount: 0,
        uuid: '',
        isSended: false,
        disabled: false
      };
    },
    onLoad(e) {
      if (e.pt) {
        this.parentAccount = e.pt;
        this.disabled = true;
      }
    },
    methods: {
      ...mapMutations('module_0', ['CHANGEDATAOBJECT']),
      getInputValue(event) {
        let tartObj = event.currentTarget.dataset.target;
        this[tartObj] = event.target.value;
      },
      back(){
        uni.navigateBack({
        	delta: 1
        })
      },
      changePassword(obj) {
        this[obj] = !this[obj];
      },
      clearIcon(val) {
        this[val] = '';
      },
      submit(e) {
        let rule = [
            {
              name: 'account',
              checkType: 'reg',
              checkRule: '^[a-zA-Z0-9]{6,20}$',
              errorMsg: '账号请输入6-20字母数字组合'
            },
            {
              name: 'loginPassword',
              checkType: 'reg',
              checkRule: '^[a-zA-Z0-9]{6,20}$',
              errorMsg: '密码请输入6-20字母数字组合'
            },
            {
              name: 'telephone',
              checkType: 'phoneno',
              checkRule: '',
              errorMsg: '请选择正确手机号'
            },
            {
              name: 'confirmPassword',
              checkType: 'same',
              checkRule: this.loginPassword,
              errorMsg: '请输入相同的密码'
            },
            {
              name: 'phoneCode',
              checkType: 'notnull',
              checkRule: '',
              errorMsg: '请输入短信验证码'
            }
          ],
          data_verify = {
            account: this.account,
            telephone: this.telephone
          },
          data_register = {
            account: this.account,
            loginPassword: this.loginPassword,
            telephone: this.telephone,
            phoneCode: this.phoneCode,
            uuid: this.uuid
          };
        let checkRes = graceChecker.check(
          Object.assign(
            {
              confirmPassword: this.confirmPassword
            },
            data_register
          ),
          rule
        );
        if (!checkRes) {
          uni.showToast({
            title: graceChecker.error,
            icon: 'none'
          });
          return false;
        }
        if (!this.isSended) {
          uni.showToast({
            title: '请获取验证码',
            icon: 'none'
          });
          return false;
        }
        uni.showLoading({
          mask: true
        });
        passwordReset(data_register)
          .then(res => {
            let result = res.data;
            if (result.code == '0') {
              uni.showToast({
                title: result.msg,
                icon: 'none'
              });
            } else {
              uni.showToast({
                title: '密码重置成功',
                icon: 'none'
              });
              this.CHANGEDATAOBJECT({ name: 'registerInfo', value: data_register });
              setTimeout(() => {
                uni.navigateTo({
                  url: '/pages/login/index'
                });
              }, 1500);
            }
          })
          .catch(() => {
            uni.showToast({
              title: '请求超时，请检查网络',
              icon: 'none'
            });
          });
      },
      clearVerify() {
        this.smscodeSendCount = 0;
      },
      getCode() {
        this.isSended = true;
        if (this.smscodeSendCount >= 2) {
          this.$refs.verifyPopup.showBanner();
          return false;
        }
        this.uuid = this.guid();
        let data = {
            account: this.account,
            telephone: this.telephone,
            uuid: this.uuid
          },
          rule = [
            {
              name: 'account',
              checkType: 'reg',
              checkRule: '^[a-zA-Z0-9]{6,20}$',
              errorMsg: '账号请输入6-20字母数字组合'
            },
            {
              name: 'telephone',
              checkType: 'phoneno',
              checkRule: '',
              errorMsg: '请选择正确手机号'
            }
          ],
          checkRes = graceChecker.check(data, rule);
        if (!checkRes) {
          uni.showToast({
            title: graceChecker.error,
            icon: 'none'
          });
          return false;
        }
        let time = 60;
        this.smscodeLoading = true;
        passwordResetSms(data)
          .then(res => {
            let result = res.data;
            if (result.code == '1') {
              this.showVerifyTime(time);
              this.smscodeSendCount++;
              let setIntVal = setInterval(() => {
                time--;
                if (time < 0) {
                  clearInterval(setIntVal);
                  this.btnVerifyText = '重新发送';
                  this.getCodeText = '';
                  return false;
                }
                this.showVerifyTime(time);
              }, 1000);
            }else{
              uni.showToast({
                title: result.msg,
                icon:'none'
              });
              this.smscodeLoading = false;
            }
          })
          .finally(res => {
            this.smscodeLoading = false;
          });
      },
      showVerifyTime(time) {
        this.getCodeText = (time >= 10 ? time : '0' + time) + 's';
      },
      guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var md = Math.random() * 16;
          var r = md | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
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
   }
} 
.column-content {
  justify-content: space-between;
  position: absolute;
  z-index: 10;
  min-height: 100%;
  height: auto;
  padding: 100upx 62upx 62upx;
  width: 100%;
}
.btn-smscode button[disabled][type='primary'] {
  background-color: transparent;
}
.uni-form-item {
  .with-fun {
    background-color: transparent;
    .uni-input {
      background-color: transparent;
      color: #fff;
    }
  }
  .bgtrans {
    background-color: transparent;
  }
}
.with-border {
  margin-bottom: 4upx;
  align-items: center;
  padding-bottom: 16upx;
  &:after {
    opacity: 0.3;
    height: 1px;
    width: 100%;
    transform: scaleY(0.5);
    top: auto;
    bottom: 0;
    background-color: #e4e4e4;
  }
  .icon {
    width: 48upx;
    height: 48upx;
    display: block;
  }
}
.btn {
  margin-left: 20upx;
  height: 50upx;
  line-height: 50upx;
  box-sizing: content-box;
  padding-top: 14upx;
  padding-bottom: 14upx;
}

.btn-grow {
  margin-top: 52upx;
  opacity: 0.9;
}

.btn-smscode {
  button {
    width: 180upx;
    font-size: 28upx;
  }
}
button[disabled][type='primary'] {
  background-color: #f7f7f7;
}
</style>
