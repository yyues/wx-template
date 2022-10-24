import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: '新建圈子',
    type: 'add',
    fileList: [],
    loading: false,

    postForm: {
      name: '',
      content: '',
      avatar_url: '',
      is_timing_publish: false,
      publish_time: 0
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
  handleSubmit() {

  },
  onChange(e) {
    const data = this.data.postForm
    this.setData({
      postForm: {
        ...data,
        is_timing_publish: e.detail
      }
    })
  },
  onTaskChange(e) {
    const data = this.data.postForm
    this.setData({
      postForm: {
        ...data,
        name: e.detail
      }
    })
  },
  onClickLeft() {
    wx.redirectTo({
      url: '/pages/playground/index'
    })
  },
  // 上传逻辑接口
  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: { user: 'test' },
      success(res) {
        // 上传完成需要更新 fileList
        const { fileList = [] } = this.data;
        fileList.push({ ...file, url: res.data });
        this.setData({ fileList });
      },
    });
  }
})