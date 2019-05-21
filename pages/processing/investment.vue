<template>
	<view>
		<view class="uni-page-head">
			<view class="icon iconfont  icon-qunfengtishi warn"></view>
			<view class="text">
				提交申请后第二日进行匹配，届时将以短信方式进行通知，收到通知后请尽快完成打款，保证您的信誉和收益。
			</view>
		</view>

		<view class="uni-padding-wrap">
			<view class="title">
				买入聚德金额：
			</view>
			<view class="uni-card">
				<view class="uni-card-content-inner">
					<radio-group @change="radioChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items_radio" :key="item.value">
							<view>{{item.name}}</view>
							<view>
								<radio :value="item.value" :checked="index === amountSelect" color="#E5BC2D" />
							</view>
						</label>
					</radio-group>
				</view>
			</view>
			<view class="title">
				选择支付方式：
			</view>
			<view class="uni-card">
				<view class="uni-card-content-inner">
					<checkbox-group @change="checkboxChange">
						<label class="uni-list-cell uni-list-cell-pd" v-for="item in getPayWay" :key="item.value">
							<view>{{item.name}}</view>
							<view>
								<checkbox :value="item.value" :checked="item.checked" color="#E5BC2D" />
							</view>
						</label>
					</checkbox-group>
				</view>
			</view>
			<view class="title">
				输入交易密码：
			</view>
			<trans-password ref="password"></trans-password>

			<view class="btn-box">
				<button type="primary" @tap="submit">买入聚德（支付1个排单币）</button>
			</view>
		</view>

	</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'

	import {
		investSave,
		getParam
	} from '@/common/getData'
	import graceChecker from '@/common/graceChecker.js'
	import transPassword from '@/components/trans_password'

	export default {
		components: {
			transPassword
		},
		data() {
			return {
				showPassword: true,
				amountSelect: 0,
				password: '',
				items_radio: [{
					value: '',
					name: ''
				}]
			};
		},
		onLoad() {
			getParam({
				paramKey: 'supply_amount_rank'
			}).then(res => {
				let result = res.data;
				if (result.code == '1') {
					this.items_radio = [{
						value: result.data,
						name: result.data
					}]
				}
			})
		},
		computed:{
			...mapState('module_0',['member']),
			getPayWay(){
				let way=[{
						value: '1',
						name: '银行卡',
						checked:true
				}];	
				if(this.member.wechatAccount){
					way.push({
						value: '2',
						name: '微信',
					})
				}
				if(this.member.alipayAccount){
					way.push({
						value: '3',
						name: '支付宝',
					})
				}
				return way;
			}
		},
		methods: {
			radioChange: function(evt) {
				for (let i = 0; i < this.items_radio.length; i++) {
					if (this.items_radio[i].value === evt.target.value) {
						this.amountSelect = i;
						break;
					}
				}
			},
			checkboxChange: function(e) {
				var items = this.getPayWay,
					values = e.detail.value;

				for (var i = 0, lenI = items.length; i < lenI; ++i) {
					items[i].checked = false;
					for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
						if (items[i].value == values[j]) {
							items[i].checked = true;
							break
						}
					}
				}
			},
			changePassword: function() {
				this.showPassword = !this.showPassword;
			},
			submit(){
				let checked = this.getPayWay.filter(opt => {
					return opt.checked
				})
				if (checked.length <= 0) {
					uni.showToast({
						title: "请选择支付方式",
						icon: 'none'
					})
					return false;
				}
				let payWay = [];
				for (let i = 0; i < checked.length; i++) {
					payWay.push(checked[i].value)
				}
				let rule = [{
						name: "payPassword",
						checkType: "reg",
						checkRule: "^[a-zA-Z0-9]{6,20}$",
						errorMsg: "请输入正确格式的交易密码"
					}],
					data = {
						amount: this.items_radio[this.amountSelect].value,
						payWay: payWay.join(','),//TODO
						payPassword: this.$refs.password.password
					},
					checkRes = graceChecker.check(data, rule);
				if (!checkRes) {
					uni.showToast({
						title: graceChecker.error,
						icon: 'none'
					})
					return false;
				}
				uni.showModal({
					content:`本次订单帮助金额为￥${data.amount},消耗1个排单币,请确定是否继续？`,
					confirmColor:"#E5BC2D",
					success:e=>{
						if(e.confirm){
							this.toSubmit(data);
						}
					}
				})
			},
			toSubmit(data){
				
					uni.showLoading({
						mask:true
					})
					investSave(data).then(res => {
						let result = res.data;
						uni.showToast({
							title: result.msg,
							icon: 'none'
						})
						if (result.code == '1') {
							setTimeout(() => {
								uni.navigateBack()
							}, 1000)
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
	  background-color:#1A1A24;
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

	.title {
		font-size: 28upx;
		color: #666;
		line-height: 80upx;

		&+.uni-card {
			margin-top: 0;
		}
	}

	.btn-box {
		margin-top: 40upx;
		padding-bottom: 40upx;
	}

	.uni-input {
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
</style>
