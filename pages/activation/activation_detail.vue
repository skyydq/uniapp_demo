<template>
  <view class="content page-wrap wrap-btn-bottom-padding" :class="{'active':isLogin}">
    <view class="uni-list" v-if="activateInfo">
      <view class="uni-list-cell" v-for="(item, k) in activateInfo" :class="{'uni-list-cell-last':k===activateInfo.length-1}" :key="k">
        <view class="uni-list-cell-navigate">
          <view>激活码</view>
          <view class="btn-group" v-if="k==0&&member.isActivate==='0'&&item.status=='1'">
            <button type="primary" class="mini-btn" size="mini" @tap="activation(item.id)">激活自己</button>
          </view>
          <view v-else :class="status[item.status-1].className">{{ status[item.status-1].text }}</view>
        </view>
      </view>
    </view>
		<load-more ref="loadMore" :contentText="contentText" :loadingType="loadingType"  @more="load"></load-more>
    <!-- <view class="btn-bottom"><button type="primary">直接转出供应</button></view> -->
  </view>
</template>

<script>
import loadMore from '@/components/loadMore'
import {mapState,mapActions} from 'vuex'
import {updateActivate,activateCodeUnusedList} from '@/common/getData'
export default {
	components:{
		loadMore
	},
  data() {
    return {
			first:true,
      status:[{
          code: 1,
          text: '未使用',
          className: 'primary'
        },
        {
          code: 2,
          text: '已使用',
          className: 'default'
        }
      ],
			loadingType:0,
			totalCount:'',
			activateInfo:null,
			contentText:{
				contentdown: "上拉显示更多",
				contentrefresh: "正在加载",
				contentnomore: "暂无更多数据"
			}
    };
  },			
  computed:{
    ...mapState('module_0',['isLogin','member'])
  },
	onLoad(){
		this.load()
	},
	onReachBottom() {
	   // this.load();
	},
  methods:{
    ...mapActions('module_0',['changemember']),
		load(){
			if(!this.loadingType){
				this.loadingType=1;
				activateCodeUnusedList().then(res=>{
					let result=res.data;
					if(result.code=='1'){
						this.activateInfo=result.data;
						//TODO
					}
				}).finally(()=>{
					this.loadingType=2;
				})
			}
		},
    activation(value){
      updateActivate({id:value}).then(res=>{
        let result=res.data;
        if(result.code=='1'){
          this.changemember({isActivate:"1"});
					this.load()
        }
        uni.showToast({
        	title: result.msg,
        	icon: 'none'
        });
      })
    }
  }
};
</script>

<style lang="less">
page,
.content {
  background-color: #1A1A24;
  min-height: 100%;
}
.content {
  position: absolute;
  left: 0;
  width: 100%;
  top: 0;
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
	box-sizing: border-box;
}
.uni-list{
  margin-top: 20upx;
  background-color: #21212b;
  color: #fff;
}
</style>
