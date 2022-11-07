import { getLocationParams } from "../../utils/index";
import { getTodoById } from "../../api/todo";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    todoInfo: {},
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
    //  检查是圈子还是待办
    const key = getLocationParams("key");
    if (key === "todo") {
      this.GetTodoInfo();
    }
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
  GetTodoInfo() {
    const id = getLocationParams("id");
    this.setData({ loading: true });
    getTodoById({ id })
      .then((res) => {
        this.setData({
          todoInfo: res,
        });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
});
