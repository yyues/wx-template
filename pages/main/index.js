import { getToken } from '../../utils/action'
import { initTabActive } from '../../utils/index'
import moment from 'moment'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    hasLogin: false,
    actions: [
      {
        icon: '../../images/home/all.png',
        content: '所有待办',
        name: 'fade',
        bgColor: '#F2F3F5',
        activeColor: '',
        key: 'all'
      },
      {
        icon: '../../images/home/my.png',
        content: '我的待办',
        name: 'fade',
        bgColor: '#F2F3F5',
        activeColor: '',
        key: 'my'
      },
      {
        icon: '../../images/home/many.png',
        content: '多人待办',
        name: 'fade',
        bgColor: '#F2F3F5',
        activeColor: '',
        key: 'more'
      },
      {
        icon: '../../images/home/finish.png',
        content: '已完成的',
        name: 'fade',
        bgColor: '#F2F3F5',
        activeColor: '',
        key: 'finish'
      }
    ],
    currentDay: '今日待办',
    currentWeek: '',
    showDays: false,
    weekList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.setData({ weekList: this.getWeekDayList() })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    initTabActive.bind(this)(0)
    // 设置 标题 为用户账号
    wx.setNavigationBarTitle({
      title: getToken() ? 'o(*￣▽￣*)ブ  ' : ' (＾－＾)V 登录吧！'
    })
    this.setData({ showDays: false })

    // 设置当前时间
    this.getCurrentDay()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // this.setData({ showDays: false });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // this.setData({ showDays: false });
  },

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
  //
  onSearch() {
    const url = `/pages/list/index?key=search&from=home&type=add`
    wx.navigateTo({ url })
  },
  onAction(e) {
    const key = e.currentTarget.dataset.key
    const url = `/pages/list/index?key=todo&from=home&type=${key}`
    wx.navigateTo({ url })
  },
  OnShowDay() {
    const data = this.data.showDays
    this.setData({ showDays: !data })
  },
  getCurrentDay(date = new Date()) {
    const array = ['日', '一', '二', '三', '四', '五', '六']
    const week = moment(date).weekday()
    this.setData({
      currentWeek: '星期' + array[week]
      // currentDay: moment(date).format("MM-DD"),
    })
  },
  getWeekDayList() {
    // 这个日期一定是当天的
    const array = ['日', '一', '二', '三', '四', '五', '六']
    const start = moment()
      .subtract(moment().days(), 'days')
      .format('YYYY-MM-DD')

    const arr = []
    for (let index = 0; index < 7; index++) {
      const data = moment(start).add(index, 'days')
      const week = '周' + array[index]
      const day = data.date()
      arr.push({
        week,
        day
      })
    }

    return arr
  }
})
