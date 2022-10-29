// pages/task/index.js
import {
  initTabActive
} from "../../utils/index";
import moment from "moment";
import { getTodoByDate } from "../../api/todo";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    showTime: '',  // 展示时间
    selectDate: '', // 选择时间
    currentDayTask: [],
    currentActive: '',
    finishList: []
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
    initTabActive.bind(this)(1)
    this.setData({
      showTime: this.filterTime(),
      selectDate: moment().format('YYYY-MM-DD')
    })
    //  请求数据
    this.getTodayToDo()
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
    this.getTodayToDo('refresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onClickLeft() {
    wx.switchTab({
      url: '/pages/home/index'
    })
  },
  onSelect(e) {
    const day = e.detail
    this.setData({
      showTime: this.filterTime(day),
      selectDate: day
    })
    // 选择的时候查询当天数据
    this.getTodayToDo()
  },
  filterTime(time = new Date()) {
    const month = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
    const day = [
      '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二',
      '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '二十一', '二十二',
      '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十', '三十一',
    ]
    return `${month[moment(time).month()]}月${day[moment(time).date() - 1]}日`
  },
  getTodayToDo(type) {
    this.setData({
      loading: true
    })
    getTodoByDate({ date: this.data.selectDate }).then(res => {
      this.setData({
        currentDayTask: res
      })
      if (type === 'refresh') {
        // 页面下拉刷新
        wx.stopPullDownRefresh({
          success() {
            wx.showToast({
              title: '刷新成功',
              icon: 'success',
              duration: 1000
            })
          }
        })
      }
    }).finally(() => {
      this.setData({
        loading: false
      })
    })
  },
  handleClick(e) {
    const id = e.detail
    wx.navigateTo({
      url: '/pages/todo-detail/index?id=' + e.detail + '&type=task',
    })
  }
})