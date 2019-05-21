<template>
		<view class="uni-form-item uni-column ">
		  <view class="with-fun verify with-border">
        <image class="icon" src="/static/sign_icon_code.png" mode="aspectFill"></image>
		  	<input class="uni-input" placeholder="验证码" v-model="checkCode" />
		  	<image class="verifyImg" :src="verifyImg"  mode="aspectFit" @tap="getVerify"></image>
		  </view>
		</view>
</template>

<script>
  import { baseUrl } from '@/common/until.js'
	export default {
		data() {
			return {
        verifyImg:'',
				checkCode:'',
        uuid:''
			};
		},
    mounted() {
      this.getVerify();
    },
    methods:{
      getVerify(){
         this.uuid=this.guid();
         this.verifyImg=baseUrl+"/web/common/checkCode?uuid="+this.uuid;
       },
       guid() {
         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
           var md= Math.random() * 16;
           var r =md | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
           return v.toString(16);
         });
      }
    }
	}
</script>

<style lang="less" scoped="">
.uni-form-item{
     .with-fun{
      background-color: transparent;
     }
     .uni-input{
       color: #fff;
       padding-left: 20upx;
       background-color: transparent;
     }
}
.verify{
  margin-bottom: 30upx;
  .verifyImg{
    width:240upx;height:60upx;
    background-color: #fff;
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
    bottom: 0;
    background:#E4E4E4;
  }
  .icon{
    width: 48upx;
    height: 48upx;
    display: block;
  }
  
  
	.uni-icon{
		position: relative;
		z-index: 90;
	}
}
</style>
