const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: "假如爱有天意",
    avatarUrl: "../../images/user/avatar_default.png",
    primaryColor: "",
    hasFinishSound: false,
    hasAutoOrder: false,
    hasTop: false,
    uid: "100086",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    wx.setNavigationBarColor({
      backgroundColor: app.globalData.primaryColor,
      frontColor: "#ffffff",
    });
    this.setData({
      primaryColor: app.globalData.primaryColor,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (wx.getStorageSync("username")) {
      this.setData({
        userName: wx.getStorageSync("username"),
      });
    }
    if (wx.getStorageSync("avatar_url")) {
      this.setData({
        avatarUrl: wx.getStorageSync("avatar_url"),
      });
    }
    if (wx.getStorageSync("uid")) {
      this.setData({
        uid: wx.getStorageSync("uid"),
      });
    }
    this.setData({
      hasFinishSound: wx.getStorageSync('hasFinishSound')
    })
    app.globalData.hasFinishSound = wx.getStorageSync('hasFinishSound')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},
  onSoundChange(e) {
    const value = e.detail;
    this.setData({
      hasFinishSound: value
    });
    app.globalData.hasFinishSound = value
    wx.setStorageSync('hasFinishSound', value)
  },
  onOrderChange(e) {
    const value = e.detail;
    this.setData({
      hasAutoOrder: value
    });
  },
  onTopChange(e) {
    const value = e.detail;
    this.setData({
      hasTop: value
    });
  },
});