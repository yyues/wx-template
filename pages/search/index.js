// pages/search/index.js
import { getLocationParams } from "../../utils/index";
import { findAllTodo } from "../../api/todo";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "",
    list: [],
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const keyword = getLocationParams("keyword");
    this.setData({ searchValue: keyword });
    if (keyword) {
      this.GetList();
    }
     // 查询用户创建的 圈子
     this.GetUserCirlce();
  },

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
  backPage() {
    wx.navigateBack();
  },
  onSearch(e) {
    //  走接口了
    this.setData({ searchValue: e.detail }, () => {
      this.GetList();
    });
  },
  onCancel() {
    this.setData({
      searchValue: "",
    });
  },
  GetList() {
    const param = {
      keyword: this.data.searchValue,
    };
    this.setData({ loading: true });
    findAllTodo(param)
      .then((res) => {
        this.setData({ list: res });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
  handleClick(e) {
    wx.navigateTo({
      url:
        "/pages/todo-detail/index?id=" + e.detail + "&type=" + this.data.type,
    });
  },
});
