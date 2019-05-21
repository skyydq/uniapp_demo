<template>
	<view class="content">
		<template v-if="totalCount===0">
			 <view class="data-none">暂无数据</view>
		</template>
		<template v-else>
			<view class="uni-list">
				<template  v-for="(list, index) in lists" >
					<recordList :list="list" @tapEvent="tapEvent"></recordList>
				</template>
			</view>
			<load-more ref="loadMore" :loadingType="loadingType"  @more="loadData"></load-more>
		</template>
		
	</view>
</template>

<script>
	import recordList from '@/components/record_offer_list'
	import {supplyList} from '@/common/getData'
	import loadMore from '@/components/loadMore'
	export default {
		components: {
			recordList,loadMore
		},
		data() {
			return {
				lists:[],
				loadingType:0,
				totalCount:'',
				pageIndex:1,
				limit:20,
			};
		},
		onLoad(){
			this.loadData();
		},
		onReachBottom() {
		    this.loadData();
		},
		onPullDownRefresh() {
			this.initData();
		},
		methods:{
			async initData(){
				this.loadingType=0,
				this.pageIndex=1;
				await this.load(true)
				uni.stopPullDownRefresh();
			},
			loadData(){
				if(!this.loadingType){
				  this.loadingType=1;
				  this.load()
				}
			},
			load(refresh){
			 return	supplyList({
					page:this.pageIndex,
					limit:this.limit
				}).then(res=>{
					let result=res.data;
					if(result.code=='1'){
						this.totalCount=result.data.totalCount;
						if(refresh){
							this.lists=[];
						}
						result.data.list.forEach((item)=>{
						  this.lists.push(item)
						})
						if(this.lists.length>=this.totalCount){
							this.loadingType=2
						}else{
							this.loadingType=0
						}
						this.pageIndex++;
					  //TODO
					}else{
            this.loadingType=3;
            uni.showToast({
            	title:result.msg,
              icon:'none'
            })
          }
				})
			},
			tapEvent(item){
				uni.navigateTo({
					url:'offer_order_detail?id='+item.id
				})
			}
		}
		
	}
</script>

<style lang="less">
page,.content{
   background-color:#1a1a24;
 }
.uni-list{
  color: #fff;
  background-color: #21212B;
  .uni-list-cell::after{
    left: 0;
    opacity: 0.12;
    background: #979797;
  }
}
</style>
