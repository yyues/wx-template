import { getDetailById } from "../../api/circle";
import { getLocationParams } from "../../utils/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    loading: false,
    type: "user",
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
    const type = getLocationParams("type");
    this.setData({ type });
    // 因为整个页面只会走一个查询的接口，所以就不拆开写了
    const id = getLocationParams("id");
    this.setData({ loading: true });
    getDetailById({ id })
      .then((res) => {
        this.setData({
          data: res,
        });
      })
      .finally(() => {
        this.setData({ loading: false });
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
    const type = getLocationParams("type");
    if (type == "user") {
      wx.redirectTo({
        url: "/pages/my-circle/index",
      });
      return;
    }
    if (type == "publish") {
      wx.navigateBack();
      return;
    }
  },
});
