// pages/task/index.js
import { getPublicCircle } from "../../api/circle";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    data: [],
    type: "public",
    global: {},
    searchForm: {
      page: 0,
      limit: 10,
      keyword: "",
    },
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
    this.GetList();
    this.setData({
      global: app.globalData,
    });
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
      keyword: "",
    };
    this.setData(
      {
        searchForm: data,
      },
      () => {
        this.GetList("refresh");
      }
    );
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  onAddCircle() {
    wx.navigateTo({
      url: "/pages/circle/index?type=add",
    });
  },
  GetList(type) {
    this.setData({
      loading: true,
    });
    const param = {
      ...this.data.searchForm,
      status: "published",
    };
    const arr = this.data.data;
    getPublicCircle(param)
      .then((res) => {
        const data =
          type && type === "refresh" ? [...res.rows] : [...arr, ...res.rows];
        this.setData({
          data: data,
        });
        if (type && type === "refresh") {
          // 页面下拉刷新
          wx.stopPullDownRefresh({
            success() {
              wx.showToast({
                title: "刷新成功",
                icon: "success",
                duration: 1500,
              });
            },
          });
        }
      })
      .finally(() => {
        this.setData({
          loading: false,
        });
      });
  },
  onClickLeft() {
    wx.switchTab({
      url: "/pages/home/index",
    });
  },
  onDetail(e) {
    const id = e.detail;
    wx.redirectTo({
      url: "/pages/circle-detail/index?type=publish&id=" + id,
    });
  },
});
