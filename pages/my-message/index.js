import {
  getUserAllTodo
} from '../../api/todo'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    searchForm: {
      page: 0,
      limit: 10,
      keyword: ''
    },
    currentList: [],
    beforeList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 渲染时请求数据
    this.GetList()
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
  onPullDownRefresh() {
    const data = {
      page: 0,
      limit: 10,
      keyword: ''
    }
    this.setData({
        searchForm: data
      },
      () => {
        this.GetList('refresh')
      }
    )
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  // 列表查询接口
  GetList(type) {
    const param = {
      ...this.data.searchForm
    }
    const arr = this.data.currentList
    //  保留请求前的旧数据
    this.setData({
      beforeList: arr,
      loading: true
    })
    getUserAllTodo(param).then((res) => {
      // 更新数据
      const data = type && type === 'refresh' ? [...res.rows] : [...arr, ...res.rows]
      this.setData({
        currentList: []
      })
      if (type && type === 'refresh') {
        // 页面下拉刷新
        wx.stopPullDownRefresh({
          success() {
            wx.showToast({
              title: '刷新成功',
              icon: 'success',
              duration: 1500
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
  onClickLeft() {
    wx.switchTab({
      url: '/pages/user/index',
    })
  },

})