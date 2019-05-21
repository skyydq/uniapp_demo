<template>
	<view class="uni-list" :class="className"  >
		<view class="uni-list-cell" hover-class="uni-list-cell-hover" @tap="recodTap">
			<view class="uni-media-list uni-list-cell-navigate">
				<view class="uni-media-list-logo logo-text" v-if="typeText=='提供'">
					<text>买入</text>
					<text>聚德</text>
				</view>
        <view class="uni-media-list-logo logo-text active" v-else>
        	<text>卖出</text>
        	<text>聚德</text>
        </view>
				<view class="uni-media-list-body">
					<view class="uni-media-list-text-top">
						<view class="title">{{orderType[list.orderType]}} ￥{{list.amount}}</view>
          </view>
					<view v-if="list.status==='1'||list.status==='0'" class="uni-media-list-text-bottom uni-ellipsis">申请时间：{{list.applyTime?list.applyTime:''}}</view>
					<view v-else class="uni-media-list-text-bottom uni-ellipsis">
            <text v-if="typeText=='提供'">
              预计打款开始：
            </text>
            <text v-else>
              预计收款开始：
            </text>
            {{list.beginTime?list.beginTime:''}}
          </view>
				</view>
        <block v-if="typeText=='提供'">
          <view class="status" v-if="list.status=='0'"  :class="supplyStatus[list.status].className">
            确认还剩{{getDay}}天
          </view>
          <view class="status"  v-else  :class="supplyStatus[list.status].className">
            {{supplyStatus[list.status].text}}
          </view>
        </block>
        <view class="status" v-else :class="acceptStatus[list.status].className">{{acceptStatus[list.status].text}}</view>
        
      </view>
		</view>
	  <view v-if="list.dealRecordList&&list.dealRecordList.length>0" class="matching-list">
	  		<view v-for="(item,k) in list.dealRecordList" :key="k"  class="uni-list-cell" hover-class="uni-list-cell-hover" @tap="tapEvent(item)">
	  			<view class="uni-list-cell-navigate uni-navigate-right">
	  				<view class="name">
              <block v-if="typeText=='提供'">
                <view class="icon-text" >收款人</view>
                <view class="name_length">【{{item.receiptMemberAccount}}】</view>
              </block>
              <block v-else>
                <view class="icon-text">
                  打款人
                </view>
                <view class="name_length">【{{item.supplyMemberAccount}}】</view>
              </block>  
	  				</view>
	  				<view class="value">￥{{item.remitAmount}}</view>
					
	  				<view v-if="typeText=='提供'" class="status" :class="dealStatus[item.status].className">{{dealStatus[item.status].text}}</view>
					<view v-else class="status" :class="dealStatus_[item.status].className">{{dealStatus_[item.status].text}}</view>

	  			</view>
	  		</view>
        
    </view>
		<view v-else class="matching-none uni-list-cell">
			暂无匹配记录
		</view>
	</view>
</template>

<script>
  import {mapState,mapMutations} from 'vuex'
	export default {
    props:{
      'className':{
        default:'',
        type:String
      },
      'typeText':{
        default:'提供',
        type:String
      },
      'list':[Object]
    },
		data() {
			return {
				
			};
		},
    computed: {
    	...mapState('module_0', ['orderType','supplyStatus','acceptStatus','dealStatus','dealStatus_']),
      getDay(){
        if(this.list.preMatchTime){
          let startTime= this.list.preMatchTime,
              time=startTime.replace(/-/g,':').replace(' ',':').split(':'),
              start= new Date(time[0],(time[1]-1),time[2],time[3],time[4],time[5]).getTime(),
              endtime= new Date(),
              end =endtime.getTime(),
              count = start - end,
              hour =(count / (1000 * 60 * 60)-8),day;
              if(hour>0){
                day=Math.ceil(count / (1000 * 60 * 60*24))
              }else{
                day=0
              }
          return day   
        }
      }
    },
    methods:{
      tapEvent(value){
        this.$emit('tapEvent',value)
      },
      recodTap(){
        if(this.typeText==='提供'){
          this.$emit('offerEvent')
        }else{
          this.$emit('acceptEvent')
        }
      }
    }
	}
</script>

<style lang="less" scoped="">

  .logo-text {
  	position: relative;
  	padding: 4upx;
  	text-align: center;
  	display: flex;
  	flex-direction: column;
  	justify-content: center;
  	height:74upx;
    width: 74upx;
    background: rgba(223,186,60,0.06);
    color: #E5BC2D;
    font-size: 24Upx;
    line-height: 34upx;
    letter-spacing: 5upx;
  	text {
  		display: block;
  		white-space: nowrap;
  		line-height: 40upx;
  		// line-height: 1;
  	}
  	&:after {
  		content: " ";
  		width: 200%;
  		height: 200%;
  		position: absolute;
  		top: 0;
  		left: 0;
  		border: 1px solid #E5BC2D;
  		-webkit-transform: scale(.5);
  		transform: scale(.5);
  		-webkit-transform-origin: 0 0;
  		transform-origin: 0 0;
  		box-sizing: border-box;
  		border-radius: 6px;
  	}
    &.active{
      color:#ED783E;  
      background: rgba(237,120,62,0.07);
      &:after{
        border-color:#ED783E;
        
      }
    }
  }
	.uni-list {
		margin-bottom: 24upx;
		&::before {
			content: none;
		}
    &::after{
      content: none;
    }
    .uni-list-cell::after{
      left:12upx;
      right: 12upx;
      opacity: 0.09;
      background-color:#E4E4E4;
    }
    .uni-media-list{
      padding: 25upx 12upx;
      background: #21212B;
      .status{
        color: #4DCA96;
      }
    }
	}
  
	.uni-media-list-text-top {
		display: flex;
		justify-content: space-between;
     view{
      line-height: 1;
    }
		.title {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			font-size: 32upx;
      color: #fff;
      line-height: 1;
		}
	}
  .uni-media-list-text-bottom{
    margin-top: 22upx;
    view{
      line-height: 1;
    }
    
  }
	.matching-none {
		height: 80upx;
		line-height: 80upx;
		background-color: #21212b;
		justify-content: center;
    color: #7F8094;
    font-size: 24upx;
	}

	.matching-list {
    background-color: #212128;
		.uni-list-cell {
      font-size: 24upx;
      color: #7F8094;
      letter-spacing: 0;
      text-align: center;
			.name {
				display: flex;
				align-items: center;
        view{
          font-size: 24upx;
        }
				.icon-text{
         margin-right: 20upx;
         }
				.icon {
					width: 40upx;
					height: 40upx;
					margin-right: 20upx;
					display: block;
				}
			}

			.status {
				margin-right: 40upx;
			}
		}
	}

  .name_length{
    max-width:200upx;
    word-break: break-word;
  }
</style>
