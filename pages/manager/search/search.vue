<template>
	<view class="search-content">
		<view class="uni-list">
			<view class="uni-list-cell uni-search-nav">
				<view class="uni-list-cell-navigate">
					<view class="input-view">
						<uni-icon type="search" size="22" color="#666666"></uni-icon>
						<input confirm-type="search" :value="text" @input="search" class="input" type="text" placeholder="输入手机号，账号，姓名查询" />
					</view>
					<text class="primary cancel" @tap="cancel">取消</text>
				</view>
			</view>
			<view class="uni-list-cell" v-for="item in lists">
				<view class="uni-list-cell-navigate" @tap="todetail(item)">
					<view>{{item.account}}-{{item.name}}</view>
					<view class="tag">
						<view>
							<uni-tag text="活" className="member small" v-if="item.isActivate=='1'"  type="primary" size="small"></uni-tag>
							<uni-tag text="活" className="member small" v-else-if="item.isActivate=='0'"  type="default" size="small"></uni-tag>
							<uni-tag text="冻" className="member small" v-else-if="item.isActivate=='2'"  type="warn" size="small"></uni-tag>
              <uni-tag text="解" className="member small" v-else-if="item.isActivate=='3'"  type="warn" size="small"></uni-tag>
            </view>
						<view>
							<uni-tag text="场" className="prepay small" v-if="item.isPrepay=='1'" type="primary" size="small"></uni-tag>
							<uni-tag text="场" className="prepay small" v-else-if="item.isPrepay=='2'"  type="warn" size="small"></uni-tag>
							<uni-tag text="场" className="prepay small" v-else  type="default" size="small"></uni-tag>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniTag from '@/components/uni-tag.vue'
	import uniIcon from '@/components/uni-icon'
	import {queryTeamUsers} from '@/common/getData'
	export default {
		data() {
			return {
				lists: [],
				text:''
			};
		},
		components: {
			uniIcon,
			uniTag
		},
		methods: {
			todetail(value) {
				uni.navigateTo({
					url: '/pages/manager/detail/detail?id=' + value.id
				})
			},
			cancel(){
				this.text="";
				this.lists=[];
				uni.navigateBack()
			},
			search(e){
				this.text=e.detail.value;
				
				queryTeamUsers({queryCondition:this.text}).then(res=>{
					let result=res.data;
					if(result.code==="1"){
						this.lists=[];
						result.data.forEach(item=>{
							this.lists.push(item)
						});
					}
				})
			}
		}
	}
</script>

<style lang="less">
  page {
    position: relative;
    width: 100%;
    background: #1A1A24;
  }
  .search-content{
   padding: 20upx;
   .uni-search-nav{
    background-color: transparent;
   }
  }
	.input-view {
		width: 92%;
		display: flex;
		background-color: #21212B;
		height: 30px;
		border-radius: 15px;
		padding: 0 4%;
		flex-wrap: nowrap;
		line-height: 30px;
	}

	.input-view .uni-icon {
		line-height: 30px !important;
	}

	.input-view .input {
    color: #fff;
		height: 30px;
		line-height: 30px;
		width: 94%;
		padding: 0 3%;
	}
  .uni-list-cell{
    color: #fff;
    background-color:#21212b;
    &:after{
    left: 0;
    opacity: 0.12;
    background: #979797;
    }
  }
	.cancel {
		flex: none;
		margin-left: 20upx;
	}

	.tag {
	  margin-left: 30upx;
	  display: flex;
	  .uni-tag-small{
	    height: 32upx;
	    width: 32upx;
	    line-height: 32upx;
	    padding: 0;
	    font-size: 24upx;
	    border-radius: 4upx;
	    background-color: #373740;
	    border: none;
	    text-align: center;
	    &.uni-tag-primary.prepay{
	      background-image: linear-gradient(-157deg, #F8B071 0%, #ED783E 91%);
	      box-shadow: 0 0 8px 0 rgba(237,120,62,0.50);
	    }
	    &.uni-tag-primary.member{
	      background-image: linear-gradient(-159deg, #A288F0 0%, #6950DC 92%);
	    }
      &.uni-tag-warn.member{
        background-image: linear-gradient(-159deg, #D95353 0%, #db2323 92%);
      }
	  }
	  >view {
	    flex: none;
	    margin-right: 30upx;
	  }
	}
</style>
