import {getData} from './until.js'

const userId=()=>{
  return uni.getStorageSync('userId');
}
const token=()=>{
  return uni.getStorageSync('token');
}

const getDataUrl=({url="",data={},type="POST"})=>{
	let expra='';
  type=type.toUpperCase();
	for (let i in data){
		if(data.hasOwnProperty(i)){
			expra+=i+'='+data[i]+'&'
		}
	}
	if(expra){
		expra='?'+expra;
	}
	
	return getData({url:url+expra,type});
}

/*
 会员登录
 
 * */
export const login = (data) =>{
  let platform=uni.getSystemInfoSync().platform,type,header;
  // #ifdef H5
  header={channel:1};
  // #endif
  // #ifdef APP-PLUS
  if(platform.toLowerCase().indexOf('ios')>=0){
    type=3
  }else{
    type=2
  }
  header={channel:type,versionCode:plus.runtime.version}
  // #endif
	return getData({url:'/web/member/login',data,type:'post',header});
}


/*
 会员注册合法性校验
 
 * */
export const verify = (data) =>{
	return getData({url:'/web/member/verify',data,type:'post'});
}

/*
 会员注册
 
 * */
export const register = (data) =>{
	return getData({url:'/web/member/register',data,type:'post'});
}


/*
 获取短信验证码
*/
export const checkCode = (data)=>{
  return getDataUrl({url:'/web/common/checkCode',data,type:'get'});
}

/* 获取个人信息 */
export const getMemberInfo = (data)=> {
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/member/getMemberInfo',header,type:'post'})
}

/* 登陆密码修改 */
export const updateLoginPassWd = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/member/updateLoginPassWd',data,header,type:'post'})
}
/* 登陆密码修改 */
export const updatePayPassWd = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/member/updatePayPassWd',data,header,type:'post'})
}
/* 银行账号 */

export const updateBankInfo = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/member/updateBankInfo',data,header,type:'post'})
}

/* 支付宝账号 */

export const updateALiPay = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/member/updateALiPay',data,header,type:'post'})
}

/* 微信账号 */

export const updateWechat = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/member/updateWechat',data,header,type:'post'})
}

/* 激活状态更新 */

export const updateActivate = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/activateCode/activeSelf',data,header,type:'post'})
}
/* 激活团队成员 */
export const activeTeamMember = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/activateCode/activeTeamMember',data,header,type:'post'})
}

/* 查询激活码数量 */

export const activateCount = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/activateCode/unused_count',data,header,type:'post'})
}
/* 未使用的激活码列表 */
export const activateCodeUnusedList = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/activateCode/unusedList',data,header,type:'post'})
}

/* 添加激活码 */
export const activateOrderAdd = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/activateOrder/add',data,header,type:'post'})
}

/* 激活码订单 */
// export const activateOrderList = (data={})=>{
// 	let token=uni.getStorageSync('token');
// 	let header={
// 		token
// 	}
// 	return getData({url:'/web/activateOrder/list',data,header,type:'post'})
// } 
/* 激活码订单申请列表 */
export const activateOrderList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/activateOrder/list",data,header,type:'post'})
}
/* 未使用的排单币列表 */
export const queueCoinUnusedList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/queueCoin/unusedList",data,header,type:'post'})
}
/* 激活码订单发放列表 */
export const activateOrderSupplyList= (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/activateOrder/supplyList",data,header,type:'post'})
}
/* 转出激活码 */
export const activateOrderSupply = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/activateOrder/supply',data,header,type:'post'})
} 

/* 查询排单币数量 */
export const queueCount = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/queueCoin/unused_count",data,header,type:'post'})
} 
/* 添加排单币 */
export const queueOrderAdd = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/queueCoinOrder/add',data,header,type:'post'})
}
/* 排单币订单申请列表 */
export const queueOrderList = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/queueCoinOrder/list',data,header,type:'post'})
}
export const queueCoinOrderSupplyList = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/queueCoinOrder/supplyList',data,header,type:'post'})
}

/* 排单币订单发放 */
export const queueOrdersupply = (data)=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/queueCoinOrder/supply',data,header,type:'post'})
}


