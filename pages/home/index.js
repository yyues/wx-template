// pages/home/index.js
import { initTabActive } from "../../utils/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    searchValue: '',
    reArray: [
      { name: '全部任务', count: 60, some: true, style: 'background:#7c3aed', url: '' },
      { name: '已过期', count: 1, some: false, style: 'background: rgb(231, 125, 125);', url: '' },
      { name: '今日', count: 9, some: false, style: 'background: #4f46e5', url: '' },
      { name: '已完成任务', count: 169, some: true, style: 'background:#0891b2', url: '' },
    ],
    selectList: [],
    todoList: [
      { icon: '', content: '学习', time: '09:00', level: 0, value: 'id0' },
      { icon: '', content: '吃早饭', time: '10:00', level: 0, value: 'id1' },
      { icon: '', content: '绘制油画', time: '11:00', level: 1, value: 'id2' },
      { icon: '', content: '中午睡觉', time: '12:00', level: 2, value: 'id3' },
    ],
    current: []
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
    initTabActive.bind(this)(0)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  onSearch() {

  },
  onCancel() {
    this.setData({
      searchValue: ''
    })
  },
  onChange(event) {
    this.setData({
      selectList: event.detail,
    });
    const arr = this.data.todoList.map(i => event.detail.includes(i.value))
    this.setData({
      current: arr
    })
  }
})