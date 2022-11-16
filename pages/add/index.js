import Toast from "@vant/weapp/toast/toast";
import moment from "moment";
import { taskSave, getTodoById } from "../../api/todo";
import { getLocationParams } from "../../utils/index";
import { getUserAllCircle } from "../../api/circle";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    show: false,
    showDialog: false,
    timeType: "", // 选择的是开始时间还是结束时间
    max_content: 19,
    loading: false,
    btnLoading: false,
    type: "add",
    label: "", // 输入的标签数据
    postForm: {
      execute_time: moment().format("YYYY-MM-DD"),
      start_time: "",
      end_time: "",
      description: "",
      level: 0,
      content: "",
      task_type: "person",
      is_long_todo: false,
      is_cycle_todo: false,
      is_multiplayer: false,
      task_cycle: 1,
      labels: [],
    },
    user_circle: [], // 用户所拥有的 圈子且是公开的
    minHour: 0, // 可选择的最小时间
    minMinute: 0, // 可选择的最小分钟
    global: {},
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
    const id = getLocationParams("id");
    this.setData({
      type: type ?? "add",
      global: app.globalData,
    });
    if (type == "edit") {
      //  查详情
      this.getDetail(id);
    }
    if (type == "my-todo") {
      const postForm = this.data.postForm;
      this.setData({
        postForm: {
          ...postForm,
          task_type: "private",
        },
      });
    }
    this.GetUserCirlce();
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
  validate(data) {
    const rules = {
      content: "请输入待办内容!",
      execute_time: "请选择日期！",
      start_time: "请选择开始时间！",
      end_time: "请选择结束时间！",
    };
    //  这个是必须的
    for (const key in rules) {
      if (key == "start_time") {
        // 单独处理开始时间，在选择是截止时间的时候可以不传开始时间
        if (data.is_deadline) return true;
        if (!data[key]) return rules[key];
        return;
      }
      if (!data[key]) {
        return rules[key];
      }
    }
    if (data.task_type == "private") {
      //  选择公开任务类型的时候，会关联到对应的圈子
      if (!data.task_from_id) return "公开待办必须关联到一个自己的圈子";
    }
    return true;
  },
  handleSubmit() {
    const param = this.data.postForm;
    const type = this.data.type;

    const res = this.validate(param);
    if (
      this.data.postForm.task_type == "private" &&
      this.data.user_circle.length == 0
    ) {
      return Toast.fail("需要圈子哦！");
    }
    if (res !== true) {
      return Toast(res);
    }
    this.setData({
      btnLoading: true,
    });
    taskSave(param)
      .then((res) => {
        Toast({
          type: "success",
          message: type == "add" ? "创建成功！" : "保存成功！",
          onClose: () => {
            wx.switchTab({
              url: "/pages/home/index",
            });
          },
        });
      })
      .finally(() => {
        this.setData({
          btnLoading: false,
        });
      });
  },
  onClickLeft() {
    wx.navigateBack();
  },
  onChange() {},
  showCalender() {
    this.setData({
      show: true,
    });
  },
  onConfirm(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        execute_time: moment(e.detail).format("YYYY-MM-DD"),
      },
      show: false,
    });
  },
  onClose() {
    this.setData({
      show: false,
    });
  },
  onInput(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        time: e.detail,
      },
    });
  },
  onDealineChange(e) {
    const data = this.data.postForm;
    //  检测是不是今天，今天的话就把最小时间限制到当前
    console.log(data);
    const isToday = data.execute_time === moment().format("YYYY-MM-DD");
    this.setData({
      postForm: {
        ...data,
        is_deadline: e.detail,
        start_time: e.detail ? "" : data.start_time,
      },
      minHour: isToday ? moment().hour() : 0,
      minMinute: isToday ? moment().minute() : 0,
    });
  },
  showTime(e) {
    const data = e.currentTarget.dataset.type;
    //  检测是不是今天，今天的话就把最小时间限制到当前
    const isToday =
      this.data.postForm.execute_time === moment().format("YYYY-MM-DD");

    this.setData({
      showDialog: true,
      timeType: data,
      minHour: isToday ? moment().hour() : 0,
      minMinute: isToday ? moment().minute() : 0,
    });
  },
  onTimeChange(e) {
    const data = this.data.postForm;
    const type = this.data.timeType;
    if (type === "start") {
      this.setData({
        postForm: {
          ...data,
          start_time: e.detail,
        },
      });
    }
    if (type === "end") {
      this.setData({
        postForm: {
          ...data,
          end_time: e.detail,
        },
      });
    }
    // 赋值完后 关闭弹窗
    this.onCloseDialog();
  },
  onCloseDialog() {
    this.setData({
      showDialog: false,
    });
  },
  onTaskChange(e) {
    const data = this.data.postForm;
    this.setData(
      {
        postForm: {
          ...data,
          content: e.detail,
        },
      },
      () => {
        console.log(this.data.postForm);
      }
    );
  },
  onDescChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        description: e.detail,
      },
    });
  },
  onLevelChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        level: e.detail,
      },
    });
  },
  onTaskTypeChange(e) {
    const data = this.data.postForm;
    if (e.detail == "private" && this.data.user_circle.length == 0) {
      this.GetUserCirlce();
    }
    // 清空 postForm 里的归属id
    this.setData({
      postForm: {
        ...data,
        task_type: e.detail,
        task_from_id: e.detail !== "private" ? "" : data.task_from_id,
      },
    });
  },
  onTaskIdChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        task_from_id: e.detail,
      },
    });
  },
  onLongTaskChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        is_long_todo: e.detail,
      },
      max_content: 99,
    });
  },
  onCycleTaskChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        is_cycle_todo: e.detail,
      },
    });
  },
  onMultiplayTaskChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        is_multiplayer: e.detail,
      },
    });
  },
  onTaskCycleChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        task_cycle: e.detail,
      },
    });
  },
  onLabelChange(e) {
    const data = e.detail;
    const postForm = this.data.postForm;
    if (postForm.labels.length >= 3) return Toast("最多三个哦！不能再添加了！");
    postForm.labels.push(data);
    this.setData({
      postForm,
      label: "",
    });
  },
  onLabelClose(e) {
    const index = e.currentTarget.dataset.index;
    const postForm = this.data.postForm;
    postForm.labels.splice(index, 1);
    this.setData({
      postForm,
    });
  },
  getDetail(id) {
    this.setData({
      loading: true,
    });
    getTodoById({
      id,
    })
      .then((res) => {
        this.setData({
          postForm: res,
        });
      })
      .finally(() => {
        this.setData({
          loading: false,
        });
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
});
