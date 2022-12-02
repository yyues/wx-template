import { getToken } from "../../utils/action";
import { initTabActive } from "../../utils/index";
import {
  getTodoByDate,
  delayCurrentToDo,
  setTodoClock,
  finishTodo,
} from "../../api/todo";
import moment from "moment";
import Toast from "@vant/weapp/toast/toast";
import { WE_APP_BASE_API } from "../../env";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    hasLogin: false,
    actions: [
      {
        icon: "../../images/home/all.png",
        content: "所有待办",
        name: "fade",
        bgColor: "#753ECF",
        activeColor: "",
        key: "all",
        height: "168rpx",
      },

      {
        icon: "../../images/home/many.png",
        content: "圈子",
        name: "fade",
        bgColor: "#FFAA00",
        activeColor: "",
        key: "circle",
        height: "124rpx",
      },
      {
        icon: "../../images/home/my.png",
        content: "动态",
        name: "fade",
        bgColor: "#1C92D6",
        activeColor: "",
        key: "square",
        height: "124rpx",
      },
      {
        icon: "../../images/home/finish.png",
        content: "消息",
        name: "fade",
        bgColor: "#1C92D6",
        activeColor: "",
        key: "my-message",
        height: "168rpx",
      },
    ],
    currentDay: "今日待办",
    currentWeek: "",
    currentDate: "", // 当前选择的日期，默认是今天
    showDays: false,
    weekList: [],
    list: [],
    loading: false,
    arr: [], // loading 对应的数组
    emptyUrl: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.setData({
      weekList: this.getWeekDayList(),
      currentDate: moment().format("YYYY-MM-DD"),
      emptyUrl: WE_APP_BASE_API + "/public/status/no_login.png",
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    initTabActive.bind(this)(0);
    // 设置 标题 为用户账号
    wx.setNavigationBarTitle({
      title: getToken() ? "o(*￣▽￣*)ブ  " : " (＾－＾)V 登录吧！",
    });
    this.setData({
      showDays: false,
      hasLogin: !!getToken(),
    });
    // 设置当前时间
    this.getCurrentDay();
    // 只有登录了才查询数据
    if (!!getToken()) {
      this.GetToday();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // this.setData({ showDays: false });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // this.setData({ showDays: false });
  },

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
  //
  onSearch() {
    const url = `/pages/list/index?key=search&from=home&type=add`;
    wx.navigateTo({
      url,
    });
  },
  onAction(e) {
    const key = e.currentTarget.dataset.key;
    if (key == "all") {
      wx.navigateTo({
        url: `/pages/list/index?key=todo&from=home&type=${key}`,
      });
      return;
    }
    if (["circle", "square", "my-message"].includes(key)) {
      wx.navigateTo({
        url: `/pages/list/index?key=${key}&from=home&type=${key}`,
      });
      return;
    }
  },
  OnShowDay() {
    const data = this.data.showDays;
    this.setData({
      showDays: !data,
    });
  },
  getCurrentDay(date = new Date()) {
    const array = ["日", "一", "二", "三", "四", "五", "六"];
    const week = moment(date).weekday();
    this.setData({
      currentWeek: "星期" + array[week],
      // currentDay: moment(date).format("MM-DD"),
    });
  },
  getWeekDayList() {
    // 这个日期一定是当天的
    const array = ["日", "一", "二", "三", "四", "五", "六"];
    const start = moment()
      // .subtract(moment().days(), 'days')
      .format("YYYY-MM-DD");

    const arr = [];
    for (let index = 0; index < 7; index++) {
      const data = moment(start).add(index, "days");

      const week = "周" + array[moment(data).days()];
      const day = data.date();
      arr.push({
        week,
        day,
        data: moment(data).format("YYYY-MM-DD"),
      });
    }

    return arr;
  },
  onSelectToday(e) {
    const date = e.currentTarget.dataset.key;
    this.getCurrentDay(date == "today" ? moment().format("YYYY-MM-DD") : date);
    this.setData(
      {
        currentDate: date == "today" ? moment().format("YYYY-MM-DD") : date,
      },
      () => {
        this.GetToday();
      }
    );
  },
  GetToday() {
    this.setData({
      loading: true,
    });
    // 今天可能也有完成的， 要查没有完成的
    getTodoByDate({
      task_status: "running",
      date: this.data.currentDate,
    })
      .then((res) => {
        this.setData({
          list: res,
          arr: new Array(res.length).fill(false),
        });
      })
      .finally(() => {
        this.setData({
          loading: false,
        });
      });
  },
  onDetail() {},
  onFinish(e) {
    const id = e.detail;
    const index = this.data.list.findIndex((i) => i.id == id);
    const arr = this.data.arr;
    arr[index] = true;
    this.setData({
      arr,
    });
    finishTodo({
      id,
    }).then((res) => {
      //  重新走一个请求就行了
      Toast.success({
        message: "完成待办啦！",
        duration: 500,
        onClose: () => {
          this.GetToday();
        },
      });
    });
  },
  handleAdd() {
    wx.navigateTo({
      url: "/pages/add/index",
    });
  },
});
