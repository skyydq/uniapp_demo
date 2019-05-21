<template>
  <view class="page">
    <view>
      <view class="feedback-title">
        <text>问题摘要</text>
        <text class="warn">*</text>
      </view>
      <view class="feedback-body ">
        <textarea
          placeholder="如登录注册、网站异常、数据不匹配等"
          v-model="sendDate.titile"
          maxlength="60"
          class="feedback-input"
        />
      </view>
      <view class="feedback-title">
        <text>问题详细描述</text>
        <text class="warn">*</text>
      </view>
      <view class="feedback-body">
        <textarea
          placeholder="详细描述发生问题时的操作步骤和输入信息，方便客服快速定位问题"
          maxlength="300"
          v-model="sendDate.content"
          class="feedback-textare"
        />
      </view>
    </view>
    <!-- <button type="primary" class="feedback-submit" @tap="send">提交</button> -->
  </view>
</template>

<script>
import { suggestionAdd } from '@/common/getData';
export default {
  data() {
    return {
      sendDate: {
        titile: '',
        content: ''
      }
    };
  },
  onNavigationBarButtonTap(e){
    if(e.index==0){
      this.send()
    }
  },
  methods: {
    send() {
      if (!this.sendDate.titile || !this.sendDate.content) {
        uni.showToast({
          title: '请输入内容',
          icon: 'none'
        });
        return false;
      }
      uni.showLoading({
        mask: true
      });
      suggestionAdd(this.sendDate)
        .then(res => {
          let result = res.data;
          if (result.code === '1') {
            this.sendDate = {
              titile: '',
              content: ''
            };
          }
          uni.showToast({
            title: result.msg,
            icon: 'none'
          });
        })
        .catch(() => {
          uni.showToast({
            title: '请求超时，请检查网络',
            icon: 'none'
          });
        });
    }
  }
};
</script>

<style lang="less">
page {
  background-color:  #1A1A24;
}
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.feedback-title {
  color: #fff;
  font-size: 28upx;
  justify-content: flex-start;
}

.feedback-body {
  background-color: #21212b;
  color: #fff;
  .feedback-textare {
    height: 300upx;
  }
  .feedback-textare,
  .feedback-input {
    font-size: 28upx;
  }
}
</style>
