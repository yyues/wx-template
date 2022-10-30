import Toast from '@vant/weapp/toast/toast';
import {
  circleSave
} from "../../api/circle";
import {
  WE_APP_BASE_API
} from '../../env'
import {
  getToken
} from "../../utils/action";
import {
  getLocationParams
} from "../../utils/index";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: '新建圈子',
    type: 'add',
    fileList: [],
    loading: false,

    postForm: {
      name: '',
      content: '',
      avatar_url: '',
      is_timing_publish: false,
      publish_time: 0
    }
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
    const type = getLocationParams('type')
    this.setData({
      type,
      pageTitle: '发布'
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

  },
  handleAdd() {
    const param = {
      ...this.data.postForm,
      publish_time: new Date().getTime()
    }
    this.setData({
      loading: true
    })
    circleSave(param).then(res => {
      wx.showToast({
        title: '创建成功！',
        icon: 'success',
        duration: 1500,
        success() {
          wx.navigateBack()
        }
      })

    }).finally(() => {
      this.setData({
        loading: false
      })
    })
  },
  onChange(e) {
    const data = this.data.postForm
    this.setData({
      postForm: {
        ...data,
        is_timing_publish: e.detail
      }
    })
  },
  onTaskChange(e) {
    const data = this.data.postForm
    this.setData({
      postForm: {
        ...data,
        name: e.detail
      }
    })
  },
  onClickLeft() {
    wx.redirectTo({
      url: '/pages/playground/index'
    })
  },
  // 上传逻辑接口
  afterRead(event) {
    const {
      file
    } = event.detail;
    var _this = this
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: WE_APP_BASE_API + '/upload',
      filePath: file.url,
      name: 'file',
      header: {
        token: getToken()
      },
      formData: {
        user: 'test'
      },
      success(res) {
        // 获取 我的接口 返回的 url 路径
        const data = JSON.parse(res.data)
        const url = WE_APP_BASE_API + data.data.url
        // 上传完成需要更新 fileList
        const fileList = [{
          ...file,
          url,
          deletable: true,
        }]
        const postForm = _this.data.postForm
        _this.setData({
          fileList,
          postForm: {
            ...postForm,
            avatar_url: url
          }
        });
      },
    });
  },
  // 删除上传图片接口
  onDeletePicture() {
    const postForm = this.data.postForm
    this.setData({
      fileList: [],
      postForm: {
        ...postForm,
        avatar_url: ''
      }
    })
  }
})