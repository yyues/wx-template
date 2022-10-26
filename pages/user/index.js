// pages/task/index.js
import {
  initTabActive
} from "../../utils/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar_url: wx.getStorageSync('avatar_url'),
    username: wx.getStorageSync('username'),
    top: '1208rpx',
    showAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    initTabActive.bind(this)(4)
    this.setData({
      avatar_url: wx.getStorageSync('avatar_url') || '../../images/avatar_default.png',
      username: wx.getStorageSync('username') || '假如爱有天意'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log('ddd');
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  debounce(fn, ms = 0) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
  },
  onView(e) {
    if (this.data.showAll) return
    this.debounce(this.handleMove(e), 150)
  },
  onPoint(e) {
    this.handleMove(e)
    // this.debounce(this.handleMove(e), 150)
  },
  handleMove(e) {
    const height = e.touches[0].pageY
    const before = Number(this.data.top.replace('rpx', '')) / 2
    // 滑动大于一定距离直接 滑到顶部
    if (before - height > 25) {
      this.setData({
        top: `500rpx`,
        showAll: true
      })
      return
    }
    // 下滑回到原位
    if (before - height < -25) {
      this.setData({
        top: `1208rpx`,
        showAll: false
      })
      return
    }
    // 设置最低位置
    if (height > 600) {
      return
    }
    // 设置上拉最高位置
    if (height <= 250) {
      this.setData({
        top: `500rpx`
      })
      return
    }
    this.setData({
      top: `${height * 2}rpx`,
      showAll: false
    })

  },
  onCircle() {
    wx.navigateTo({
      url: '/pages/circle-detail/index?type=user',
    })
  },
  onTodo() {
    wx.navigateTo({
      url: '/pages/todo-detail/index?type=user',
    })
  }
})