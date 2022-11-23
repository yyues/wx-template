// pages/todo-detail/index.js
import Dialog from "../../utils/dialog";
import { getTodoById, deleteTodoById, delayCurrentToDo } from "../../api/todo";
import { getLocationParams } from "../../utils/index";
import Toast from "@vant/weapp/toast/toast";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    data: {},
    type: "user",
    actions: [], // 操作列表
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 获取 类型
    const type = getLocationParams("type");
    this.setData({ type });
    this.GetTodoDetail();
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
  onActionClose() {
    this.setData({
      show: false,
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
      title: "删除",
      message: "确定要删除吗？\n多人待办删除会影响他人进度哦！",
    })
      .then(() => {
        deleteTodoById({ id }).then((res) => {
          wx.showToast({
            title: "删除成功！",
            icon: "success",
            duration: 1500,
            success() {
              wx.navigateBack({
                delta: 0,
              });
            },
          });
        });
      })
      .catch(() => {
        // on cancel
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
  onActionSelect(e) {
    const obj = e.detail;
    console.log({ obj });
    if (obj.name == "编辑") {
      this.onEdit();
    }
    if (obj.name == "延至明日") {
      this.onDelay();
    }
    if (obj.name == "删除") {
      this.onDelete();
    }
  },
  showAction() {
    const { is_exist_remind } = this.data.data;
    const actions = [
      { name: "延至明日", color: "#ca8a04", loading: false, disabled: false },
      { name: "编辑", color: "#5b67ca", loading: false, disabled: false },
      { name: "删除", color: "#ef4444", loading: false, disabled: false },
    ];
    if (is_exist_remind) {
      actions.shift();
    }
    this.setData({
      actions,
      show: true,
    });
  },
});
