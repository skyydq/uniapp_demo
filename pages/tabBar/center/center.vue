<template>
	<view class="center">
		<view class="main">
			<view class="header">
        <!-- #ifdef APP-PLUS-->
         <view class="status_bar "></view>
        <!-- #endif-->
				<view class="uni-list-cell">
					<view class="uni-list-cell-navigate" >
						<view class="change" >
              <text  @tap="quit">
                退出
              </text>
             <text @tap="navigate('/pages/personal_data/personal_data')">
               编辑
             </text>
            </view>
            <view class="list-logo">
							<image src="/static/person_icon_head.png" mode="aspectFit"></image>
						</view>
						<view class="list-body">
							<view class="uni-media-list-text-top name">
								{{member.account}}
							</view>
							<view class="uni-media-list-text-bottom uni-ellipsis">
								{{member.telephone}}
							</view>
							<view class="tag-box">
								<uni-tag :type="memberStatus[member.isActivate?member.isActivate:0].className" className="tag member" :text="memberStatus[member.isActivate?member.isActivate:0].text" size="small"></uni-tag>
								<uni-tag :type="prepayStatus[member.isPrepay?member.isPrepay:0].className" className="tag prepay" :text="prepayStatus[member.isPrepay?member.isPrepay:0].text" size="small"></uni-tag>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="quota">
				<view class="quota-list" @tap="navigate('/pages/wallet/wallet?target=static')">
					<view class="num num1">{{amount2?amount2:'0'}}</view>
					<view class="text">静态钱包</view>
				</view>
				<view class="quota-line"></view>
				<view class="quota-list" @tap="navigate('/pages/wallet/wallet_acitity')">
					<view class="num num2">{{amount4?amount4:'0'}}</view>
					<view class="text">动态钱包</view>
				</view>
				<view class="quota-line"></view>
				<view class="quota-list" @tap="navigate('/pages/wallet/wallet?target=promotion')">
					<view class="num num3">{{amount3?amount3:'0'}}</view>
					<view class="text">抢单钱包</view>
				</view>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell" hover-class="uni-list-cell-hover">
					<view class="uni-list-cell-navigate uni-navigate-right" @tap="navigate('/pages/manager/manager?account='+member.account)">
						<view class="icon">
                <image src="/static/person_icon_team.png"></image>
						</view>
						<view class="text">团队管理</view>
					</view>
				</view>
				<view class="uni-list-cell" hover-class="uni-list-cell-hover" @tap="navigate('/pages/spread/spread')">
					<view class="uni-list-cell-navigate uni-navigate-right">
						<view class="icon">
						    <image src="/static/person_icon_extension.png"></image>
						</view>
						<view class="text">网址推广</view>
					</view>
				</view>
				<view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover" @tap="navigate('/pages/feedback/feedback')">
					<view class="uni-list-cell-navigate uni-navigate-right">
						<view class="icon">
						    <image src="/static/person_icon_doubt.png"></image>
						</view>
						<view class="text">问题反馈</view>
					</view>
				</view>
        <view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover" @tap="checkVersion">
        	<view class="uni-list-cell-navigate uni-navigate-right">
        		<view class="icon">
        		    <image src="/static/update.png"></image>
        		</view>
        		<view class="text justspb">
              <text>检查更新</text>
              <text>{{version}}</text>
            </view>
        	</view>
        </view>
      </view>
		</view>
    <update :version="newversion" :versionDesc="versionDesc" ref="updateBanner" :percent="percent" @cancel="cancel" @submit="toUpdate"></update>
	</view>
</template>

