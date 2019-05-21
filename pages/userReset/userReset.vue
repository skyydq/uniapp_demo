<template>
  <view class="uni-padding-wrap">
    <view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" placeholder="真实姓名" type="text" :value="name" data-target="name" @input="getInputValue" />
          <view class="uni-icon uni-icon-clear" v-if="name" @click="clearIcon('name')"></view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <view class="uni-input-box" @click="showbanks">
            <input class="uni-input" type="text" disabled :value="banktext" placeholder="请选择开户银行（必输）" />
          </view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <view class="uni-input-box" @click="showCity">
            <input class="uni-input" type="text" disabled :value="citytext" placeholder="请选择开户行所在省市（必输）" />
          </view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" type="text" :value="address" data-target="address" @input="getInputValue"
            placeholder="请输入开户详情地址" />
          <view class="uni-icon uni-icon-clear" v-if="address" @click="clearIcon('address')"></view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" type="number" :vlaue="cardcode" data-target="cardcode" @input="getInputValue"
            placeholder="请输入16~19位银行卡号" />
          <view class="uni-icon uni-icon-clear" v-if="cardcode" @click="clearIcon('cardcode')"></view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" :value="aliPay" data-target="aliPay" @input="getInputValue" placeholder="支付宝账号(选填)" />
          <view class="uni-icon uni-icon-clear" v-if="aliPay" @click="clearIcon('aliPay')"></view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" placeholder="微信账号(选填)" :value="wechatPay" data-target="wechatPay" @input="getInputValue" />
          <view class="uni-icon uni-icon-clear" v-if="wechatPay" @click="clearIcon('wechatPay')"></view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" placeholder="新手机号码" :value="telephone" data-target="telephone" @input="getInputValue" />
          <view class="uni-icon uni-icon-clear" v-if="telephone" @click="clearIcon('telephone')"></view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" placeholder="短信验证码" :value="phoneCode" data-target="phoneCode" @input="getInputValue" />
          <view class="btn-smscode">
            <button type="primary" plain="true" class="btn primary" disabled="" v-if="getCodeText">
              {{ getCodeText }}
            </button>
            <button type="primary" plain="true" class="btn primary" v-else :disable="smscodeLoading" :loading="smscodeLoading"
              @tap="getCode">
              {{ btnVerifyText }}
            </button>
          </view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content "> <input class="uni-input" placeholder="新登录密码（6-20字母数字组合）" :password="!showPassword"
            :value="loginPassword" data-target="loginPassword" @input="getInputValue" />
          <view class="uni-icon uni-icon-eye" :class="[showPassword ? 'uni-active' : '']" @click="changePassword('showPassword')"></view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" placeholder="确认登录密码（与首次一致）" :password="!showPassword_" :value="confirmPassword"
            data-target="confirmPassword" @input="getInputValue" />
          <view class="uni-icon uni-icon-eye" :class="[showPassword_ ? 'uni-active' : '']" @click="changePassword('showPassword_')"></view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" placeholder="新交易密码（6-20字母数字组合）" :password="!showPayPassword" :value="payPassword"
            data-target="payPassword" @input="getInputValue" />
          <view class="uni-icon uni-icon-eye" :class="[showPayPassword ? 'uni-active' : '']" @click="changePassword('showPayPassword')"></view>
        </view>
      </view>
      <view class="uni-card">
        <view class="uni-card-content">
          <input class="uni-input" placeholder="确认交易密码（与首次一致）" :password="!showPayPassword_" :value="confirmPayPassword"
            data-target="confirmPayPassword" @input="getInputValue" />
          <view class="uni-icon uni-icon-eye" :class="[showPayPassword_ ? 'uni-active' : '']" @click="changePassword('showPayPassword_')"></view>
        </view>
      </view>
    </view>
    <view class="btn-grow"><button type="primary" class="primary" @tap="submit">提交</button></view>
    <verify-code-popup ref="verifyPopup" @clearVerify="clearVerify"></verify-code-popup>
    <mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
      @onConfirm="onConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>
    <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
      @onConfirm="onConfirm"></mpvue-city-picker>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex';
  import {
    userReset,
    userResetSms
  } from '@/common/getData.js';
  import {
    bankcardList
  } from '@/common/bankcard.js'
  import verifyCodePopup from '@/components/verifyCode-popup';
  import graceChecker from '@/common/graceChecker.js';
  import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
  import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
  import cityData from '@/common/city.data.js'
  export default {
    components: {
      verifyCodePopup,
      mpvuePicker,
      mpvueCityPicker
    },
    data() {
      return {
        account: '',
        name: '',
        idNumber: '',
        loginPassword: '',
        confirmPassword: '',
        payPassword: "",
        confirmPayPassword: '',
        parentAccount: '',
        telephone: '',
        phoneCode: '',
        showPassword: false,
        showPassword_: false,
        showPayPassword: false,
        showPayPassword_: false,
        smscodeLoading: false,
        getCodeText: '',
        btnVerifyText: '获取验证码',
        smscodeSendCount: 0,
        uuid: '',
        isSended: false,
        disabled: false,
        banktext: '',
        citytext: '',
        province: '',
        city: "",
        country: '',
        address: '',
        cardcode: '',
        mode: '',
        deepLength: 1,
        selectMode: null,
        pickerValueArray: [],
        themeColor: '#E5BC2D',
        pickerValueDefault: [0],
        cityPickerValueDefault: [0, 0, 1],
        aliPay: '',
        wechatPay: ''
      };
    },
    onLoad(e) {
      if (e.pt) {
        this.parentAccount = e.pt;
        this.disabled = true;
      }
    },
    computed: {
      ...mapState('module_0', ['isUserReset'])
    },
    methods: {
      ...mapMutations('module_0', ['logOut', 'changeUserReset']),
      getInputValue(event) {
        let tartObj = event.currentTarget.dataset.target;
        this[tartObj] = event.target.value;
      },
      back() {
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
        if(!this.isUserReset){
          uni.showToast({
          	title:'暂无权限，请重新进入',
            icon:'none'
          })
          return false;
        }
        let rule = [{
              name: 'name',
              checkType: "string",
              checkRule: "2,",
              errorMsg: "请输入姓名"
            },
            {
              name: 'loginPassword',
              checkType: 'reg',
              checkRule: '^[a-zA-Z0-9]{6,20}$',
              errorMsg: '密码请输入6-20字母数字组合'
            },
            {
              name: 'payPassword',
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
              errorMsg: '请输入相同的登录密码'
            },
            {
              name: 'confirmPayPassword',
              checkType: 'same',
              checkRule: this.payPassword,
              errorMsg: '请输入相同的交易密码'
            },
            {
              name: 'phoneCode',
              checkType: 'notnull',
              checkRule: '',
              errorMsg: '请输入短信验证码'
            },
            {
              name: "bankName",
              checkType: "notnull",
              checkRule: "",
              errorMsg: "请选择开户银行"
            },
            {
              name: "city",
              checkType: "notnull",
              checkRule: "",
              errorMsg: "请选择开户行所在省市"
            },
            {
              name: "bankAddress",
              checkType: "notnull",
              checkRule: "",
              errorMsg: "请输入开户详情地址"
            },
            {
              name: "bankNumber",
              checkType: "int",
              checkRule: "15,18",
              errorMsg: "请输入正确的银行卡号"
            }
          ],
          data = {
            loginPassword: this.loginPassword,
            payPassword: this.payPassword,
            telephone: this.telephone,
            phoneCode: this.phoneCode,
            uuid: this.uuid,
            name: this.name,
            bankName: this.banktext,
            province: this.province,
            city: this.city,
            country: this.country,
            bankAddress: this.address,
            bankNumber: this.cardcode,
            alipayAccount: this.aliPay,
            wechatAccount: this.wechatPay,
          };
        let dat = Object.assign({
          confirmPassword: this.confirmPassword,
          confirmPayPassword: this.confirmPayPassword
        }, data)
        let checkRes = graceChecker.check(dat, rule);
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
        userReset(data)
          .then(res => {
            let result = res.data;
            if (result.code == '1') {
              uni.showToast({
                title: '个人资料重置成功',
                icon: 'none'
              });
              this.changeUserReset(false);
              this.logOut();
              setTimeout(() => {
                uni.reLaunch({
                  url: "/pages/login/index"
                })
              }, 1500)
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
      clearVerify() {
        this.smscodeSendCount = 0;
      },
      getCode() {
        if(!this.isUserReset){
          uni.showToast({
          	title:'暂无权限，请重新进入',
            icon:'none'
          })
          return false;
        }
        this.isSended = true;
        if (this.smscodeSendCount >= 2) {
          this.$refs.verifyPopup.showBanner();
          return false;
        }
        this.uuid = this.guid();
        let data = {
              telephone: this.telephone,
              uuid: this.uuid,
              name: this.name,
              bankName: this.banktext,
              province: this.province,
              city: this.city,
              country: this.country,
              bankAddress: this.address,
              bankNumber: this.cardcode,
            },
              rule = [{
              name: 'name',
              checkType: "string",
              checkRule: "2,",
              errorMsg: "请输入姓名"
            },
            {
              name: 'telephone',
              checkType: 'phoneno',
              checkRule: '',
              errorMsg: '请选择正确手机号'
            },
            {
              name: "bankName",
              checkType: "notnull",
              checkRule: "",
              errorMsg: "请选择开户银行"
            },
            {
              name: "city",
              checkType: "notnull",
              checkRule: "",
              errorMsg: "请选择开户行所在省市"
            },
            {
              name: "bankAddress",
              checkType: "notnull",
              checkRule: "",
              errorMsg: "请输入开户详情地址"
            },
            {
              name: "bankNumber",
              checkType: "int",
              checkRule: "15,18",
              errorMsg: "请输入正确的银行卡号"
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
        userResetSms(data)
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
            } else {
              uni.showToast({
                title: result.msg,
                icon: 'none'
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
      },
      showbanks() {
        this.pickerValueArray = bankcardList,
          this.mode = 'selector',
          this.deepLength = 1,
          this.pickerValueDefault = [0],
          this.$refs.mpvuePicker.show(),
          this.selectMode = 'bank'
      },
      showCity() {
        this.selectMode = 'city',
          this.$refs.mpvueCityPicker.show()
      },
      onConfirm(e) {
        console.log(e.label)
        switch (this.selectMode) {
          case 'bank':
            this.banktext = e.label;
            break;
          case 'city':

            this.citytext = e.label;
            let a = e.label.split('-');
            this.province = a[0];
            this.city = a[1];
            this.country = a[2];
            break;
          default:
            break;
        }
      }
    }
  };
</script>

<style lang="less">
  .btn-smscode button[disabled][type='primary'] {
    background-color: transparent;
  }
  .uni-card-content{
    display: flex;
  }
  .uni-icon{
    line-height: 80upx;
    height: 80upx;
    width: 80upx;
    flex-shrink: 0;
  }
  .uni-input-box{
    width: 100%;
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
    margin: 20upx 0;
    opacity: 0.9;
    padding-bottom: 20upx;
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
