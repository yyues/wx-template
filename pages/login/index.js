// pages/login/index.js
import {
  WxLogin
} from "../../utils/action";
import {
  Login
} from "../../utils/index";
import Toast from "@vant/weapp/toast/toast";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    appName: "Tasknow",
    login_bg: `https://picsum.photos/seed/dog/296/526.webp`,
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
  onShow() {},

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
  onClickLeft() {
    wx.switchTab({
      url: "/pages/home/index",
    });
  },
  bindGetUserInfo(e) {
    wx.getUserProfile({
      desc: '获得您的信息，',
      success(res) {
        // 成功后去往原本要去的页面
        const fullPath = getCurrentPages()[0].is;
        WxLogin().then((info) => {
          const param = {
            ...res,
            ...info
          };
          Login(param).then(() => {
            wx.showToast({
              title: "登录成功!",
              icon: "success",
              duration: 1000,
              success() {
                // Loading 动画 做完该做的事情
                if (["pages/home/index", "pages/user/index"].includes(fullPath)) {
                  wx.switchTab({
                    url: `/${fullPath}`,
                  });
                  return
                }
                wx.redirectTo({
                  url: `/${fullPath}`,
                });
              },
            });
          });
        });
      },
      fail(err) {
        console.log(err);
        Toast.fail("出错了哦！");
      }
    })
  },
});