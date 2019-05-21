<template>
	<view class="uni-padding-wrap">
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner" @click="showbanks">
					<input type="text" disabled :value="banktext" placeholder="请选择开户银行（必输）" />
				</view>
			</view>
		</view>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner" @click="showCity">
					<input type="text" disabled :value="citytext" placeholder="请选择开户行所在省市（必输）" />
				</view>
			</view>
		</view>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<input type="text" v-model="address" placeholder="请输入开户详情地址" />
				</view>
			</view>
		</view>
		<view class="uni-card">
			<view class="uni-card-content">
				<view class="uni-card-content-inner">
					<input type="number" v-model="cardcode" placeholder="请输入16~19位银行卡号" />
				</view>
			</view>
		</view>
		<mpvue-picker :themeColor="themeColor" ref="mpvuePicker" :mode="mode" :deepLength="deepLength" :pickerValueDefault="pickerValueDefault"
		 @onConfirm="onConfirm" :pickerValueArray="pickerValueArray"></mpvue-picker>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue'
	import cityData from '@/common/city.data.js'
	import {bankcardList} from '@/common/bankcard.js'
	import graceChecker from '@/common/graceChecker.js'
	import {updateBankInfo} from '@/common/getData.js'
	import {mapState,mapActions} from 'vuex'
	export default {
		data() {
			return {
				banktext: '',
				citytext: '',
				province:'',
				city:"",
				country:'',
				address: '',
				cardcode: '',
				mode: '',
				deepLength: 1,
				selectMode: null,
				pickerValueArray: [],
				themeColor: '#E5BC2D',
				pickerValueDefault: [0],
				cityPickerValueDefault: [0, 0, 1],

			};
		},
		components: {
			mpvuePicker,
			mpvueCityPicker
		},
    computed:{
      ...mapState('module_0',['member'])
    },
    watch:{
      member(){
        this.getInfo()
      }
    },
    mounted(){
      if(this.member.bankAddress){
        this.getInfo()
      }
    },
		onNavigationBarButtonTap(e) {
			if (e.index === 0) {
				let rule = [
					{name: "banktext",checkType: "notnull",checkRule: "",errorMsg: "请选择开户银行"},
					{name: "citytext",checkType: "notnull",checkRule: "",errorMsg: "请选择开户行所在省市"},
					{name: "address",checkType: "notnull",checkRule: "",errorMsg: "请输入开户详情地址"},
					{name: "cardcode",checkType: "int",checkRule: "15,18",errorMsg: "请输入正确的银行卡号"},	
					],
					dat={
						banktext:this.banktext,
						citytext:this.citytext,
						address:this.address,
						cardcode:this.cardcode
					},
					data={
						bankName:this.banktext,
						province:this.province,
						city:this.city,
						country:this.country,
						bankAddress:this.address,
						bankNumber:this.cardcode
					},
					checkRes = graceChecker.check(dat, rule);
				if(!checkRes){
					uni.showToast({
						title:graceChecker.error,
						icon:'none'
					})
					return false;
				}
				uni.showLoading({
					mask:true
				})
				updateBankInfo(data).then(res=>{
					let result=res.data;
					if(result.code==1){
						this.changemember(data);
						setTimeout(()=>{
							uni.navigateBack()
						},1500)
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
			}
		},
		methods: {
			...mapActions('module_0', ['changemember']),
      getInfo(){
        this.banktext=this.member.bankName?this.member.bankName:'';
        this.cardcode=this.member.bankNumber?this.member.bankNumber:'';
        this.province=this.member.province?this.member.province:'';
        this.city=this.member.city?this.member.city:'';
        this.country=this.member.country?this.member.country:'';
        let city=this.city?('-'+this.city):'';
        let country=this.country?('-'+this.country):'';
        this.citytext=this.province+city+country;
        this.address=this.member.bankAddress.replace(this.citytext,'')
      },
			showbanks() {
				this.pickerValueArray = bankcardList,
					this.mode = 'selector',
					this.deepLength = 1,
					this.pickerValueDefault = [0],
					this.$refs.mpvuePicker.show(),
					this.selectMode = 'bank'
			},
			showCity() {
				this.selectMode = 'city',
				this.$refs.mpvueCityPicker.show()
			},
			onConfirm(e) {

				switch (this.selectMode) {
					case 'bank':
						this.banktext = e.label;
						break;
					case 'city':
						
						this.citytext = e.label;
						let a=e.label.split('-');
						this.province=a[0];
						this.city=a[1];
						this.country=a[2];
						break;
					default:
						break;
				}

			}
		}
	}
</script>

<style lang="less">

</style>
