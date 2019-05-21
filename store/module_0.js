import Vue from 'vue'

const setObjectValue=(obj,info)=>{
	if(typeof info ==='object'){
		for (let i in info){
			if(info.hasOwnProperty(i)){
				Vue.set(obj,i,info[i]);
			}
		}
	}
}
const state = {
  isInit:false,
  isLogin:false,
	member:{},
	registerInfo:{}, //注册时填写的信息
	token:null,
	activateCount:0, //激活码数量
	activateInfo:[], //激活码信息列表
  queueCount:0, //排单币数量
  queueInfo:[], //排单币信息列表
	childrenDetailInfo:{},//查看的组员详情信息
	isTrade:false, //是否可以进行交易 检查银行卡和密码 暂未使用 TODO ；
  isUserReset:false , //是否可以重置用户信息
	prepayStatus:[{ //预付款状态
		text:'未进场',
		className:'default'
	},{
		text:'已进场',
		className:'primary'
	},{
		text:'申请离场',
		className:'process'
	},{
		text:'允许离场',
		className:'primary'
	},{
		text:'已离场',
		className:'default'
	},{
		text:'预付进场中',
		className:'warn'
	}], 
  supplyStatus:[{ // 买入聚德 状态	
    	text:'匹配确认中',
    	className:'process'
  },{
    text:'等待匹配',
    className:'process'
  },{
    text:'匹配成功',
    className:''
  },{
    text:'打款完成',
    className:'primary'
  },{
    text:'超时打款',
    className:'warn'
  }], 
	acceptStatus:[{ // 卖出聚德 状态	
	  	text:'',
	  	className:'default'
	},{
	  text:'等待匹配',
	  className:'process'
	},{
	  text:'匹配成功',
	  className:''
	},{
	  text:'收款完成',
	  className:'primary'
	},{
	  text:'超时收款',
	  className:'warn'
	}],
  dealStatus:[{   // 提供帮助下打款 状态
    text:'',
    className:'default'
  },{
    text:'待打款',
    className:'warn'
  },{
    text:'对方未确认',
    className:'process'
  },{
    text:'收款已确认',
    className:'primary'
  },{
    text:'收款确认超时',
    className:'warn'
  }],
	dealStatus_:[{ // 接受帮助下收款 状态
	  text:'',
	  className:'default'
	},{
	  text:'对方未打款',
	  className:'warn'
	},{
	  text:'待收款确认',
	  className:'process'
	},{
	  text:'已确认收款',
	  className:'primary'
	},{
	  text:'收款确认超时',
	  className:'warn'
	}],
  orderValue:['','预付钱包','静态钱包','抢单钱包','动态钱包','平单钱包','超时钱包'], //接单状态值
	orderType:['','预付','静态','抢单','动态','平单','超时'], //接单状态
  walletStatusActivity:[{ //动态钱包体现记录中提现状态
    text:'审核中',
    className:'warn'
  },{ 
    text:'允许提现',
    className:'primary'
  },{ 
    text:'提现中',
    className:'primary'
  },{
    text:'已提现',
    className:'primary'
  }],
  offerOrderType:[{ //提供帮助订单挂单提现状态
    text:'未提现',
    className:'warn'
  },{ 
    text:'提现中',
    className:'primary'
  },{ 
    text:'已提现',
    className:'primary'
  }],
  memberStatus:[{
    text:'未激活',
    className:'default'
  },{
    text:'已激活',
    className:'primary'
  },{
    text:'已冻结',
    className:'warn'
  },{
    text:'解冻中',
    className:'default'
  }]
};
const mutations = {
    CLEARmember(state){
      state.member={},
      state.token=null,
      state.activateCount=0, //激活码数量
      state.activateInfo=[], //激活码信息列表
      state.queueCount=0, //排单币数量
      state.queueInfo=[], //排单币信息列表
      state.childrenDetailInfo={},//查看的组员详情信息
      state.isTrade=false;
      state.registerInfo={} //注册时填写的信息
    },
    CHANGEDATA(state,info){
      state[info.name]=info.value
    },
    CHANGEDATAOBJECT(state,info){
			
      setObjectValue(state[info.name],info.value)  
    }
    
};
const actions = {
    init(context,info){
      context.commit('CHANGEDATA',{name:'isInit',value:info})
    },
    changeUserReset(context,info){
      context.commit('CHANGEDATA',{name:'isUserReset',value:info})
    },
    changemember(context,info){
    	context.commit('CHANGEDATAOBJECT',{name:"member",value:info});
    },
		updateChildrenInfo(context,info){
    	context.commit('CHANGEDATAOBJECT',{name:"childrenDetailInfo",value:info});
    },
		updateActivateInfo(context,info){
    	context.commit('CHANGEDATAOBJECT',{name:"activateInfo",value:info});
    },
    updateQueueInfo(context,info){
    	context.commit('CHANGEDATAOBJECT',{name:"queueInfo",value:info});
    },
    changeToken(context,info){
      context.commit('CHANGEDATA',{name:'token',value:info})
    },
    logOut(context,info){
      context.commit('CHANGEDATA',{name:'isLogin',value:false}),
      context.commit('CLEARmember')
      uni.removeStorageSync('token');
      uni.removeStorageSync('userId');
    },
    logOn(context,info){
      uni.setStorageSync('token',info.token);
      context.commit('CHANGEDATAOBJECT',{name:"member",value:info.member});
      context.commit('CHANGEDATA',{name:'isLogin',value:true})
    },
    changeUserStatus(context,info){
      context.commit('CHANGEDATA',{name:'isLogin',value:info})
    }
};
const getters = {

};

export default {
  namespaced: true,
	state,
	mutations,
	actions,
	getters
}
