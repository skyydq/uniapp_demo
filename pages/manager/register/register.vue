<template>
  <view class="pagebox">
    <image class="bg" src="/static/bg3.jpg" mode=""></image>
    <!-- #ifndef MP -->
    <!-- 固定在顶部的导航栏 -->
    <uni-nav-bar fixed="true" left-icon="back" @click-left="back" backgroundColor="transparent" color="#fff"
     title="协助注册"></uni-nav-bar>
    <!-- 使用非原生导航栏后需要在页面顶部占位 -->
    <view style="height:88upx;">...</view>
    <!-- #endif -->
	<view class="column-content">
		<view class="uni-common-mt">
			<view class="uni-form-item uni-column">
				<view class="with-fun with-border">
          <image class="icon" src="/static/sign_icon_account.png" mode=""></image>
					<input class="uni-input" placeholder="登录账号（6-20字母数字组合）" :value="account" data-target="account" @input="getInputValue" />
					<view class="uni-icon uni-icon-clear" v-if="account" @click="clearIcon('account')"></view>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view class="with-fun with-border">
          <image class="icon" src="/static/sign_icon_name.png" mode=""></image>
					<input class="uni-input" placeholder="真实姓名" type="text" :value="name" data-target="name" @input="getInputValue" />
					<view class="uni-icon uni-icon-clear" v-if="name" @click="clearIcon('name')"></view>
				</view>
			</view>
			<!-- <view class="uni-form-item uni-column ">
				<view class="with-fun with-border">
          <image class="icon" src="/static/sign_icon_id.png" mode=""></image>

					<input class="uni-input" placeholder="身份证号（选填）" :value="idNumber" data-target="idNumber" @input="getInputValue" />
					<view class="uni-icon uni-icon-clear" v-if="idNumber" @click="clearIcon('idNumber')"></view>
				</view>
			</view> -->
      
			<view class="uni-form-item uni-column ">
				<view class="with-fun with-border">
          <image class="icon" src="/static/sign_icon_iphone.png" mode=""></image>

					<input class="uni-input" placeholder="注册手机" :value="telephone" data-target="telephone" @input="getInputValue" />
					<view class="uni-icon uni-icon-clear" v-if="telephone" @click="clearIcon('telephone')"></view>
				</view>
			</view>
			<verify-code ref="verifyCode"></verify-code>
      <view class="uni-form-item uni-column ">
      	<view class="with-fun with-border">
          <image class="icon" src="/static/sign_icon_password.png" mode=""></image>
      		<input class="uni-input" placeholder="登录密码（6-20字母数字组合）" :password="!showPassword" :value="loginPassword"
      		 data-target="loginPassword" @input="getInputValue" />
      		<view class="uni-icon uni-icon-eye" :class="[showPassword ? 'uni-active' : '']" @click="changePassword('showPassword')"></view>
      	</view>
      </view>
			<view class="uni-form-item uni-column ">
				<view class="with-fun with-border">
          <image class="icon" src="/static/sign_icon_recommend.png" mode=""></image>
					<input class="uni-input" disabled="" :value="parentAccount" />
				</view>
			</view>
		</view>
		<view class="btn-grow">
			<button type="primary" class="primary" @tap="submit">提交</button>
		</view>
	</view>
  </view>
</template>

<script>
	import verifyCode from '@/components/verifyCode'
	import graceChecker from '@/common/graceChecker.js'
	import {helpRegister} from '@/common/getData.js'
  import {checkIDCard} from '@/common/until'
  import uniNavBar from '@/components/uni-nav-bar.vue'

	export default {
		components: {
			verifyCode,uniNavBar
		},
		data() {
			return {
				account: "",
				name: "",
				idNumber: "",
				telephone: "",
				parentAccount:'',
				parentId:'',
        loginPassword:"123456",
        showPassword: false,
			};
		},
		onLoad(e){
			this.parentAccount=e.parentAccount;
			this.parentId=e.parentId;
		},
		methods: {
      back(){
        uni.navigateBack({
        	delta: 1
        })
      },  
			getInputValue(event) {
				let tartObj = event.currentTarget.dataset.target;
				this[tartObj] = event.target.value;
			},
			changePassword(obj) {
				this[obj] = !this[obj];
			},
			clearIcon(val) {
				this[val] = "";
			},
			checkValue(data) {
				let rule = [{
							name: "account",
							checkType: "reg",
							checkRule: "^[a-zA-Z0-9]{6,20}$",
							errorMsg: "账号请输入6-20字母数字组合"
						},
						{
							name: "name",
							checkType: "string",
							checkRule: "2,",
							errorMsg: "请输入姓名"
						},
            {
            	name: "loginPassword",
            	checkType: "reg",
            	checkRule: "^[a-zA-Z0-9]{6,20}$",
            	errorMsg: "密码请输入6-20字母数字组合"
            },
						{
							name: "telephone",
							checkType: "phoneno",
							checkRule: "",
							errorMsg: "请选择正确手机号"
						},
						{
							name: "checkCode",
							checkType: "notnull",
							checkRule: "",
							errorMsg: "请输入验证码"
						}
					],
					checkRes = graceChecker.check(data, rule);
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: 'none'
					})
					return false;
				}
        if(data.idNumber&&(!checkIDCard(data.idNumber))){
          uni.showToast({
          	title: '请输入正确身份证号码',
          	icon:'none'
          });
          return false;
        }
				return true
			},
			submit() {
				let data = {
					account: this.account,
					name: this.name,
          loginPassword:this.loginPassword,
					idNumber: this.idNumber,
					parentAccount: this.parentAccount,
					parentId:this.parentId,
					telephone: this.telephone,
					uuid: this.$refs.verifyCode.uuid,
					checkCode: this.$refs.verifyCode.checkCode,
				};
				if (this.checkValue(data)) {
					uni.showLoading({
						mask:true
					})
					helpRegister(data).then(res => {
						let result = res.data;
						uni.showToast({
							title: result.msg,
							icon: 'none'
						})
						if (result.code === '1') {
							setTimeout(() => {
								uni.navigateBack()
							}, 1500)

						}
					}).catch(()=>{
						uni.showToast({
							title: '请求超时，请检查网络',
							icon: 'none'
						})
					})
				}

			}
		}

	}
</script>

<style lang="less">
   page{
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
	  position: relative;
	  min-height: 100%;
	  height: auto;
	  padding:10upx 62upx 62upx;
    .uni-input{
      background-color: transparent;
      color: #fff;
    }
	}
  
	.uni-form-item {
		.bgtrans {
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
  .icon{
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
		margin-top: 20upx;
    opacity: 0.9;
	}
</style>
