<template>
	<view>
		<view class="uni-page-head">
			<view class="icon iconfont icon-tongzhi"></view>
			<view class="text">
				收到打款通知后尽快完成打款，打款时间越短收益越高，如果超过未打，账号将被临时关闭。
			</view>
		</view>

		<view class="uni-padding-wrap">
			<view class="title">
				收款人信息：
			</view>
			<view class="uni-card">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							收款人账号： {{info.receiptMemberAccount}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							收款人真实姓名：{{info.receiptMemberName}} <!-- TODO-->
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							收款人手机号： {{info.receiptMemberTelephone}} <!-- TODO-->
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-last">
						<view class="uni-list-cell-navigate">
							收款人上级手机号：{{info.receiptParentTelephone}}
						</view>
					</view>
				</view>
			</view>
			<view class="uni-card">
				<view class="uni-list">
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							需打款金额： {{info.remitAmount}}
						</view>
					</view>
					<view class="uni-list-cell">
						<view class="uni-list-cell-navigate">
							开始打款时间：{{info.remitBeginTime?info.remitBeginTime:''}} <!-- TODO-->
						</view>
					</view>
					<view class="uni-list-cell uni-list-cell-last">
						<view class="uni-list-cell-navigate ">
							<view>打款倒计时：<text class="warn">{{countDownTime}}</text></view> <!-- TODO-->
						</view>
					</view>
				</view>
			</view>
			<!--  -->
			<view class="title uni-flex ">

				<view>选择对方收款账户 <text class="warn">*</text></view>
				<view class="btn">
					<button type="primary" size="mini" @click="copy">复制</button>
				</view>

			</view>
			<view class="uni-card">
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items_radio" :key="item.value">
						<view>{{item.type}} {{item.name}}</view>
						<view>
							<radio :value="item.value" :checked="index === amountSelect" color="#E5BC2D" />
						</view>
					</label>
				</radio-group>
			</view>
			<view class="title">
				上传打款凭证截图 <text class="warn">*</text>
			</view>
			<view class="uni-card">
				<view class="uni-card-content-inner">
					<view class="uni-uploader__files">
						<block v-for="(image,index) in imageList" :key="index">
							<view v-if="image.src" class="uni-uploader__file" style="position: relative;">
								<image class="uni-uploader__img" :src="image.blob" :data-src="image.blob" @tap="previewImage"></image>
								<view class="close-view" @click="close(index)">x</view>
							</view>
							<view v-else class="uni-uploader__file uni-icon-box" style="position: relative;">
								<view class="uni-icon uni-icon-spinner"></view>
							</view>
						</block>
						<view class="uni-uploader__input-box" v-if="imageList.length<=0">
							<view class="uni-uploader__input"  @tap="chooseImage"></view>
						</view>
					</view>
				</view>
			</view>
			<view class="title">
				输入交易密码：
			</view>
			<transPassword ref="password"></transPassword>
			<view class="btn-box">
				<button type="primary" @tap="submit">已打款并通知对方</button>
			</view>
		</view>

	</view>
	</view>
</template>

<script>
	import {dealDetail,dealRemit,uploadFile} from '@/common/getData'
	import transPassword from '@/components/trans_password'
	import graceChecker from '@/common/graceChecker.js'
	import {getCountDown,copy} from '@/common/until'
	import {mapState,mapActions} from 'vuex';

	export default {
		components: {
			transPassword
		},
		data() {
			return {
				showPassword: true,
				countDownTime: '',
				info: {},
				amountSelect: 0,
				items_radio: [{
						value: '1',
						type: '银行卡号：',
						name: ''
				}],
				imageList: [],
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			};
		},
		onLoad(e) {
			dealDetail({
				id: e.id
			}).then(res => {
				let result = res.data;
				if (result.code === '1') {
					this.info = result.data;
					this.countDown(result.data.remitDeadTime);
					let alipay = result.data.receiptMemberAlipayAccount,
						bank = result.data.receiptMemberBankNumber,
						wechat = result.data.receiptMemberWechatAccount;
						this.items_radio[0].name =bank?bank:'';
            if(result.data.receiptMemberBankName){
              this.items_radio[0].type =result.data.receiptMemberBankName+':';
            }
						if(wechat){
							this.items_radio.push({
								value: '2',
								type: '微信号：',
								name: wechat?wechat:''
							})
						}
						if(alipay){
							this.items_radio.push({
								value: '3',
								type: '支付宝号：',
								name: alipay?alipay:''
							})
						}
				}
			})
		},
		
		methods: {
			...mapActions('module_0', ['changemember']),

			countDown(data) {
        let time=data.replace(/-/g,':').replace(' ',':').split(':');
				time = new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]).getTime();
				var nowTime = new Date().getTime();
				var count = time - nowTime;
				if (count <= 0) {
					this.countDownTime = "00:00:00"
				} else {
					this.countDownTime=getCountDown(count);
					setInterval(() => {
						nowTime = new Date().getTime();
						count = time - nowTime;
						this.countDownTime=getCountDown(count)
					}, 1000)
				}
			},
			radioChange(evt) {
				for (let i = 0; i < this.items_radio.length; i++) {
					if (this.items_radio[i].value === evt.target.value) {
						this.amountSelect = i;
						break;
					}
				}
			},
			copy() {
				var text = this.items_radio[this.amountSelect].name;
// 				if (text.indexOf('-') !== -1) {
// 					let arr = text.split('-');
// 					text = arr[0] + arr[1];
// 				}
				// #ifdef H5
				copy(text);
				//#endif
        // #ifndef H5
        uni.setClipboardData({
            data: text,
            success:()=>{
               uni.showToast({
               	title:this.items_radio[this.amountSelect].type+'已复制',
                icon:'none'
               })
            }
        });
        // #endif
			},
			close(e) {
				this.imageList.splice(e, 1);
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有图片了,是否清空现有图片？",
						confirmColor:'#E5BC2D',
            success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			chooseImage: async function() {
				if (this.imageList.length === 1) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: ['camera', 'album'],
					sizeType: ['compressed', 'original'],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList.push({
							src:'',
							blob:res.tempFilePaths[0]
						})
						uploadFile({
							fileType:'image',
							key:'file',
							value:res.tempFilePaths[0]
						}).then(res=>{
							let result=res.data;
							if(typeof result === 'string'){
								result=JSON.parse(result)
							}
							if(result.code==='1'){
               
								this.imageList[this.imageList.length-1].src=result.data.url;
                this.imageList[this.imageList.length-1].imgId=result.data.id;
								uni.showToast({
									title:'图片上传成功',
									icon:'none'
								})
							}else{
								uni.showToast({
									title:'图片上传超时，请重试',
									icon:'none'
								})
								this.imageList.pop()
							}
						}).catch(error=>{
							uni.showToast({
								title:'图片上传超时，请重试',
								icon:'none'
							})
							this.imageList.pop()
						})
						
					}
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			submit() {
        
				let rule = [{
						name: "remitImageUrl",
						checkType: "notnull",
						checkRule: "",
						errorMsg: "请上传图片"
					},{
						name: "payPassword",
						checkType: "reg",
						checkRule: "^[a-zA-Z0-9]{6,20}$",
						errorMsg: "请输入正确格式的交易密码"
					}],
				data = {
					id: this.info.id,
					receiptWay: this.items_radio[this.amountSelect].value,
					receiptAccount: this.items_radio[this.amountSelect].name,
					remitImageUrl:this.imageList[0]? this.imageList[0].src:'',
          imgId:this.imageList[0]? this.imageList[0].imgId:'',
					payPassword: this.$refs.password.password
				},
				checkRes = graceChecker.check(data, rule);console.log(data)
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: 'none'
					})
					return false;
				}
				uni.showLoading({
					mask:true
				})
				dealRemit(data).then(res=>{
					let result=res.data;
					if(result.code==='1'){
						uni.showToast({
							title:"通知成功",
							icon:'none'
						})
						this.changemember({isPrepay:'5'})
						setTimeout(()=>{
						  uni.redirectTo({
						  	url:"/pages/settlement/deal_detail?id=" + this.info.id
						  })
						},1500)
					}else{
						uni.showToast({
							title:result.msg,
							icon:'none'
						})
					}
					
				}).catch(res=>{
						uni.showToast({
							title:'请求超时，请检查网络',
							icon:'none'
						})
					})
			}

		}
	}
