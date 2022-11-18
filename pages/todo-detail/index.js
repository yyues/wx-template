// pages/todo-detail/index.js
import Dialog from "@vant/weapp/dialog/dialog";
import { getTodoById, deleteTodoById, delayCurrentToDo } from "../../api/todo";
import { getLocationParams } from "../../utils/index";
import Toast from "@vant/weapp/toast/toast";
import moment from "moment";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    inviteLoading: false,
    data: {},
    type: "user",
    show: false,
    minHour: 0,
    currentDate: "",
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
    this.GetTodoDetail();
    // 获取 类型
    const type = getLocationParams("type");
    this.setData({ type });
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
  onShareAppMessage() {
    const id = getLocationParams("id");

    return {
      title: "分享待办",
      // desc: '快来参加朋友分享的待办吧！',
      path: "/page/share?type=invite&id=" + id, // 路径，传递参数到指定页面。
    };
  },
  GetTodoDetail() {
    const id = getLocationParams("id");
    this.setData({
      loading: true,
    });
    getTodoById({
      id,
    })
      .then((res) => {
        this.setData({
          data: res,
        });
        wx.setNavigationBarTitle({
          title: res.name,
        });
      })
      .finally(() => {
        this.setData({
          loading: false,
        });
      });
  },

  onClose() {
    this.setData({
      show: false,
    });
  },
  changeClock(e) {
    const detail = e.detail;
    const current = this.data.data;
    const _this = this;
    // 走 授权
    wx.requestSubscribeMessage({
      tmplIds: [TEMP_ID],
      success(res) {
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
            _this.setData({ showTime: false });
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
  onEdit() {
    const id = getLocationParams("id");
    wx.navigateTo({
      url: "/pages/add/index?type=edit&from=detail&id=" + id,
    });
  },
  onFinish() {
    const id = getLocationParams("id");
    //  完成 需要 更新状态
    finishTodo({ id }).then((res) => {
      //  重新走一个请求就行了
      Toast.success("完成待办啦！");
      this.onShow();
    });
  },
  onDelay() {
    // 当前操作 默认会延迟一天， 可以传递延迟天数
    const id = getLocationParams("id");
    const param = {
      id,
      num: 1,
    };
    var _this = this;
    delayCurrentToDo(param).then((res) => {
      wx.showToast({
        title: "延迟一天成功",
        duration: 1500,
        icon: "success",
        success() {
          // 需要刷新当前界面
          _this.GetTodoDetail();
        },
      });
    });
  },
  onDelete() {
    const id = getLocationParams("id");
    Dialog.confirm({
      title: "提示",
      message: "确定要删除吗？多人待办删除会影响他人进度哦！",
    })
      .then(() => {
        deleteTodoById({ id }).then((res) => {
          wx.showToast({
            title: "删除成功！",
            icon: "success",
            duration: 1500,
            success() {
              wx.redirectTo({
                url: "/pages/my-todo/index",
              });
            },
          });
        });
      })
      .catch(() => {
        // on cancel
      });
  },
  onClock() {
    //  先关闭底部的弹窗，再打开 dialog
    const { is_exist_remind, execute_time, end_time } = this.data.data;
    const data = this.data.data.is_exist_remind;
    if (is_exist_remind) return;
    // 如果当前时间已经过期了。不能设置
    const start = execute_time + " " + end_time;

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
  onInvite() {
    // 调用微信的转发方法
    Dialog.alert({
      title: "提示",
      message: "点击右上角的按钮就能分享给朋友了！",
    }).then(() => {
      // on close
    });
  },
});
