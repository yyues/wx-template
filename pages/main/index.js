import {
  getToken
} from "../../utils/action";
import {
  initTabActive
} from "../../utils/index";
import {
  getTodoByDate,
  taskSave,
  finishTodo,
} from "../../api/todo";
import Sound from '../../utils/sound';
import moment from "moment";
import Toast from "@vant/weapp/toast/toast";

const app = getApp()
import {
  WE_APP_BASE_API
} from "../../env";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: "",
    hasLogin: false,
    actions: [{
        icon: "../../images/home/all_white.png",
        content: "所有待办",
        name: "fade",
        bgColor: "#753ECF",
        activeColor: "",
        key: "my-todo",
        height: "256rpx",
      },

      {
        icon: "../../images/home/static.png",
        content: "统计",
        name: "fade",
        bgColor: "#FFAA00",
        activeColor: "",
        key: "statist",
        height: "200rpx",
      },
      {
        icon: "../../images/action/flag.png",
        content: "消息",
        name: "fade",
        bgColor: "#5776F2",
        activeColor: "",
        key: "my-message",
        height: "200rpx",
      },
      {
        icon: "../../images/home/tmore.png",
        content: "更多",
        name: "fade",
        bgColor: "#1C92D6",
        activeColor: "",
        key: "more",
        height: "256rpx",
      },
    ],
    currentDay: "今日待办",
    currentWeek: "",
    currentDate: "", // 当前选择的日期，默认是今天
    showDays: false,
    weekList: [],
    list: [],
    loading: false,
    emptyUrl: "",
    sound: null,
    showTime: false,
    currentId: '',
    minHour: 0,
    minMinute: 0,
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
    if (app.globalData.hasFinishSound) {
      const url = WE_APP_BASE_API + '/public/sound/finish.mp3'
      this.setData({
        sound: new Sound(url)
      }, () => {
        this.data.sound.init()
      })
    } else {
      this.setData({
        sound: ''
      })
    }
    this.setData({
      showTime: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // this.setData({ showDays: false });
  },

  //
  onSearch() {
    const url = `/pages/list/index?key=search&from=home&type=add`;
    wx.navigateTo({
      url,
    });
  },
  onAction(e) {
    const key = e.currentTarget.dataset.key;
    if (key == "my-todo") {
      wx.navigateTo({
        url: `/pages/list/index?key=my-todo&from=home`,
      });
      return;
    }
    if (key == 'statist') {
      wx.navigateTo({
        url: '/pages/statist/index',
      })
      return
    }
    if (key == 'more') {
      wx.navigateTo({
        url: '/pages/more/index',
      })
      return
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
    // this.setData({
    //   showDays: !data,
    // });
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
    this.setData({
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
          list: res
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
    const id = e.currentTarget.dataset.id
    finishTodo({
      id,
    }).then((res) => {
      //  重新走一个请求就行了
      if (this.data.sound) {
        this.data.sound.play()
      }
      Toast.success({
        message: "完成待办啦！",
        duration: 500,
        onClose: () => {
          if (this.data.sound) {
            this.data.sound.stop()
          }
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
  onFlag(e) {
    // 为待办设置旗帜
    const id = e.currentTarget.dataset.id
    const data = this.data.list.filter(i => i.id === id)[0]
    if (data.icon_type === 'flag') return Toast.fail('已有旗帜了！')
    taskSave({
      id,
      icon_type: 'flag'
    }).then(() => {
      Toast({
        type: 'success',
        message: '设置旗帜成功',
        onClose: () => {
          this.GetToday()
        },
      });
    })
  },
  onClock(e) {
    const id = e.currentTarget.dataset.id
    const data = this.data.list.filter(i => i.id == id)[0]
    if (data.is_exist_remind) return Toast.fail('已设置过提醒')
    // 设置时间
    this.setData({
      showTime: true,
      currentId: id,
      minHour: moment().hour() + 1,
      minMinute: moment().minute(),
    })
  },
  onCloseDialog() {
    this.setData({
      showTime: false,
      currentId: ''
    })
  },
  onTimeChange(e) {
    const time = e.detail
    const id = this.data.currentId
    const param = {
      id,
      is_exist_remind: true,
      remind_time: moment().format('YYYY-MM-DD') + ' ' + time
    }
  }
});