</script>

<style lang="less">
    page{
    background-color: #1A1A24;
  }
	.uni-page-head {
		background-color: #21212B;
		display: flex;
		align-items: top;
		text-align: left;
		color: #7F8094;

		.icon {
			flex: none;
			font-size: 48upx;
			width: 40upx;
			line-height: 1;
			margin-right: 20upx;
		}
	}
	.uni-icon-box{
		 display: flex;
		 justify-content: center;
		 align-items: center;
		 background-color: #ccc;
		 .uni-icon-spinner{
			 transform-origin:50%; 
			 animation: load 1.56s linear infinite ;
		 }
	}
	.title {
		font-size: 28upx;
		color: #7F8094;
		line-height: 80upx;

		&.uni-flex {
			justify-content: space-between;
		}

		&+.uni-card {
			margin-top: 0;
		}
	}

	.btn-box {
		margin-top: 40upx;
		padding-bottom: 40upx;
	}

	.uni-uploader__files.three {
		justify-content: space-between;
	}

	.uni-uploader__img,
	.uni-uploader__file {
		width: 190upx;
		height: 190upx;
	}

	.uni-uploader__input-box {
		width: 186upx;
		height: 186upx;
	}

	.close-view {
		text-align: center;
		line-height: 14px;
		height: 16px;
		width: 16px;
		border-radius: 50%;
		background: #FF5053;
		color: #FFFFFF;
		position: absolute;
		top: -6px;
		right: -4px;
		font-size: 12px;
	}
	
</style>
