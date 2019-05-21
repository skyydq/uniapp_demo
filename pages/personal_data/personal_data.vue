<template>
	<view class="page-wrap" :class="{'active':isLogin}">
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate">
					<view>登录账号：</view>
					<view>{{member.account?member.account:""}}</view>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate">
					<view>真实姓名：</view>
					<view>{{member.name?member.name:''}}</view>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate">
					<view>身份证号：</view>
					<view>{{member.idNumber?member.idNumber:''}}</view>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate">
					<view>注册手机：</view>
					<view>{{member.telephone?member.telephone:""}}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-last">
				<view class="uni-list-cell-navigate">
					<view>推荐人账号：</view>
					<view>{{member.parentAccount?member.parentAccount:""}}</view>
				</view>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate ">
					<view class="status ">
						<view>账号状态：</view>
						<view class="text" :class="memberStatus[member.isActivate?member.isActivate:0].className">
							{{memberStatus[member.isActivate?member.isActivate:0].text}}
						</view>
					</view>
					<view class="btn" v-if="member.isActivate=='0'||(!member.isActivate)">
						<button type="primary" class="uni-primary" size="mini" @tap="activation">激活账号</button>
					</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-last">
				<view class="uni-list-cell-navigate">
					<view class="status">
						<view>预付进场：</view>
						<view class="text" :class="prepayStatus[member.isPrepay?member.isPrepay:0].className">
							{{prepayStatus[member.isPrepay?member.isPrepay:0].text}}
						</view>
					</view>
					<view class="btn" v-if="member.isPrepay==0&&member.isActivate==1||member.isPrepay==1">
						<button type="primary" v-if="member.isPrepay==0&&member.isActivate==1" class="uni-primary" size="mini" @tap="navigator('/pages/processing/advance')">预付进场</button>
						<button type="primary" v-else-if="member.isPrepay==1" class="uni-primary" size="mini" @tap="leaveApply">申请离场</button>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate uni-navigate-right" @tap="navigator('/pages/personal_data/bank/bank')">
					<view>银行账号：</view>
					<view>{{member.bankNumber?member.bankNumber:''}}</view>
				</view>
			</view>
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate uni-navigate-right" @tap="navigator('alipay')">
					<view>支付宝账号：</view>
					<view>{{member.alipayAccount?member.alipayAccount:""}}</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-last">
				<view class="uni-list-cell-navigate uni-navigate-right" @tap="navigator('wechat')">
					<view>微信账号：</view>
					<view>{{member.wechatAccount?member.wechatAccount:""}}</view>
				</view>
			</view>
		</view>
		<view class="uni-list">
			<view class="uni-list-cell">
				<view class="uni-list-cell-navigate uni-navigate-right" @tap="navigator('/pages/personal_data/password/login?target=loging')">
					<view>修改登录密码：</view>
					<view class="primary">已设置</view>
				</view>
			</view>
			<view class="uni-list-cell uni-list-cell-last">
				<view class="uni-list-cell-navigate uni-navigate-right" @tap="navigator('/pages/personal_data/password/tranisiton')">
					<block v-if="!member.payPassword">
            <view>设置交易密码：</view>
            <view class="warn">未设置</view>
          </block>
          <block v-else>
            <view>修改交易密码：</view>
            <view class="primary">已设置</view>
          </block>
					
				</view>
			</view>
		</view>
    <sbanner ref="sbannerInfo" :disabled="isSending" @submit="resetInfo"></sbanner>
    <sbannerPsw ref="sbannerPsw" :disabled="isSending" @submit="toleaveApply"></sbannerPsw>
	</view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
  import sbanner from '@/components/sbanner-reset'
  import sbannerPsw from '@/components/sbanner'
	import {leaveApply,updateActivate,userResetCheck,userResetPayPasswordCheck} from '@/common/getData'
  import graceChecker from '@/common/graceChecker.js'

	export default {
    components:{
      sbanner,sbannerPsw
    },
		data() {
			return {
        isSending:false
			};
		},
		computed: {
			...mapState('module_0', ['isLogin', 'member','prepayStatus','memberStatus'])
		},
    onNavigationBarButtonTap(e){
      if(e.index==0){
        userResetCheck().then(res=>{
          let result=res.data
          if(result.code=='1'){
            this.$refs.sbannerInfo.bannerShow=true;
          }else{
            uni.showToast({
            	title:result.msg,
              icon:'none'
            })
          }
        })
      }
    },
		methods: {
			...mapActions('module_0', ['changemember','changeUserReset']),
      resetInfo(data){
        this.isSending = true;
        if (!this.checkValue(data)) {
          this.isSending = false;
          return false
        }
        userResetPayPasswordCheck({payPassword:data.psw}).then(res2=>{
          let result2=res2.data;
          if(result2.code=='1'){
            this.changeUserReset(true)
            uni.navigateTo({
            	url:'/pages/userReset/userReset',
              complete:()=>{
                this.$refs.sbannerInfo.bannerShow=false;
                this.isSending=false;
              }
            })
          }else{
            this.isSending=false;
            uni.showToast({
            	title:result2.msg,
              icon:'none'
            })
          }
        }).catch(()=>{
          this.isSending=false;
          uni.showToast({
            title: '请求超时，请检查网络',
            icon: 'none'
          });
        })
      },
      checkValue(data) {
        let rule = [{
            name: "psw",
            checkType: "reg",
            checkRule: "^[a-zA-Z0-9]{6,20}$",
            errorMsg: "请输入正确格式的交易密码"
          }],
          checkRes = graceChecker.check(data, rule);
        if (!checkRes) {
          uni.showToast({
            title: graceChecker.error,
            icon: 'none'
          })
          return false;
        }
        return true;
      },
			navigator(path) {
				let url = ~path.indexOf('pages') ? path : `alipay/alipay?target=${path}`;
				uni.navigateTo({
					url
				})
			},
			activation() {
        uni.showModal({
          content:'确定消耗一个激活码进行激活？',
          confirmColor:'#E5BC2D',
          success:(e=>{
            if(e.confirm){
              updateActivate({id:this.member.id}).then(res=>{
                let result=res.data;
                if(result.code=='1'){
                  this.changemember({isActivate:"1"});
                }else{
                  setTimeout(()=>{
                    uni.navigateTo({
                      url: '/pages/activation/activation'
                    })
                  },1500)
                }
                uni.showToast({
                	title: result.msg,
                	icon: 'none'
                });
              })
            }
          })
        })
				
			},
			leaveApply(){
				uni.showModal({
					content:'您确定要申请离场吗？',
					confirmColor:'#E5BC2D',
					success:e=>{
						if(e.confirm){
              this.$refs.sbannerPsw.bannerShow=true;
						}
					}	
				})
			},
      toleaveApply(data){
        this.isSending=true;
        if (!this.checkValue(data)) {
          this.isSending = false;
          return false
        }
        if(data.psw){
          leaveApply({
           payPassword:data.psw
          }).then(res=>{
            let result=res.data;
            uni.showToast({
            	title:result.msg,
            	icon:'none'
            })
            this.isSending=false;
            if(result.code==='1'){
            	this.changemember({isPrepay:"2"})
              this.$refs.sbannerPsw.bannerShow=false;
            }
          }).catch(error=>{
            this.isSending=false;
            uni.showToast({
              title: '请求超时，请检查网络',
              icon: 'none'
            });
          })
        }
      }
    }
	}
</script>

<style lang="less">
  page{
    background-color: #1A1A24;
  }
  .page-wrap{
    padding-bottom: 180upx;
  }
	.uni-list {
    color: #fff;
    background-color: #21212b;
    margin-top: 20upx;
		.status {
			display: flex;
			flex: 1;
			justify-content: space-between;
		}

		.btn {
			line-height: 1;
			width: 50%;
			flex: none;
			text-align: right;
		}
	}

	.uni-navigate-right {
		padding-right: 60upx;
	}
</style>
