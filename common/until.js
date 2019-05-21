import store from '@/store/index.js'

let u, info ={};
if (process.env.NODE_ENV === "development") {
  u = "http://192.168.1.1:8090/api";
} else {
  u = "http://192.168.1.1:8090/api";
}
export const baseUrl = u;

const getInfo =()=>{
  let sysInfo={};
  if (!info.model) {
    info.model=uni.getSystemInfoSync().model;
    uni.getLocation({
      success:res=>{
        info.longitude=res.longitude;
        info.latitude=res.latitude;
      },
      fail:(error)=>{
        console.log(error)
      }
    })
  }
  for (let i in info){
    if(info.hasOwnProperty(i)){
      sysInfo[i]=info[i]
    }
  }
 
  uni.getNetworkType({
    success: function(res) {
      sysInfo.network = res.networkType;
    },
    fail:(error)=>{
      console.log(error)
    }
  });
  return sysInfo;
}
const dealSuccess=(res,resolve)=>{
  let result=res.data;
  if(result.code=='998'||result.code=='999'||result.code=='997'){
   store.dispatch('module_0/logOut');
   uni.navigateTo({
   	url:'/pages/login/index',
     complete(){
       setTimeout(()=>{
         uni.showToast({
           title:result.msg,
           icon:'none'
         })
       },200)
     }
   })
  }else{
    resolve(res)
  }
}
export async function getData({
  url,
  type = 'GET',
  data = {},
  dataType = 'json',
  contentType = "application/json",
  header = {}
}) {
  return new Promise((resolve, reject) => {
    // type=type.toUpperCase();
    let default_header = {
      'Accept': 'application/json',
      'content-type': contentType
    }
    let dt=getInfo();
    header = Object.assign(dt,default_header,header);
    if (type.toUpperCase() == "FILE") {
      uni.uploadFile({
        url: baseUrl + url,
        filePath: data.value ? data.value : '',
        fileType: data.fileType ? data.fileType : 'image',
        name: data.key ? data.key : 'file',
        success: (res) => {
          dealSuccess(res,resolve)
        },
        fail: (error) => {
          reject(error)
        }
      })
    } else {
      uni.request({
        url: baseUrl + url,
        data: data,
        method: type,
        dataType: dataType,
        header,
        success: (res) => {
          dealSuccess(res,resolve)
        },
        fail: (error) => {
          reject(error)
        },
        complete:(error)=>{
          // console.log(error)
        }
      })
    }

  })
}

export const isPoneAvailable = (str) => {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}

export const getCountDown = (count) => {
  var h = Math.floor((count) / (1000 * 60 * 60))
  var m = Math.floor((count - h * 1000 * 60 * 60) / (1000 * 60))
  var s = Math.floor((count - h * 1000 * 60 * 60 - m * 1000 * 60) / 1000)
  h = h < 10 ? '0' + h : h,
    m = m < 10 ? '0' + m : m,
    s = s < 10 ? '0' + s : s;
  return (h + ":" + m + ":" + s);
}
export const copy = (text) => {
  var textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = '0';
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    var successful = document.execCommand('copy');
    var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
    uni.showToast({
      title: msg,
      icon: 'none'
    })
  } catch (err) {
    uni.showToast({
      title: '该浏览器不支持点击复制到剪贴板',
      icon: 'none'
    })
  }
  document.body.removeChild(textArea);

}


// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
// 详情查看javascript的数值范围
export const checkIDCard=(idcode)=>{
    // 加权因子
    var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
    // 校验码
    var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];

    var code = idcode + "";
    var last = idcode[17];//最后一个

    var seventeen = code.substring(0,17);

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    var arr = seventeen.split("");
    var len = arr.length;
    var num = 0;
    for(var i = 0; i < len; i++){
        num = num + arr[i] * weight_factor[i];
    }
    
    // 获取余数
    var resisue = num%11;
    var last_no = check_code[resisue];

    // 格式的正则
    // 正则思路
    /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
    var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

    // 判断格式是否正确
    var format = idcard_patter.test(idcode);

    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format ? true : false;
}