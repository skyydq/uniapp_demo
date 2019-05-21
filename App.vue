<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import {
		getMemberInfo,
		getCurrUserInfo
	} from '@/common/getData.js'
	export default {
		onLaunch() {
      // #ifdef H5
      this.routePush();
      // #endif
      uni.onNetworkStatusChange(res=>{
        if(!res.isConnected){
          uni.showToast({
          	title:"当前状态未联网，请检查网络",
            icon:'none',
            duration:2000
          })
        }
      })
    },
		methods: {
			...mapActions('module_0', ['logOn']),
      //#ifdef H5
      routePush(){
        let token = uni.getStorageSync('token');
        if(location.hash.indexOf('redirect')>0){
          uni.reLaunch({
            url: location.hash.slice(1)
          })
        }else{
          if(token){
            getCurrUserInfo().then(res => {
              let result = res.data;
              if (result.code == '1') {
                this.logOn({
                  member: result.data,
                  token
                });
              } else {
                uni.reLaunch({
                  url: "/pages/login/index"
                })
              }
            }).catch(error => {
              uni.reLaunch({
                url: "/pages/login/index"
              })
            })
          }else if(location.hash.indexOf('register')>0){
            uni.reLaunch({
              url: "/pages/register/register"
            })
          }else if(location.hash.indexOf('login')<0){
            uni.reLaunch({
              url: "/pages/login/index"
            })
          }
        }
        
      }
      //#endif
		}
	}
</script>

<style lang="less">
	@import './common/uni.css';
	@import './common/iconfont.css';
  .status_bar{
    height: var(--status-bar-height);
    width: 100%;
  }
	page {
		background-color: #1A1A24;
	}

	.page-wrap {
		opacity: 0;

		&.active {
			opacity: 1
		}
	}

	.page-cen {
		padding: 0 30upx;
	}

	.primary {
		color: #DFBA3C !important;
	}

	.process {
		color: #E5BC2D !important;
	}

	.warn {
		color: #D95353 !important;
	}
	.default{
		color: #999;
	}
	.column-content {
		height: 100%;
		box-sizing: border-box;
		padding: 20upx;
		display: flex;
		flex-direction: column;
		justify-content: top;
	}
  .uni-mask{
    background-color: rgba(0,0,0,0.6) !important;
  }
  .uni-icon{
    color: #71746a;
  }
	uni-toast {
		position: relative;
		z-index: 999;
	}
  .uni-page-head-transparent .uni-page-head-btn{
    background: none;
  }
  .uni-page-head__title{
    opacity: 1 !important;
  }
  uni-radio .uni-radio-input,uni-checkbox .uni-checkbox-input{background-color: transparent; }
	uni-toast .uni-simple-toast__text {
		padding: 10px;
		line-height: 1;
	}
	uni-page-head .uni-page-head__title{font-weight: normal;}
	.button-hover[type=primary] {
		color: hsla(0, 0, 100%, .6)  !important;
		background-color: #DFBA3C !important;
	}
  button{border-radius: 4upx;}
	button[loading][type=primary][plain] {
		color: #DFBA3C  !important;
	}

	button[type=primary][plain] {
		color: #DFBA3C !important;
		border-color: #DFBA3C;
	}
  button[type=warn]{
    background-color: #D95353;  
  }
  button[type=warn][plain] {
		color: #D95353 !important;
		border-color: #D95353;
	}
	button[disabled][type=primary]{
		background-color: #DFBA3C;
	}
  .button-hover[type=primary][plain]{
    color: #fff !important;
    border: none;
  }
	button[type=primary] {
    color: #fff !important;
		background-color: #DFBA3C ;
	}
  button:after{
      border-radius: 4upx;
  }
	.uni-radio-input-checked {
		border-color: #DFBA3C !important;
		background: none !important;
	}

	.uni-icon.uni-active {
		color: #DFBA3C;
	}
  .uni-tag.tag.uni-tag-warn{background-color: #D95353 ;color: #fff;}
	uni-radio .uni-radio-input.uni-radio-input-checked:before {
		content: '';
		display: block;
		background-color: #DFBA3C;
		border-radius: 50%;
		width: 100%;
		height: 100%;
		transform: translate(-50%, -48%) scale(0.5);
	}
  .uni-list-cell-hover{background-color:#1A1A24;}
	.uni-badge-primary{background-color: #DFBA3C;}
	.with-border {
		position: relative;

		.uni-input {
			height: 60upx;
			line-height: 60upx;
      position: relative;
      background-color: transparent;
      z-index: 20;
		}

		&:after {
			content: " ";
			width: 200%;
			height: 200%;
			position: absolute;
			top: 0;
			left: 0;
			border: 1px solid rgba(0, 0, 0, .2);
			-webkit-transform: scale(.5);
			transform: scale(.5);
			-webkit-transform-origin: 0 0;
			transform-origin: 0 0;
			box-sizing: border-box;
			border-radius: 10px;
		}
	}

	.data-none {
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		align-items: center;
		justify-content: center;
	}
	.wrap-btn-bottom-padding{
		padding-bottom: 120upx;
	}
	.btn-bottom{
	  position: absolute;
    padding: 20upx 40upx;
	  background:#1a1a24;
	  bottom: 0;
	  left: 0;
    right: 0;
    z-index: 90;
	  button{
	    font-size: 32upx;
	  }
	}
	.nodata.uni-list-cell-navigate{
		justify-content: center;
	}
	.loading{
		height: 100upx;
		display: flex;
		align-items: center;
		justify-content: center;
		.uni-icon-spinner{
			 transform-origin:50%; 
			 animation: load 1.56s linear infinite ;
		}
	}
	view{font-size: 32upx;}
	@keyframes load {
		0% {
			transform: rotate(0)
		}

		100% {
			transform: rotate(360deg)
		}
	}

	/*每个页面公共css */
</style>