/* 提供帮助前资格检查 */
export const applyVerify = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/supply/apply_verify',data,header,type:'post'})
} 

/* 抢单前资格检查 */
export const promotionVerify = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/supply/promotion_verify',data,header,type:'post'})
} 
/* 预付提供帮助申请保存 */
export const prepaySave = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/supply/prepay_save',data,header,type:'post'})
} 

/* 静态常规提供帮助申请保存 */
export const investSave = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/supply/invest_save',data,header,type:'post'})
} 

/* 抢单提供帮助申请保存 */
export const promotionSave = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/supply/promotion_save',data,header,type:'post'})
} 
/* 会员抢单页面可选择抢单金额列表及剩余数 */
export const promotionList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:'/web/supply/promotion_list',data,header,type:'post'})
} 

/* 公用方法 获取预付款金额 */
export const getParam = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getDataUrl({url:"/web/common/get_param",data,header,type:'get'})
}  

/* 获得未读消息数 */
export const messageUnreadCount = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/message/unread_count",data,header,type:'post'})
}  

/* 获取消息列表 */
export const messageList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/message/list",data,header,type:'post'})
}  
/* 获取公告列表 */
export const broadcastList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/broadcast/list",data,header,type:'post'})
}

/* 读公告更新 */
export const broadcastRead = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/broadcast/read",data,header,type:'post'})
}
/* 获取公告详情 */
export const broadcastInfo = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/broadcast/info",data,header,type:'post'})
}
/* 读消息更新 */

export const messageRead = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/message/read",data,header,type:'post'})
}
/* 获取消息详情 */

export const messageinfo = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/message/info",data,header,type:'post'})
}



/*  获取当前用户信息*/
export const getCurrUserInfo = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/member/getCurrUserInfo",data,header,type:'post'})
}

/*  获取会员信息*/
export const queryUserById = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/member/queryUserById",data,header,type:'post'})
}


/* 协助注册直推会员 */
export const helpRegister = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/member/helpRegister",data,header,type:'post'})
}

/* 获取指定会员的下一级所有会员信息 */

export const getChildUserInfo = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/member/getChildUserInfo",data,header,type:'post'})
}
/* 根据账号/姓名/手机查询会员信息 */

export const queryTeamUsers = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/member/queryTeamUsers",data,header,type:'post'})
}

/* 接受帮助前校验 */
export const receiptVerify = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/receipt/receipt_verify",data,header,type:'post'})
}
/* 接受帮助可接受帮助类型和金额列表 */
export const amountList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/receipt/amount_list",data,header,type:'post'})
}

/* 接受帮助提交 */
export const applySave = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/receipt/apply_save",data,header,type:'post'})
}

/* 获取短信验证码 */
export const getSmscode = (data={})=>{
	// return getData({url:"/web/common/get_smscode",data,type:'post'})
	return getData({url:"/web/member/verifyAndSms",data,type:'post'})
}
/* 图片验证码验证 */
export const valitCheckCode = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/common/valitCheckCode",data,header,type:'post'})
}

/* 问题反馈 */
export const suggestionAdd = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/suggestion/add",data,header,type:'post'})
}


/* 获得当前人进行中的提供帮助订单 */
export const supplyCurrDeal = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/supply/curr_deal",data,header,type:'post'})
}

/* 获得当前人进行中的接受帮助订单 */
export const receiptCurrDeal = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/receipt/curr_deal",data,header,type:'post'})
}
/* 交易明细接口 */
export const dealDetail = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/deal/detail",data,header,type:'post'})
}
/* 打款提交通通知对方 */

export const dealRemit = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/deal/remit",data,header,type:'post'})
}

/* 收款确认提交并短信站内信息提交 */
export const dealReceipt = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/deal/receipt",data,header,type:'post'})
}
/* 上传图片 */
export const uploadFile = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/common/imgUpload",data,header,type:'file'})
}
/* 检查银行卡和密码 是否可以跳转到有交易密码的页面 */
export const checkBankAndPayPasswd = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/member/checkBankAndPayPasswd",data,header,type:'post'})
}
/* 申请离场 */

