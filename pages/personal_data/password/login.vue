<template>
	<view class="uni-padding-wrap">
		<view class="uni-card uni-form-item uni-column ">
			<view class="uni-card-content">
				<view class="with-fun">
					<input class="uni-input"  v-model="old_password" :password="!old_showPassword"  placeholder="旧密码" />
					<view class="uni-icon uni-icon-eye" :class="[old_showPassword ? 'uni-active' : '']" @click="changePassword('old_showPassword')"></view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-form-item uni-column ">
			<view class="uni-card-content">
				<view class="with-fun">
					<input class="uni-input"  v-model="password" :password="!showPassword"  placeholder="新密码(6-20字母数字组合）" />
					<view class="uni-icon uni-icon-eye" :class="[showPassword ? 'uni-active' : '']" @click="changePassword('showPassword')"></view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-form-item uni-column ">
			<view class="uni-card-content">
				<view class="with-fun">
					<input class="uni-input" v-model="password_" :password="!showPassword_" placeholder="确认密码"  />
					<view class="uni-icon uni-icon-eye" :class="[showPassword_ ? 'uni-active' : '']" @click="changePassword('showPassword_')"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {updateLoginPassWd} from '@/common/getData.js'
	import graceChecker from '@/common/graceChecker.js'
	export default {
		data() {
			return {
				old_password:'',
				password:'',
				password_:'',
				old_showPassword:false,
				showPassword:false,
				showPassword_:false,
				target:''
			};
		},
		onLoad(e){
			this.target=e.target;
		},
		onNavigationBarButtonTap(e) {
			let rule = [
				{name: "oldLoginPassword",checkType: "reg",checkRule: "^[a-zA-Z0-9]{6,20}$",errorMsg: `请输入旧密码（6~20位字母数字组合）`},
				{name: "loginPassword",checkType: "reg",checkRule: "^[a-zA-Z0-9]{6,20}$",errorMsg: `请输入新密码（6~20位字母数字组合）`},
				{name: "loginPassword_",checkType: "same",checkRule: this.password,errorMsg: `请确认密码与新密码保持一致`}],
				data={
					oldLoginPassword:this.old_password,
					loginPassword:this.password
				},
				dat=Object.assign({
					loginPassword_:this.password_
				},data),
				checkRes = graceChecker.check(dat, rule);
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
			updateLoginPassWd(data).then(res=>{
				let result=res.data;
				uni.showToast({
					title:result.msg,
					icon:'none'
				})
        setTimeout(()=>{
          uni.navigateBack()
        },1500)
			}).catch(res=>{
				uni.showToast({
					title:'请求超时，请检查网络',
					icon:'none'
				})
			})
		},
		methods:{
			changePassword(obj) {
				this[obj] = !this[obj];
			},
		}
	}
</script>

<style>

</style>
