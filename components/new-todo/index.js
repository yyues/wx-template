// components/new-todo/index.js
import Dialog from "../../utils/dialog";
import moment from "moment";
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      default: false
    }, // 是否展示
  },
  /**
   * 组件的初始数据
   */
  data: {
    headers: [], // color content icon close key 构成的数组对象
    postForm: {
      is_deadline: true,
      level: 0,
      task_cycle: 1,
      content: '',
    }, // 提交的数据
    placeholderStyle: "",
    primaryColor: "",
    loading: false,
    actions: [{
        url: "./img/calendar.png",
        key: "execute_time"
      },
      {
        url: "./img/remind.png",
        key: "remind_time"
      },
      {
        url: "./img/level.png",
        key: "level"
      },
      {
        url: "./img/multiplayer.png",
        key: "is_multiplayer"
      },
      {
        url: "./img/cycle.png",
        key: "is_cycle_todo"
      },
    ], // url, key
    currentKey: "", // 操作栏当前绑定的 key 用于区分不同的弹窗显示内容
    showAction: false,
    currentDate: "", // 待办 的完整 时间 ，也是默认 是截止时间的
    minDate: "", // 只能是 现在的时间
    maxDate: "", // 可选择的最大 时间， 默认三个月
    minHour: "", // 可选择的最小时间
    level: [], // 优先级选择
    showTime: false,
    filter(type, options) {
      const obj = {
        minute: "分",
        hour: "时",
        day: "天",
        month: "月",
        year: "年",
      };
      if (obj[type]) {
        return options.map((i) => `${i}${obj[type]}`);
      }
      return options;
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭
    onClickHide() {
      // 谈一个提示
      const info = {
        title: "提示",
        message: "离开后不会保存所做的修改哦！",
      };
      Dialog.confirm(info)
        .then(() => {
          this.setData({
            showAction: false,
            currentKey: ''
          });
          this.triggerEvent("close");
        })
        .catch(() => {});
    },
    changeByKey(e) {
      const postForm = this.data.postForm;
      const key = e.currentTarget.dataset.key;
      if (["content"].includes(key)) {
        postForm[key] = e.detail;
      } else {
        const data = !!postForm[key];
        postForm[key] = !data;
      }
      this.setData({
        postForm
      });
    },
    //  点击 操作图标的 事件
    onAction(e) {
      const key = e.currentTarget.dataset.key;
      this.setData({
        currentKey: key
      });
      if (this.data.showAction) {
        this.setData({
          showAction: false,
        })
        return
      }
      const postForm = this.data.postForm;
      if (key == "is_multiplayer") {
        //  单独处理多人任务
        const res = !!postForm[key];
        postForm[key] = !res;
        this.setData({
          postForm,
          showAction: false
        });
        return;
      }
      if (["execute_time", "remind_time"].includes(key)) {
        this.setData({
          showTime: true
        });
        return;
      }
      if (["level", "is_cycle_todo"].includes(key)) {
        this.setData({
          showAction: true
        });
        return;
      }
      this.setData({
        showAction: false
      });
    },
    onActionConfirm() {},
    onActionClose() {
      this.setData({
        showAction: false,
        currentKey: "",
        showTime: false
      });
    },
    onCycleChange(e) {
      const data = Number(e.detail)
      console.log({
        data
      });
      const postForm = this.data.postForm
      this.setData({
        postForm: {
          ...postForm,
          task_cycle: data
        }
      })
    }
  },
  lifetimes: {
    ready() {
      const textHeaderColor = app.globalData.primarySecondTextColor;
      const primaryColor = app.globalData.primaryColor;
      this.setData({
        placeholderStyle: `color: rgba(${textHeaderColor}, 0.69)`,
        primaryColor,
        minDate: new Date().getTime(),
        maxDate: Number(moment().add(3, "months").format("x")),
        minHour: moment().hour() + 1,
        level: [{
            name: 0,
            content: "低",
            color: primaryColor
          },
          {
            name: 1,
            content: "中",
            color: primaryColor
          },
          {
            name: 2,
            content: "高",
            color: primaryColor
          },
          {
            name: 3,
            content: "紧急",
            color: primaryColor
          },
        ],
      });
    },
  },
});