// pages/task/index.js
import {
  initTabActive
} from "../../utils/index";
import { WE_APP_BASE_API } from "../../env";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar_url: wx.getStorageSync('avatar_url'),
    username: wx.getStorageSync('username'),
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
      avatar_url: wx.getStorageSync('avatar_url') ||   '../../images/user/avatar_default.png',
      username: wx.getStorageSync('username') || 'Tasknow_9527'
    })
    // WE_APP_BASE_API +  '/public/user/avatar_default.png'
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
  onCircle() {
    wx.navigateTo({
      url: '/pages/my-circle/index?type=user',
    })
  },
  onTodo() {
    wx.navigateTo({
      url: '/pages/my-todo/index?type=user',
    })
  }
})