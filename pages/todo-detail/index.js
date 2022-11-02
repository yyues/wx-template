// pages/todo-detail/index.js
import Dialog from '@vant/weapp/dialog/dialog';
import {
  getTodoById,
  deleteTodoById,
  delayCurrentToDo
} from "../../api/todo";
import {
  getLocationParams
} from "../../utils/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    inviteLoading: false,
    data: {},
    type: 'user',
    header: '',
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.GetTodoDetail()
    // 获取 类型
    const type = getLocationParams('type')
    this.setData({ type })
    // 自定义样式
    const data = this.data.data
    this.setData({
      header: data.bg_url ? ` background-image: url(${data.bg_url})` : '' + data.primary_color ? ` color: ${data.bg_url}` : ''
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    const id = getLocationParams('id')

    return {
      title: '分享待办',
      // desc: '快来参加朋友分享的待办吧！',
      path: '/page/share?type=invite&id=' + id // 路径，传递参数到指定页面。
    }

  },
  GetTodoDetail() {
    const id = getLocationParams('id')
    this.setData({
      loading: true
    })
    getTodoById({
      id
    }).then(res => {
      this.setData({
        data: res
      })
    }).finally(() => {
      this.setData({
        loading: false
      })
    })

  },
  onClickLeft() {
    const type = getLocationParams('type')
    if (type === 'task') {
      wx.redirectTo({
        url: '/pages/task/index',
      })
      return
    }
    wx.redirectTo({
      url: '/pages/my-todo/index',
    })
  },
  onAction() {
    // 点击操作按钮，我要弹出提示框
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  onEdit() {
    const id = getLocationParams('id')
    wx.redirectTo({
      url: '/pages/add/index?type=edit&id=' + id,
    })
  },
  onFinish() {
    const id = getLocationParams('id')
    //  完成 需要 更新状态
  },
  onDelay() {
    // 当前操作 默认会延迟一天， 可以传递延迟天数
    const id = getLocationParams('id')
    const param = {
      id,
      num: 1
    }
    var _this = this
    delayCurrentToDo(param).then(res => {
      wx.showToast({
        title: '延迟一天成功',
        duration: 1500,
        icon: 'success',
        success() {
          // 需要刷新当前界面
          _this.setData({
            show: false,
          }, () => {
            _this.GetTodoDetail()
          })
        }
      })
    })
  },
  onDelete() {
    const id = getLocationParams('id')
    Dialog.confirm({
      title: '提示',
      message: '确定要删除吗？多人待办删除会影响他人进度哦！',
    })
      .then(() => {
        deleteTodoById({ id }).then(res => {
          wx.showToast({
            title: '删除成功！',
            icon: 'success',
            duration: 1500,
            success() {
              wx.redirectTo({
                url: '/pages/my-todo/index',
              })
            }
          })
        })
      })
      .catch(() => {
        // on cancel
      });
  },
  onInvite() {
    // 调用微信的转发方法
    Dialog.alert({
      title: '提示',
      message: '点击右上角的按钮就能分享给朋友了！',
    }).then(() => {
      // on close
      this.setData({
        show: false
      })
    });

  }
})