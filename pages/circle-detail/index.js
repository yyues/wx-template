import { getDetailById, JoinCircle } from "../../api/circle";
import { getLocationParams } from "../../utils/index";
import Toast from "@vant/weapp/toast/toast";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    loading: false,
    type: "user",
    showDialog: false,
    dialogConfig: {
      showConfirm: true,
      type: "string", // string image operation
      showCancel: false,
      confirm_function: () => {
        this.setData({ showDialog: false });
      },
      cancel_function: () => {
        this.setData({ showDialog: false });
      },
      width: "640rpx",
      height: "120rpx",
      primary_color: "#5b67ca",
      content: "",
      header: "",
    },
    todoUrl: "",
    CanIsee: false, // 能否直接看微信 ，默认不能
    CanIseeMark: false, // 能否直接看微信备注
    btnLoading: false, // 按钮加载动画
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
          todoUrl: `/pages/list/index?key=my-todo&type=add&from=circle-detail&name=${res.name}&id=${res.id}&master=${res.is_current_user}`,
        });
        // 设置标题
        wx.setNavigationBarTitle({ title: res.name });
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
  onShareAppMessage() {
    var that = this;
    return {
      title: "快进来看看吧", //要请时的卡片头部
      imageUrl:
        "https://image.meiye.art/pic_1628437229638?imageMogr2/thumbnail/450x/interlace/1", //图片地址
      path:
        "/pages/invite/index?type=detail&key=circle&id=" + that.data.data.id, // 用户点击首先进入的当前页面
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      },
    };
  },
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
  showWx() {
    this.setData({
      CanIsee: true,
    });
  },
  copyWx() {
    //  复制微信号
    wx.setClipboardData({
      data: this.data.data.wx_master,
    });
  },
  showMark() {
    this.setData({
      CanIseeMark: true,
    });
  },
  copyMark() {
    //  复制微信号
    wx.setClipboardData({
      data: this.data.data.wx_mark,
    });
  },
  showImage() {
    const config = this.data.dialogConfig;
    const res = this.data.data.wx_image_url;
    this.setData({
      dialogConfig: {
        ...config,
        content: res,
        type: "image",
        height: "480rpx",
        header: "群聊名片",
      },
      showDialog: true,
    });
  },
  handleJoin() {
    this.setData({ btnLoading: true });
    // 走申请，
    const id = this.data.data.id;
    JoinCircle({ id })
      .then((res) => {
        Toast(res.message || "等待审核！");
      })
      .finally(() => {
        this.setData({ btnLoading: false });
      });
  },
});
