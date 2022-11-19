// pages/square/index.js
import { getUserAllCircle } from "../../api/circle";
import { saveSquare } from "../../api/square";
import Toast from "@vant/weapp/toast/toast";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: "add",
    max_content: 99,
    postForm: {
      content: "",
      is_exist_form: false,
      form_id: "",
    },
    user_circle: [], // 用户创建的圈子信息 数组 array
    select_circle: [], // 选中的圈子信息
    bloading: false, // 操作按钮 loading
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: "新建动态",
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
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

  onTaskChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        content: e.detail,
      },
    });
  },
  onExistFormChange(e) {
    const data = this.data.postForm;
    if (e.detail) {
      this.GetUserCirlce();
    }
    this.setData({
      postForm: {
        ...data,
        is_exist_form: e.detail,
      },
    });
  },
  GetUserCirlce() {
    getUserAllCircle({
      status: "published",
    }).then((res) => {
      this.setData({
        user_circle: res,
      });
    });
  },
  onTaskIdChange(e) {
    const id = e.detail;
    const array = this.data.user_circle;
    const data = array.filter((i) => i.id == id)[0];
    console.log(data);
    const postForm = this.data.postForm;
    this.setData({
      postForm: {
        ...postForm,
        form_id: id,
      },
      select_circle: data,
    });
  },
  handleSubmit() {
    const postForm = this.data.postForm;
    const select = this.data.select_circle;
    const param = {
      ...postForm,
      form_type: postForm.is_exist_form ? "circle" : "person",
      form_name: select.name ?? "",
    };
    this.setData({ bloading: true });
    saveSquare(param)
      .the((res) => {
        Toast.success("发布成功！");
        wx.navigateBack();
      })
      .finally(() => {
        this.setData({ bloading: false });
      });
  },
});
