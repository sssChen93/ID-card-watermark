var util = require('../../utils/util.js')

// pages/feedback.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputFocus: false,
    text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      text: '',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '身份证水印',
      path: '/pages/index/index',
      imageUrl: '../../images/shareImage.png'
    }
  },

  textAreaFocus: function(e) {
    this.setData({
      inputFocus: true
    })
  },

  textAreaBlur: function(e) {
    if (this.data.inputFocus == true) {
      this.setData({
        text: e.detail.value,
        inputFocus: false
      })
    };
  },

  textAreaInput: function(e) {
    if (this.data.inputFocus == true) {
      this.setData({
        text: e.detail.value,
      })
    };
  },

  uploadText: function() { 
    // console.log('uploadText start');
    if (this.data.inputFocus) {
      this.setData({
        inputFocus: false
      })
    };    

    let feedback_txt = this.data.text.trim();
    if (!feedback_txt) {
      util.showTips('您还没有输入反馈意见哦');
      return;
    }

    let complete = (is_succ) => {
      wx.hideLoading();
      if (is_succ) {
        util.showTips('提交成功');
      } else {
        util.showTips('提交失败, 请检查网络设置');
      }

    };

    wx.showLoading({ title: '正在提交...', mask: true });
    wx.request({
      url: `https://wxapp.drarea.com/weapp/sfsy_feedback`,
      data: {
        fb_text: this.data.text
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success(result) {
        // console.log(result);
        let resp = result.data;
        // console.log(resp);
        if (resp.code == 0) {
          let res = resp.data;
          // console.log(res);
          complete(true);

        } else {
          console.log('submit feedback fail, resp.code' + resp.code);
          complete(false);
        }

      },

      fail(error) {
        console.log('submit feedback fail', error);
        complete(false);
      }
    });
  }

})