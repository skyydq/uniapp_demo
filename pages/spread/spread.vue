<template>
	<view class="uni-padding-wrap" sytle="backg">
		<view class="tip">浏览器/微信/支付宝扫一扫注册</view>
		<view class="qrcode-box">
			<tki-qrcode :val="qrval" :size="qrsize"  ref="qrcode1"></tki-qrcode>
		</view>
		<button type="primary" @tap="copy">复制链接发送给好友</button>
	</view>
</template>
<script>
	import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue'
	import {mapState} from 'vuex'
	import {copy} from '@/common/until'
	export default {
		components:{
			tkiQrcode
		},
		data(){
			return {
				qrval:'',
				qrsize:200,
			}
		},
		computed:{
			...mapState('module_0',['member'])
		},
		mounted(){
      //#ifdef H5
      this.qrval=window.location.href.split('#')[0]+'#/pages/register/register?redirect=register&pt='+this.member.account;
      //#endif
      //#ifndef H5
      this.qrval="http://www.jdscmall.com/#/pages/register/register?redirect=register&pt="+this.member.account;
      //#endif
      uni.request({
      	url:"https://dwz.cn/admin/v2/create",
        method:'POST',
        header:{
          Token:"fc3ead818899b38cd98214be57c51112"
        },
        data:{
          url:this.qrval
        },
        success:res=>{
          let result=res.data;
          if(result.Code==0){
            this.qrval=result.ShortUrl;
             setTimeout(()=>{
            	this.$refs.qrcode1._makeCode()
            },50)
          }else{
             setTimeout(()=>{
            	this.$refs.qrcode1._makeCode()
            },50)
          }
        },
        fail:()=>{
          setTimeout(()=>{
          	this.$refs.qrcode1._makeCode()
          },50)
        }
      })
			
			
		},
		methods:{
			copy(){
        // #ifdef H5
        copy(this.qrval)
        // #endif
        // #ifndef H5
        uni.setClipboardData({
            data: this.qrval,
            success: ()=>{
                uni.showToast({
                	title:'复制成功',
                  icon:'none'
                })
            }
        });
        // #endif
			}
		}
	}
</script>

<style lang="less">
page,.uni-padding-wrap{
	height: 100%;
}
.uni-padding-wrap{
  color: #000;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: #f2f2f2;
  .tip{
    font-size: 28upx;
  }
	.qrcode-box{
		margin-top: 20upx;
		margin-bottom: 80upx;
		width: 400upx;
		height: 400upx;
	}
	button{
		line-height: 80upx;
		font-size: 32upx;
	}
}

</style>
