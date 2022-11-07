import { initTabActive } from "../../utils/index";
import Toast from "@vant/weapp/toast/toast";
import moment from "moment";
import { taskSave, getTodoById } from "../../api/todo";
import { getLocationParams } from "../../utils/index";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    show: false,
    showDialog: false,
    timeType: "",
    max_content: 19,
    loading: false,
    btnLoading: false,
    type: "add",
    postForm: {
      execute_time: "",
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
    },
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
    initTabActive.bind(this)(3);
    const type = getLocationParams("type");
    const id = getLocationParams("id");
    this.setData({ type });
    if (type == "edit") {
      //  查详情
      this.getDetail(id);
    }
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
    for (const key in rules) {
      if (!data[key]) {
        return rules[key];
      }
    }
    return true;
  },
  handleSubmit() {
    const param = this.data.postForm;
    const type = this.data.type;
    const res = this.validate(param);
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
            wx.redirectTo({
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
  showTime(e) {
    const data = e.currentTarget.dataset.type;

    this.setData({
      showDialog: true,
      timeType: data,
    });
  },
  onTimeChange(e) {
    const data = this.data.postForm;
    if (this.data.timeType === "start") {
      this.setData({
        postForm: {
          ...data,
          start_time: e.detail,
        },
      });
    }
    if (this.data.timeType === "end") {
      this.setData({
        postForm: {
          ...data,
          end_time: e.detail,
        },
      });
    }
  },
  onCloseDialog() {
    const data = this.data.postForm;
    // this.setData({
    //   postForm: {
    //     ...data,
    //     time: ''
    //   }
    // })
  },
  onTaskChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        content: e.detail,
      },
    });
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
    this.setData({
      postForm: {
        ...data,
        task_type: e.detail,
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
});