export const leaveApply = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/leaveApply/leaveApply",data,header,type:'post'})
}

/* 激活码-直接转发 */
export const activateCodeForward = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/activateCode/directForward",data,header,type:'post'})
}
/* 排单币-直接转发 */
export const queueCoinForward = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/queueCoin/directForward",data,header,type:'post'})
}
/* 动态钱包余额 */
export const walletOverage = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/crashApply/walletOverage",data,header,type:'post'})
}
/* 提现申请 */
export const cashApply = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/crashApply/cashApply",data,header,type:'post'})
}
// 获得当前登录人提供帮助订单列表

export const supplyList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/supply/list",data,header,type:'post'})
}

/* 查询提供订单的详情 */
export const supplyDetail = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/supply/detail",data,header,type:'post'})
}

/* 获得当前登录人接受帮助订单列表 */
export const receiptList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/receipt/list",data,header,type:'post'})
}
/* 查询提供订单的详情 */

export const receiptDetail = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/receipt/detail",data,header,type:'post'})
}
/* 获得当前登录人打款交易记录 */

export const remitList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/deal/remit_list",data,header,type:'post'})
}
/* 获得当前登录人收款交易记录 */
export const acceptList = (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/deal/receipt_list",data,header,type:'post'})
}
/* 钱包金额 */
export const wallet= (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/member/wallet",data,header,type:'post'})
}
/* 静态，抢单明细 */
export const walletList= (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/walletDetail/list",data,header,type:'post'})
}

/* 动态钱包-奖励明细 */
export const dynamicAwardList= (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/walletDetail/dynamicAwardList",data,header,type:'post'})
}

/* 动态钱包-申请明细 */
export const dynamicCrashList= (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/walletDetail/dynamicCrashList",data,header,type:'post'})
}
/* 激活申请 */
export const activeApply= (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/unfreezeApply/activeApply",data,header,type:'post'})
}

/* 重置密码 获取验证码 */
export const passwordResetSms= (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/member/passwordResetSms",data,header,type:'post'})
}
/* 重置密码 获取验证码 */
export const passwordReset= (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/member/passwordReset",data,header,type:'post'})
}

/*获取动态钱包提现参数 */
export const crashApplyParams= (data={})=>{
	let token=uni.getStorageSync('token');
	let header={
		token
	}
	return getData({url:"/web/crashApply/params",data,header,type:'post'})
}

export const getVersion=(data={})=>{
  let token=uni.getStorageSync('token');
  let header={
  	token
  }
  return getData({url:"/web/sysVersion/getNewVersion",data,header,type:'post'})
}

// 根据账号获取会员信息

export const queryTeamUserByAccount=(data={})=>{
  let token=uni.getStorageSync('token');
  let header={
  	token
  }
  return getData({url:"/web/member/queryTeamUserByAccount",data,header,type:'post'})
}

// 校验账号是否存在未完成的交易
export const userResetCheck=(data={})=>{
  let token=uni.getStorageSync('token');
  let header={
  	token
  }
  return getData({url:"/web/member/userResetCheck",data,header,type:'post'})
}
// 用户重置交易密码校验
export const userResetPayPasswordCheck=(data={})=>{
  let token=uni.getStorageSync('token');
  let header={
  	token
  }
  return getData({url:"/web/member/userResetPayPasswordCheck",data,header,type:'post'})
}
// 用户重置信息保存
export const userReset=(data={})=>{
  let token=uni.getStorageSync('token');
  let header={
  	token
  }
  return getData({url:"/web/member/userReset",data,header,type:'post'})
}

//重置用户信息 获取短信验证码
export const userResetSms=(data={})=>{
  let token=uni.getStorageSync('token');
  let header={
  	token
  }
  return getData({url:"/web/member/userResetSms",data,header,type:'post'})
}

//获取当天可抢单详请
export const getCurrDayDatas=(data={})=>{
  let token=uni.getStorageSync('token');
  let header={
  	token
  }
  return getData({url:"/web/promotion/getCurrDayDatas",data,header,type:'post'})
}