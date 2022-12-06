// pages/more/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{
        title: '使用说明',
        icon: '../../images/home/coffee.png',
        key: 'use-desc',
        bgColor: '#f2f3f5',
        iconWidth: '48rpx'
      },
      {
        title: '关于作者',
        icon: '../../images/author.png',
        key: 'use-desc',
        bgColor: '#f2f3f5',
        iconWidth: '48rpx'
      },
      {
        title: '图标说明',
        icon: '../../images/home/mark.png',
        key: 'use-desc',
        bgColor: '#f2f3f5',
        iconWidth: '48rpx'
      },
      {
        title: '音频说明',
        icon: '../../images/video.png',
        key: 'use-desc',
        bgColor: '#f2f3f5',
        iconWidth: '48rpx'
      },
    ],
    func: [{
        title: '圈子',
        icon: '../../images/home/many.png',
        key: 'circle',
        bgColor: '#f2f3f5',
        iconWidth: '48rpx'
      },
      {
        title: '动态',
        icon: '../../images/square.png',
        key: 'square',
        bgColor: '#f2f3f5',
        iconWidth: '48rpx'
      },
      {
        title: '消息',
        icon: '../../images/message.png',
        key: 'my-message',
        bgColor: '#f2f3f5',
        iconWidth: '48rpx'
      },
      {
        title: '统计',
        icon: '../../images/statist.png',
        key: 'statist',
        bgColor: '#f2f3f5',
        iconWidth: '48rpx'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  onFunc(e) {
    const key = e.currentTarget.dataset.key
    if (key === 'statist') {
      wx.navigateTo({
        url: '/pages/statist/index',
      })
      return
    }
    wx.navigateTo({
      url: `/pages/list/index?from=home&key=${key}&type=`,
    })
  },
  onSay(e) {
    const key = e.currentTarget.dataset.key
    // 展示信息即可
  }
})