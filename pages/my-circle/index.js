import { getUserAllCircle } from "../../api/circle";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    searchForm: {
      page: 0,
      limit: 10,
      keyword: "",
    },
    currentList: [],
    beforeList: [],
    show: false,
    currentData: {},
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
    //  不过要先把 旧数据 清空了，防止回到该页面的时候重新请求造成数据重复
    this.setData({
      currentList: [],
    });
    // 渲染时请求数据
    this.GetList();
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
  // 列表查询接口
  GetList(type) {
    const param = {
      ...this.data.searchForm,
    };
    const arr = this.data.currentList;
    //  保留请求前的旧数据
    this.setData({
      beforeList: arr,
      loading: true,
    });
    getUserAllCircle(param)
      .then((res) => {
        // 更新数据
        const data = type && type === "refresh" ? [...res] : [...arr, ...res];
        this.setData({
          currentList: data,
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
      url: "/pages/user/index",
    });
  },
  onClick(e) {
    const data = this.data.currentList[e.detail];
    //  打开底部操作栏
    this.setData({ show: true, currentData: data });
  },
  hidenAction() {
    this.setData({ show: false });
  },
  onPublish() {
    //  先关闭弹窗再显示
    this.setData({ show: false });
    const id = this.data.currentData.id;
    wx.redirectTo({
      url: "/pages/circle/index?type=publish&id=" + id,
    });
  },
  onEdit() {
    this.setData({ show: false });
    const id = this.data.currentData.id;
    wx.redirectTo({
      url: "/pages/circle/index?type=edit&id=" + id,
    });
  },
  onDetail(e) {
    const id = e.detail;
    console.log("QAQ", id);
    wx.redirectTo({
      url: "/pages/circle-detail/index?type=user&id=" + id,
    });
  },
});