<script>
	import {
		mapState,
		mapActions
	} from 'vuex'
	import uniTag from '@/components/uni-tag.vue'
  import update from '@/components/update.vue'
	import {getMemberInfo,walletOverage,wallet,getCurrUserInfo,getVersion} from '@/common/getData.js'
  let downLoadUrl,downloadTask,downloading=false;
	export default {
    components: {
    	uniTag,update
    },
		data() {
			return {
				amount2:'--',
        amount3:'--',
        amount4:'--',
        version:'',
        newversion:'',
        versionDesc:"",
        percent:''
			};
		},
		computed: {
			...mapState('module_0', ['member','memberStatus','prepayStatus'])
		},
    mounted(){
      // #ifdef APP-PLUS
      this.version = plus.runtime.version;
      // #endif
    },
		onShow(){
			wallet().then(res=>{
				let result=res.data;
				if(result.code==='1'){
          result.data.forEach((item)=>{
            switch (item.walletType){
            	case '2':
                this.amount2=item.amount;
            		break;
              case '3':
                this.amount3=item.amount;
              	break;
              case '4':
                this.amount4=item.amount;
              	break;
            	default:
            		break;
            }
          })
					this.walletAmount=result.data
				}
			})
      getCurrUserInfo().then(res => {
        let result = res.data;
        if (result.code == '1') {
          this.changemember(result.data);
        } else {
          uni.reLaunch({
            url: '/pages/login/index'
          });
        }
      }).catch(error => {
        uni.reLaunch({
          url: '/pages/login/index'
        });
      });
            
    },
		methods: {
			...mapActions('module_0', ['logOut','logOn','changemember']),
			quit() {
				this.logOut();
				setTimeout(() => {
					uni.reLaunch({
						url: "/pages/login/index"
					})
				}, 500)
			},
			navigate(path) {
				uni.navigateTo({
					url: path
				})
			},
      checkVersion(){
        let type=null;
        // #ifdef APP-PLUS
           type=uni.getSystemInfoSync().platform.toLocaleLowerCase().indexOf('ios')>-1?'3':'2';
        // #endif
        // #ifdef H5
           type=1;
        // #endif
        this.percent=0;
        getVersion({
          type
        }).then(res=>{
          let result=res.data;
          if(result.code==1){
            if(result.data.versionLevel-this.version.replace(/\./g,'')>0){
              if(type==2){
                downLoadUrl=result.data.downloadUrl;
                this.newversion=result.data.versionCode;
                this.versionDesc=result.data.versionDesc;
                this.$refs.updateBanner.bannerShow=true;
              }else{
                uni.showToast({
                	title:'有新版本发布，请更新'
                })
              }
            }else{
              uni.showToast({
              	title:'已是最新版本'
              })
            }
          }
        })
      },
      toUpdate(){
        if(!downloading){
          downloading=true;
          downloadTask = uni.downloadFile({
            url: downLoadUrl,
            success: (res) => {
              if (res.statusCode === 200) {
                uni.saveFile({
                  tempFilePath: res.tempFilePath,
                  success: function (res) {
                    console.log(res.savedFilePath)
                    plus.runtime.install(res.savedFilePath);
                  }
                });
              } else {
                uni.showToast({
                  title: '下载出错',
                  icon: 'none'
                })
              }
              downloading=false
            },
            fail:(error)=>{
              uni.showToast({
                title: '下载出错',
                icon: 'none'
              })
              downloading=false
            }
          });
          downloadTask.onProgressUpdate((res) => {
            if (res.progress <= 100) {
              if( res.progress<=0){
                this.percent=1
              }else{
                this.percent = res.progress;
              }
            }
          });
        }
      },
      cancel(){
        if(downloadTask){
          downloading=false
          downloadTask.abort();
        }
      }
      
		}
	}
</script>

<style lang="less">
	page {
		height: 100%;
    background-color: #1A1A24;
	}

	.center {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.header {
		background: url(../../../static/img5.jpg) no-repeat 0 0;
    background-size: cover;
    border-radius: 10upx;
    padding-bottom: 96upx;
    .change{
      display: flex;
      
      justify-content: space-between;
      font-size: 30upx;
      width: 100%;
      color: #fff;
      text-align: right;
      line-height: 1;
      margin-bottom: -10upx;
    }
    .uni-list-cell-navigate{
      flex-direction: column;
      
    }
    .list-body {
    	display: flex;
    	width: 100%;
    	flex-direction: column;
      text-align: center;
    	justify-content: space-between;
    	.name {
        font-size: 36upx;
        color: #FFFFFF;
        margin:16upx 0 ;
    	}
      .uni-media-list-text-bottom{
        margin: 10upx 0 0; 
        color: #FFFFFF;
        opacity: 0.4;
      }
    	.tag-box {
        line-height: 1;
        margin-top: 16upx;
          
    	}
    }
		.uni-list-cell {
			&:after {
				content: none;
			}
		}
	}

	.list-logo {
		width: 140upx;
		height: 140upx;
    
		image {
			display: block;
			width: 100%;
			height: 100%;
		}
	}

	

	.quota {
		display: flex;
		align-items: center;
		padding: 52upx 0;
    margin:-96upx 20upx 0;
    background: #21212B;
    border-radius: 10upx;
		.quota-line {
			display: block;
			height: 50upx;
			width: 1px;
			transform: scaleX(0.5);
			opacity: 0.1;
      border: 1px solid #979797;
		}

		.quota-list {
			width: 33.33%;
			text-align: center;
			position: relative;
      .text{
        line-height: 1;
        color: #fff;
        margin-top: 18upx;
      }
			.num {
				color: orange;
        line-height: 1;
        font-size: 38upx;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent; 
        &.num1{
           background-image: -webkit-linear-gradient(90deg, #F4DF58,#E5BC2D);
        }
        &.num2{
           background-image: -webkit-linear-gradient(90deg, #F8B071,#ED783E);
        }
        &.num3{
           background-image: -webkit-linear-gradient(90deg, #A288F0,#6950DC );
        }
			}

		}
	}

	.uni-list {
		margin-top: 20upx;
    background: #21212B;
    color: #fff;
    .uni-list-cell::after{
      opacity: 0.09;
      background: #979797;
    }
    .uni-list-cell-navigate{
      padding: 36upx;
    }
		&:before,
		&:after {
			content: none;
		}
		.icon {
			width: 40upx;
			height: 40upx;
			image{
        width: 100%;
        height: 100%;
      }
		}

		.text {
			width: 100%;
			margin-left: 20upx;
		}
	}

	.btn-bottom {
		position: relative;
    background-color: #1a1a24;
	}
  .justspb{
    display: flex;
    padding-right: 40upx;
    align-items: center;
    justify-content: space-between;
  }
</style>
