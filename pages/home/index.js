// pages/home/index.js
import {
  initTabActive
} from "../../utils/index";
import {
  getToken
} from "../../utils/action";
import {
  getTodoByDate,
  delayCurrentToDo,
  setTodoClock,
  finishTodo,
} from "../../api/todo";
import Toast from "@vant/weapp/toast/toast";
import moment from "moment";
import {
  TEMP_ID
} from "../../env";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasLogin: !!getToken(),
    username: "",
    data: [], // 今日代办的数据
    arr: [], // loading 对应的状态数组集合
    show: false, // 展示底部弹窗的状态值
    current: {}, // 展示底部弹窗对应的待办
    showTime: false, // 设置提醒时间的dialog 状态值
    currentDate: "",
    minHour: "",
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
      hasLogin: !!getToken()
    });
    // 设置 标题 为用户账号
    wx.setNavigationBarTitle({
      title: !!getToken() ? wx.getStorageSync("username") : "Hi!请先登录",
    });
    //  查询今日待办
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
  onShareAppMessage: function (res) {
    var that = this;
    return {
      title: "快进来看看吧", //要请时的卡片头部
      imageUrl: "https://image.meiye.art/pic_1628437229638?imageMogr2/thumbnail/450x/interlace/1", //图片地址
      path: "/pages/invite/index?type=home&key=todo&id=" + that.data.current.id, // 用户点击首先进入的当前页面
      success: function (res) {
        // 转发成功
        Toast.success("转发成功！！！");
      },
      fail: function (res) {
        // 转发失败
        Toast.fail("转发失败！");
      },
    };
  },
  onSearch(e) {
    const url = `/pages/list/index?key=search&from=home&type=add`
    wx.navigateTo({
      url,
    });
  },
  onCancel() {
    this.setData({
      searchValue: "",
    });
  },
  onTodo() {
    const url = `/pages/list/index?key=todo&from=home&type=add`
    wx.navigateTo({
      url,
    });
  },
  onCircle() {
    const url = `/pages/list/index?key=circle&from=home&type=add`
    wx.navigateTo({
      url,
    });
  },
  onSquare() {
    const url = `/pages/list/index?key=square&from=home&type=add`
    wx.navigateTo({
      url,
    });
  },
  GetToday() {
    this.setData({
      loading: true
    });
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
        this.setData({
          loading: false
        });
      });
  },
  onFinish(e) {
    const {
      id,
      index
    } = e.detail;
    //  加载loading
    const arr = this.data.arr;
    arr[index] = true;
    this.setData({
      arr
    });
    finishTodo({
      id
    }).then((res) => {
      //  重新走一个请求就行了
      Toast.success("完成待办啦！");
      this.GetToday();
    });
  },
  onDetail(e) {
    const {
      id,
      index
    } = e.detail;
    const res = this.data.data[index];
    // 展开 底部操作栏
    this.setData({
      show: true,
      current: {
        ...res,
        isOut: moment().isAfter(res.execute_time + " " + res.end_time),
      },
    });
  },
  hidenAction() {
    this.setData({
      show: false
    });
  },
  onEdit() {
    const {
      id
    } = this.data.current;
    wx.navigateTo({
      url: "/pages/add/index?type=edit&id=" + id,
    });
  },
  onClock() {
    //  先关闭底部的弹窗，再打开 dialog
    // 如果已经设置过了。不可再设置
    const data = this.data.current.is_exist_remind;
    if (data) return;
    // 如果当前时间已经过期了。不能设置
    const start =
      this.data.current.execute_time + " " + this.data.current.end_time;
    if (moment().isAfter(start))
      return Toast.fail({
        zIndex: "99999",
        message: "待办已经到期了哦！",
      });
    this.setData({
      showTime: true,
      show: false,
      minHour: moment().hours(),
      currentDate: moment().format("HH:mm"),
    });
  },
  changeClock(e) {
    const detail = e.detail;
    const current = this.data.current;
    const _this = this;
    // 走 授权
    wx.requestSubscribeMessage({
      tmplIds: [TEMP_ID],
      success(res) {
        _this.setData({
          showTime: false
        });
        if (res[TEMP_ID] === "accept") {
          setTodoClock({
            id: current.id,
            remind_time: current.execute_time + " " + detail,
          }).then(() => {
            Toast.success({
              zIndex: "99999",
              message: "设置成功！",
            });
            _this.GetToday();
            _this.setData({
              showTime: false
            });
          });
        } else {
          Toast.fail({
            zIndex: "99999",
            message: "失败了呢",
          });
        }
      },
      fail() {},
    });
  },
  onClose() {
    this.setData({
      showTime: false
    });
  },
  onDelay() {
    const id = this.data.current.id;
    const param = {
      id,
      num: 1,
    };
    var _this = this;
    delayCurrentToDo(param).then((res) => {
      _this.setData({
        show: false,
      });
      Toast.success({
        zIndex: "99999",
        message: "明天要完成哦！",
        success() {
          // 需要刷新当前界面
          _this.GetToday();
        },
      });
    });
  },
  toInvite() {
    wx.navigateTo({
      url: '/pages/invite/index',
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  }
});