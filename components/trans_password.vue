<template>
	<view class="uni-card">
		<view class="uni-card-content-inner">
			<view class="uni-form-item uni-column">
			  <view class="with-fun">
			    <input class="uni-input":class="className" :placeholder="placeholder" v-model="password" :password="!showPassword" />
			    <view class="uni-icon uni-icon-eye" :class="[showPassword ? 'uni-active' : '']" @click="changePassword"></view>
			  </view>  
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				password:'',
				showPassword:false,
			};
		},
     props:{
      className:{
        type:String,
        default:''
      },
      placeholder:{
        type:String,
        default:'请输入密码'
      },
    },
		methods:{
			changePassword() {
				this.showPassword = !this.showPassword;
			},
		}
	}
</script>

<style lang="less" scoped="">
	.uni-form-item .with-fun .uni-icon{text-align: right;}
	.uni-card-content-inner{padding: 0 30upx;}
	.uni-form-item{padding: 15upx 0;}
	.with-fun {
		position: relative;
    .inputPd0{
      padding-left: 0
    }
		&:after {
			content: '';
			display: block;
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 1px;
			background-color: #ccc;
			transform: scaleY(0.5);
		}
	}
</style>
