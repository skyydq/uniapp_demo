<template>
	<view>
    <view class="uni-list uni-list-first" >
      <view class="uni-list-cell uni-list-cell-last">
        <view class="uni-list-cell-navigate">
          <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" :styleType="styleType"
          	 :activeColor="activeColor"></uni-segmented-control>
        </view>
      </view>
    </view>
		<view class="content">
			<view >
				 <view class="uni-list">
           <template  v-if="lists&&lists.length>0">
           
            <view class="uni-list-cell" v-for="(list,k) in lists" :key="k">
              <view class="uni-list-cell-navigate uni-column">
                <view class="item">
                  <view>￥{{list.profitAmount+list.selfAmount}}</view><view>{{list.profitTime?list.profitTime:""}}</view>
                </view>
                 <view class="item uni-media-list-text-bottom">
                   {{list.profitDesc}}
                 </view>
              </view>
            </view>
            </template>
            <template v-else>
            	<view class="uni-list-cell nodata">
                <view class="uni-list-cell-navigate tcenter">
                  暂无数据
                </view>
              </view>
            </template>
         </view>
         
			</view>
    </view>
    
	</view>
</template>

<script>
  import uniSegmentedControl from '@/components/uni-segmented-control.vue';
  import {walletList} from '@/common/getData'
	export default {
		components: {
			uniSegmentedControl
		},
		data() {
			return {
				items: [
					'未提现',
					'提现中',
					'已提现'
				],
        current: 0,
        activeColor: '#E5BC2D',
        styleType: 'button',
        styleIndex: 0,
        colorIndex: 0,
        type:'',
        lists:[]
			};
		},
    onLoad(e){
			let title;
			if(e.target==="static"){
				title= "静态钱包";
        this.type=2
      }else{
				title="抢单钱包"
        this.type=3
			}
      this.getData()
			uni.setNavigationBarTitle({
				title
			});
		},
    methods:{
      onClickItem(index) {
      	if (this.current !== index) {
      		this.current = index;
          this.lists=[];
          uni.showLoading()
          this.getData();
      	}
      },
      getData(){
        let  data={
          type:this.type,
          ssaleStatus:this.current
        }
        walletList(data).then(res=>{
          let result=res.data;
          if(result.code=='1'){
            this.lists=result.data
          }
            uni.hideLoading()
        }).catch(()=>{
          uni.showToas({
            title:'服务错误',
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
  
  .content{
    padding:20upx;
  }
  .nodata{
    color: #7F8094;
    background-color: #21212b;
    padding: 0;
    height: 80upx;
    line-height: 80upx;
  }
  .uni-list{
    background-color:#21212b;
    color: #fff;
  }
.uni-list-first{
    &:after{
      content: none;
    }
}
.tcenter{
  justify-content: center;
}
.uni-column{
  .item{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .uni-navigate-bottom{
    color: #999;
  }
}
</style>
