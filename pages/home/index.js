// pages/home/index.js
import { initTabActive } from "../../utils/index";
import { getToken } from "../../utils/action";
import { getTodoByDate, finishTodo } from "../../api/todo";
import Toast from '@vant/weapp/toast/toast';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    hasLogin: !!getToken(),
    avatar_url: wx.getStorageSync("avatar_url"),
    username: wx.getStorageSync("username"),
    weather_default: "http://43.143.205.208:7001/public/weather/night_bg.png",
    data: [],
    arr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("页面加载");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    initTabActive.bind(this)(0);
    this.setData({
      avatar_url: wx.getStorageSync("avatar_url"),
      username: wx.getStorageSync("username"),
      hasLogin: !!getToken(),
    });
    this.GetToday();
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
  onSearch() {},
  onCancel() {
    this.setData({
      searchValue: "",
    });
  },
  onChange(event) {
    this.setData({
      selectList: event.detail,
    });
    const arr = this.data.todoList.map((i) => event.detail.includes(i.value));
    this.setData({
      current: arr,
    });
  },
  onLogin() {
    wx.navigateTo({
      url: "/pages/login/index",
    });
  },
  onTodo() {
    wx.navigateTo({
      url: "/pages/task/index",
    });
  },
  onCircle() {
    wx.navigateTo({
      url: "/pages/playground/index",
    });
  },
  GetToday() {
    this.setData({ loading: true });
    // 今天可能也有完成的， 要查没有完成的
    getTodoByDate({
      task_status: "running",
    })
      .then((res) => {
        this.setData({
          data: res,
          arr: new Array(res.length).fill(false),
        });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
  onFinish(e) {
    const { id, index } = e.detail;
    //  加载loading
    const arr = this.data.arr;
    arr[index] = true;
    this.setData({ arr });
    finishTodo({ id }).then((res) => {
      //  重新走一个请求就行了
      Toast.success('完成待办啦！')
      this.GetToday();
    });
  },
});
