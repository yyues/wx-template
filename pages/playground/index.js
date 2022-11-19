// pages/task/index.js
import { getPublicCircle } from "../../api/circle";
import { getPublicSquare } from "../../api/square";
import { getLocationParams } from "../../utils/index";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false, // 加载动画
    data: [], // 请求的数据
    type: "public", // 忘记干啥了， 但和类型是相关的
    global: {}, // 全局数据， 用于后续实现 深色模式的
    searchForm: {
      page: 0,
      limit: 10,
      keyword: "",
    }, // 分页查询条件 用来实现下拉刷新
    from: "", // 来源， 有两种， 一种是圈子， 一种是广场， 广场其实就是相当于动态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const from = getLocationParams("from");
    this.setData({ from });
    wx.setNavigationBarTitle({
      title: from == "square" ? "广场" : "圈子",
    });
    //  还是 统一 走一个方法吧
    this.GetList();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({ global: app.globalData });
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
    this.setData({ searchForm: data }, () => {
      this.GetList("refresh");
    });
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
    // 此时 添加 有两个地方 要去的
    const from = getLocationParams("from");
    if (from == "circle") {
      // 这个是 新增圈子的
      wx.navigateTo({ url: "/pages/circle/index?type=add" });
      return;
    }
    //  这个是 新增 动态的
    wx.navigateTo({ url: "/pages/square/index?type=add" });
  },
  GetList(type) {
    const from = getLocationParams("from");
    this.setData({ loading: true });
    const param = {
      ...this.data.searchForm,
      status: "published",
    };
    // 区分 请求接口
    const fn =
      from == "circle" ? getPublicCircle(param) : getPublicSquare(param);
    const arr = this.data.data;
    fn.then((res) => {
      const data =
        type && type === "refresh" ? [...res.rows] : [...arr, ...res.rows];
      this.setData({ data });
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
    }).finally(() => {
      this.setData({ loading: false });
    });
  },
  onDetail(e) {
    const id = e.detail;
    wx.navigateTo({
      url: "/pages/circle-detail/index?type=publish&id=" + id,
    });
  },
});
