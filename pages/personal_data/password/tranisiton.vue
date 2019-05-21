<template>
	<view class="uni-padding-wrap">
    <view class="uni-card uni-form-item uni-column " v-if="member.payPassword">
    	<view class="uni-card-content">
    		<view class="with-fun">
    			<input class="uni-input"  v-model="oldPayPassword" :password="!old_showPassword"  placeholder="旧密码" />
    			<view class="uni-icon uni-icon-eye" :class="[old_showPassword ? 'uni-active' : '']" @click="changePassword('old_showPassword')"></view>
    		</view>
    	</view>
    </view>
		<view class="uni-card uni-form-item uni-column ">
			<view class="uni-card-content">
				<view class="with-fun">
					<input class="uni-input"  v-model="password" :password="!showPassword"  placeholder="交易密码（6-20字母数字组合）" />
					<view class="uni-icon uni-icon-eye" :class="[showPassword ? 'uni-active' : '']" @click="changePassword('showPassword')"></view>
				</view>
			</view>
		</view>
		<view class="uni-card uni-form-item uni-column ">
			<view class="uni-card-content">
				<view class="with-fun">
					<input class="uni-input" v-model="password_" :password="!showPassword_" placeholder="确认密码（6-20字母数字组合）"  />
					<view class="uni-icon uni-icon-eye" :class="[showPassword_ ? 'uni-active' : '']" @click="changePassword('showPassword_')"></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import {updatePayPassWd} from '@/common/getData.js'
	import graceChecker from '@/common/graceChecker.js'
	export default {
		data() {
			return {
        oldPayPassword:'',
				password:'',
				password_:'',
        old_showPassword:false,
				showPassword:false,
				showPassword_:false,
			};
		},
    onLoad(){
      let title="设置交易密码"
      if(this.member.payPassword){
        title="修改交易密码"
      }
      uni.setNavigationBarTitle({
      	title
      });
    },
    computed: {
    	...mapState('module_0', ['member'])
    },
		onNavigationBarButtonTap(e) {
			let rule = [
				{name: "payPassword",checkType: "reg",checkRule: "^[a-zA-Z0-9]{6,20}$",errorMsg: `请输入新密码（6~20位字母数字组合）`},
				{name: "payPassword_",checkType: "same",checkRule: this.password,errorMsg: `请确认密码与新密码保持一致`}],
				data={
					payPassword:this.password
				};
				
      if(this.member.payPassword){
          rule.push({name: "oldPayPassword",checkType: "reg",checkRule: "^[a-zA-Z0-9]{6,20}$",errorMsg: `请输入密码（6~20位字母数字组合）`})
          data=Object.assign({
            oldPayPassword:this.oldPayPassword
          },data);
      }
      let dat=Object.assign({
        	payPassword_:this.password_
        },data);
       console.log(dat)
      let checkRes = graceChecker.check(dat, rule);
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
			updatePayPassWd(data).then(res=>{
				let result=res.data;
        uni.showToast({
        	title:result.msg,
        	icon:'none'
        })
				if(result.code==1){
					setTimeout(()=>{
						uni.navigateBack();
            this.changemember(data);
					},1500)
				}
				
			}).catch(res=>{
				uni.showToast({
					title:'请求超时，请检查网络',
					icon:'none'
				})
			})
		},
		methods:{
			...mapActions('module_0', ['changemember']),
			changePassword(obj) {
				this[obj] = !this[obj];
			},
		}
	}
</script>

<style>

</style>
