// pages/task/index.js
import initAxios from "../../request/create";
import { initTabActive } from "../../utils/index";
import Toast from "@vant/weapp/toast/toast";
import { WE_APP_BASE_API } from "../../env";
// 获取 全局颜色数据
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatar_url: wx.getStorageSync("avatar_url"),
    username: wx.getStorageSync("username"),
    appDeep: false,
    testUser: false, // 测试账号切换
    global: {}, // 全局数据
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
    initTabActive.bind(this)(2);
    this.setData({
      avatar_url:
        wx.getStorageSync("avatar_url") ||
        "../../images/user/avatar_default.png",
      username: wx.getStorageSync("username") || "Tasknow_9527",
      global: app.globalData,
      testUser: wx.getStorageSync("isTest"),
    });
    // WE_APP_BASE_API +  '/public/user/avatar_default.png'
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
  onReachBottom() {
    console.log("ddd");
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  onDeepChange(e) {
    this.setData({
      appDeep: e.detail,
    });
  },
  onAccountChange(e) {
    if (this.data.testUser && !e.datail) {
      // 说明要退出账号
      wx.redirectTo({
        url: "/pages/login/index?type=reLogin",
      });
      // return
    }
    // 切换账号
    if (e.detail) {
      const test_token =
        "62_kiHSSVOzfySByWKGnn5zDJ0LVrEJgvmLoXF35LZ5Q6ahW47Vbzb0S1-EW8vLN88R4FMtn01-shyyKbcKkyqcTBfOkpA52pL3EQDPD89YEihr1WWmgHCBOgf9LDAMLXBAEGDYU";
      const test_name = "爱意随风起";
      const test_avatar = WE_APP_BASE_API + "/public/preview.jpg";
      wx.setStorageSync("username", test_name);
      wx.setStorageSync("avatar_url", test_avatar);
      wx.setStorageSync("token", test_token);

      initAxios();
      this.onShow();
    }
    wx.setStorageSync("isTest", e.detail);
    this.setData({
      testUser: e.detail,
    });
  },
  clearCache() {
    // 清理本地缓存
    wx.clearStorage();
    //  重置 请求
    initAxios();
    this.onShow();
    Toast.success("清理成功!");
  },
});
