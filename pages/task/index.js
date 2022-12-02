// pages/list/index.js
import { getLocationParams } from "../../utils/index";
import { getTodoByDate } from "../../api/todo";
import { WE_APP_BASE_API } from "../../env";
import moment from "moment";
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    key: "", // 关键词 todo/ circle / square / search / my-todo / my-circle / my-message / my-square
    from: "", // 来源 只有四个 home / user / circle-detail / todo-detail
    type: "", // 类型 add / edit
    title: "", // 标题
    loading: false, // 页面加载动画
    list: [], // 绑定的列表数据
    emptyMsg: "", // 不同页面 的 查询 空数据 的文案显示
    emptyUrl: "https://img.yzcdn.cn/vant/custom-empty-image.png", // 可配置项 空白页的 显示图片url
    searchValue: "", // 头部搜索框输入值
    selectDate: "", // todo 模式下 头部的选择日期
    searchForm: {
      page: 0,
      limit: 15,
      keyword: "",
    }, // 分页查询条件 用来实现下拉刷新
    refersh: false, // 是否下拉刷新中
    actions: [], // 对应的数组
    description: "", //描述信息，用来替代提示
    total: 0, // 返回的列表数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { key, from, type } = this.GetRouteParam();
    const master = getLocationParams("master");
    // 这个是 检测自己 的圈子下 的待办页面能够有新增按钮
    const expec = key == "my-todo" && from == "circle-detail" && !!master;
    this.setData({
      key,
      from,
      type,
      loading: true,
      // todo/ circle / square / search / my-todo / my-circle / my-message / my-square
      selectDate: moment().format("YYYY-MM-DD"),
    });
    //  设置页面标题
    this.GetTitle();
    // 设置空状态页面
    this.setEmptyMsg();
    this.getTodayToDo();
  },

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
  onPullDownRefresh() {
    const key = this.data.key;
    this.setData(
      {
        refersh: true,
      },
      () => {
        this.getTodayToDo();
      }
    );
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const key = this.data.key;
    const { total, searchForm } = this.data;
    if (total < searchForm.limit) {
      // return Toast.fail("数据已加载完了！");
      return;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  GetAxiosRes(res) {
    // 先结束加载在处理
    const status = this.data.refersh;
    if (status) {
      // 页面下拉刷新
      wx.stopPullDownRefresh({
        success() {
          Toast.success("刷新成功");
          _this.setData({
            refersh: false,
          });
        },
      });
    }
    //  res 为请求返回的结果数据
    var _this = this;
    console.log("我被调用了 res");

    this.setData({
      list: res,
      loading: false,
      total: res.count ?? 0,
    });
  },
  // 获取路由 详情
  GetRouteParam() {
    const type = getLocationParams("type");
    const key = getLocationParams("key");
    const from = getLocationParams("from");
    return {
      type,
      key,
      from,
    };
  },
  GetTitle() {
    const title = this.filterTime();
    this.setData({
      title,
    });
    wx.setNavigationBarTitle({
      title,
    });
  },
  setEmptyMsg() {
    const title = "今日没有待办哦";
    const url = WE_APP_BASE_API + "/public/status/todo_empty.png";
    const emptyUrl = this.data.emptyUrl;
    this.setData({
      emptyMsg: title,
      emptyUrl: url ?? emptyUrl,
    });
  },
  // 头部处理逻辑
  onHeaderSelect(e) {
    const day = e.detail;
    this.setData({
      selectDate: day,
    });
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.filterTime(day),
    });
    // 选择的时候查询当天数据
    this.getTodayToDo();
  },
  filterTime(time = new Date()) {
    const month = [
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十",
      "十一",
      "十二",
    ];
    const day = [
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十",
      "十一",
      "十二",
      "十三",
      "十四",
      "十五",
      "十六",
      "十七",
      "十八",
      "十九",
      "二十",
      "二十一",
      "二十二",
      "二十三",
      "二十四",
      "二十五",
      "二十六",
      "二十七",
      "二十八",
      "二十九",
      "三十",
      "三十一",
    ];
    return `${month[moment(time).month()]}月${day[moment(time).date() - 1]}日`;
  },
  // 根据日期获得当日待办
  getTodayToDo() {
    const param = {
      date: this.data.selectDate,
    };
    this.onStyle(false);
    this.setData({
      loading: true,
    });
    getTodoByDate(param)
      .then((res) => {
        // 统一调用 一个 处理结果的方法把
        this.onStyle(res.length !== 0);
        this.GetAxiosRes(res);
      })
      .finally(() => {
        this.setData({
          loading: false,
        });
      });
  },

  onDetail(e) {
    const url = "/pages/todo-detail/index?id=" + e.detail;
    wx.navigateTo({
      url,
    });
  },
  handleAdd() {
    const id = getLocationParams("id");
    let url = "/pages/add/index?type=add&from=user&id=" + id;
    wx.navigateTo({
      url,
    });
  },
  onStyle(boolean) {
    wx.setNavigationBarColor({
      frontColor: boolean ? "#ffffff" : "#000000",
      backgroundColor: boolean ? app.globalData.primaryColor : "#ffffff",
    });
  },
});
