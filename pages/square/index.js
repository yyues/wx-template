// pages/square/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: '新建动态',
    type: 'add',
    max_content: 99,
    postForm: {
      content: '',
      is_exist_form: false
    }
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
  onClickLeft() {
    wx.redirectTo({
      url: '/pages/playground/index'
    })
  },
  onTaskChange(e) {
    const data = this.data.postForm
    this.setData({
      postForm: {
        ...data,
        content: e.detail
      }
    })
  },
  onExistFormChange(e) {
    const data = this.data.postForm
    this.setData({
      postForm: {
        ...data,
        is_exist_form: e.detail
      },
    })
  },
  handleSubmit() {

  }
})