// pages/home/index.js
import { initTabActive } from '../../utils/index'
import { getToken } from '../../utils/action'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    hasLogin: !!getToken(),
    avatar_url: wx.getStorageSync('avatar_url'),
    username: wx.getStorageSync('username'),
    weather_default: 'http://192.168.1.166:7001/public/weather/night_bg.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('页面加载')
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    initTabActive.bind(this)(0)
    this.setData({
      avatar_url: wx.getStorageSync('avatar_url'),
      username: wx.getStorageSync('username'),
      hasLogin: !!getToken()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  onSearch() {},
  onCancel() {
    this.setData({
      searchValue: ''
    })
  },
  onChange(event) {
    this.setData({
      selectList: event.detail
    })
    const arr = this.data.todoList.map((i) => event.detail.includes(i.value))
    this.setData({
      current: arr
    })
  }
})
