<template>
  <view class="content">
    <scroll-view scroll-y="true">
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view>登录账号：</view>
            <view>{{childrenDetailInfo.account}}</view>
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view>真实姓名：</view>
            <view>{{childrenDetailInfo.name}}</view>
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view>身份证号：</view>
            <view>{{childrenDetailInfo.idNumber}}</view>
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view>注册手机：</view>
            <view>{{childrenDetailInfo.telephone}}</view>
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view>推荐人账号：</view>
            <view>{{childrenDetailInfo.parentAccount}}</view>
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view>推荐人手机：</view>
            <view>{{childrenDetailInfo.parentTelephone}}</view> <!-- TODO -->
          </view>
        </view>
      </view>
      <view class="uni-list">
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view class="status">
              <view>账号状态：</view>
              <view class="text"  :class="memberStatus[childrenDetailInfo.isActivate?childrenDetailInfo.isActivate:0].className">{{memberStatus[childrenDetailInfo.isActivate?childrenDetailInfo.isActivate:0].text}}</view>
            </view>
            <view class="btn" v-if="childrenDetailInfo.isActivate=='0'" >
              <button type="primary" class="uni-primary" size="mini" @tap="memberActivate">
                直接激活
              </button>
            </view>
            <view class="btn" v-if="childrenDetailInfo.isActivate=='2'&&member.parentId=='0'" >
              <button type="primary" class="uni-primary" size="mini" @tap="memberThaw">
                解冻申请
              </button>
            </view>
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view class="status">
              <view>预付进场：</view>
              <!-- {{prepayStatus}} -->
              <view class="text" :class="prepayStatus[childrenDetailInfo.isPrepay?childrenDetailInfo.isPrepay:0].className" >{{prepayStatus[childrenDetailInfo.isPrepay?childrenDetailInfo.isPrepay:0].text}}</view>
            </view>
            <!-- <view class="btn">
              <button type="primary" class="uni-primary" size="mini">
                快速进场
              </button>
            </view> -->
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view class="status">
              <view>可用激活码个数：</view>
              <view class="text warn">{{childrenDetailInfo.acitvateCodeCount}}</view>
            </view>
            <view class="btn">
              <button type="primary" class="uni-primary" size="mini" @tap="activation">
                直接转发
              </button>
            </view>
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view class="status">
              <view>可用排单币个数：</view>
              <view class="text warn">{{childrenDetailInfo.quequCoinCount}}</view>
            </view>
            <view class="btn">
              <button type="primary" class="uni-primary" size="mini" @tap="queueCoin"> <!-- TODO -->
                直接转发
              </button>
            </view>
          </view>
        </view>
        <view class="uni-list-cell">
          <view class="uni-list-cell-navigate">
            <view class="status">
              <view>团队人数：</view>
              <view class="text">{{childrenDetailInfo.childCount}}</view><!-- TODO -->
            </view>
            <view class="btn">
              <button type="primary" class="uni-primary" size="mini" @tap="manager"> <!-- TODO -->
                查看团队
              </button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
    <view class="btn-bottom">
      <button type="primary" @tap="navigateTo('../register/register?parentAccount='+childrenDetailInfo.account+'&parentId='+childrenDetailInfo.id)">协助注册直推会员</button>
    </view>
		<sbanner ref="sbannerActivation" :showNum="true" :ableNum="member.acitvateCodeCount" :disabled="isSending" :num="activationNumber" @submit="toActivation">
			 <input class="uni-input" type="text" v-model="activationNumber" placeholder="输入激活码个数">
		</sbanner>
		<sbanner ref="sbannerQueueCoin" :showNum="true" :ableNum="member.quequCoinCount" :disabled="isSending" :num="queueCoinNumber" @submit="toQueueCoin">
			 <input class="uni-input" type="text" v-model="queueCoinNumber" placeholder="输入排单币个数">
		</sbanner>
    <sbannerNum ref="sbannerThaw" :disabled="isSending"  @submit="toThaw">
       <input class="uni-input" type="text" v-model="thawCount" placeholder="输入收到罚款金额">
    </sbannerNum>
  </view>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import sbanner from '@/components/sbanner'
  import sbannerNum from '@/components/sbanner-number'
	import graceChecker from '@/common/graceChecker.js'
	import {activeTeamMember,queryUserById,activateCodeForward,queueCoinForward,activeApply} from '@/common/getData'
	export default {
		components: {
			sbanner,sbannerNum
		},
		data(){
			return{
				activationNumber:'',
				queueCoinNumber:'',
				isSending:false,
        childrenDetailInfo:{},
        id:'',
        thawCount:'' // 罚款金额
			}
		},
    onLoad(e){
      this.id=e.id;
      this.getData()
    },
		computed:{
		  ...mapState('module_0', ['prepayStatus','member','memberStatus'])
		},
		methods:{
			...mapActions('module_0',['changemember']),
      getData(){
        uni.showLoading()
        queryUserById({id:this.id}).then(res=>{
          let result=res.data;
          if(result.code==='1'){
            this.childrenDetailInfo=result.data
            uni.hideLoading()
          }else{
            uni.showToast({
            	title:result.msg,
              icon:'none'
            })
          }
        }).catch(()=>{
          uni.showToast({
            title:'网络出错',
            icon:'none'
          })
        })
      },
			navigateTo(path){
			  uni.navigateTo({
			  	url:path
			  })
			},
			beforeConfirm(text,callback){
				uni.showModal({
					content:text,
					confirmColor:"#E5BC2D",
					success:e=>{
						if(e.confirm){
							callback()
						}
					}
				})
			},
			checkValue(data){
				let rule = [{
							name: "num",
							checkType: "int",
							checkRule: "0,6",
							errorMsg: "请输入正确的激活码个数"
					},{
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
			toActivation(data){
				this.isSending=true;
				if(!this.checkValue(data)){
					this.isSending=false;
					return false
				}
				activateCodeForward({
					applyId:this.childrenDetailInfo.id,
					buyNumber:data.num,
					payPassword:data.psw
				}).then(res=>{
					let result=res.data;
					if(result.code==='1'){
						let num=Number(this.childrenDetailInfo.acitvateCodeCount);
            // this.getData();
            this.$set(this.childrenDetailInfo,'acitvateCodeCount',num+Number(data.num));
            this.changemember({
              'acitvateCodeCount':this.member.acitvateCodeCount-data.num
            })
					}
					uni.showToast({
						title:result.msg,
						icon:'none'
					})
					this.$refs.sbannerActivation.closeBanner();
				}).finally(()=>{
					this.isSending=false;
				})
			},
			toQueueCoin(data){
				this.isSending=true;
				if(!this.checkValue(data)){
					this.isSending=false;
					return false
				}
				queueCoinForward({
					applyId:this.childrenDetailInfo.id,
					buyNumber:data.num,
					payPassword:data.psw
				}).then(res=>{
					let result=res.data;
					if(result.code==='1'){
						let num=Number(this.childrenDetailInfo.quequCoinCount);
            // this.getData();
            this.$set(this.childrenDetailInfo,'quequCoinCount',num+Number(data.num));
            this.changemember({'quequCoinCount':this.member.quequCoinCount-data.num})
						// this.updateChildrenInfo({'quequCoinCount':num+Number(data.num)});
					}
					uni.showToast({
						title:result.msg,
						icon:'none'
					})
					this.$refs.sbannerQueueCoin.closeBanner();
				}).finally(()=>{
					this.isSending=false;
				})
			},
			activation(){
				this.checkPayPass(this.$refs.sbannerActivation.showBanner)
				// activationNumber
			},
			queueCoin(){
				this.checkPayPass(this.$refs.sbannerQueueCoin.showBanner)
			},
			
			memberActivate(){
				this.beforeConfirm('确定要消耗1个激活码激活该会员吗？',this.tomemberActivate)
			},
      memberThaw(){
        // this.beforeConfirm('本次申请将消耗一个激活码，是否确认继续 ', this.$refs.sbannerThaw.showBanner)
        this.beforeConfirm('本次申请将消耗一个激活码，是否确认继续 ', this.toThaw)
      },
      toThaw(){
        this.isSending=true;
        activeApply({
         unfreezeId:this.childrenDetailInfo.id,
         // receiptAmount: this.thawCount
        }).then(res=>{
          let result=res.data;
          uni.showToast({
            title:result.msg,
            icon:'none'
          })
          if(result.code==='1'){
            this.$set(this.childrenDetailInfo,'isActivate','3')
          }
        }).finally(()=>{
          this.isSending=false;
        })
      },
			tomemberActivate(){
				uni.showLoading({
					mask:true
				})
				activeTeamMember({id:this.childrenDetailInfo.id}).then(res=>{
					let result=res.data;
					if(result.code==='1'){
            this.getData()
            
						// this.updateChildrenInfo({'isActivate':'1'});
					}
					uni.showToast({
						title:result.msg,
						icon:'none'
					})
				}).catch(res=>{
					uni.showToast({
						title:'请求超时，请检查网络',
						icon:'none'
					})
				})
			},
			manager(){
				uni.navigateTo({
					url:'/pages/manager/manager?account='+this.childrenDetailInfo.account
				})
			}
		}
	};
</script>

<style lang="less">
 page,.content{
   height: 100%;
   background-color:#1a1a24;
 }
 .content{
   box-sizing: border-box;
   padding:0 20upx 0;
 }
 scroll-view{height: 100%;padding-bottom: 120upx;box-sizing: border-box;}
.uni-list {
  color: #fff;
  background-color: #21212B;
  margin-top: 20upx;
  .uni-list-cell::after{
    left: 0;
    opacity: 0.12;
    background: #979797;
  }
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

</style>
