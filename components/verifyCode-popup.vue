<template>
   <view class="sbanner">
      <view class="uni-banner" style="background:#FFFFFF;" v-if="bannerShow">
        <view class="uni-card-content-inner">
          <view class="uni-form-item  verify">
              <input class="uni-input" placeholder="验证码" v-model="checkCode" />
              <image :src="verifyImg"  mode="aspectFit" @tap="getVerify"></image>
          </view>
          <view class="btn-box"><button type="primary" @tap="submit">提交</button></view>
        </view>
      </view>
      <view class="uni-mask" v-if="bannerShow"></view>
    </view>
</template>

<script>
  import { baseUrl } from '@/common/until.js'
  import {valitCheckCode} from '@/common/getData'
	export default {
		data() {
			return {
        bannerShow: false,
        verifyImg:'',
				checkCode:'',
        uuid:''
			};
		},
    mounted() {
      this.getVerify();
    },
    methods:{
      closeBanner() {
        this.bannerShow = false;
      },
      showBanner() {
        this.bannerShow = true;
      },
      submit(){
        valitCheckCode({
          uuid:this.uuid,
          checkCode:this.checkCode
        }).then(res=>{
          let result=res.data;
          if(result.code==='1'){
            this.closeBanner();
            this.$emit('clearVerify')
          }else{
            uni.showToast({
            	title:result.msg,
              icon:'none'
            })
          }
        })
      },
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
.verify{
    margin-bottom: 30upx;
    padding-bottom: 0;
    image{
     height:70upx;
     width: 200upx;;
    }
    position: relative;
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
.sbanner {
  position: relative;
  z-index: 99;
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
  button{
    line-height: 80upx;
  }
}

</style>
