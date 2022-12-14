import Toast from "@vant/weapp/toast/toast";
import moment from "moment";
import {
  circleSave,
  getDetailById
} from "../../api/circle";
import {
  WE_APP_BASE_API
} from "../../env";
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
    type: "add",
    fileList: [],
    show: false, // 展示日期组件
    showTime: false, // 过期时间
    loading: true,
    hasOwner: false, // 是否有圈主的微信号
    hasGroup: false, // 是否有圈子的 微信的图
    postForm: {
      name: "",
      content: "",
      avatar_url: "",
      is_timing_publish: false,
      publish_time: 0,
    },
    btnLoading: false,
    uploading: false,
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
    // 调整结构
    this.setData({
      type
    });
    // 设置标题
    wx.setNavigationBarTitle({
      title: type === "publish" ? "发布" : type === "edit" ? "编辑" : "新建",
    });
    if (this.data.uploading) {
      // 上传图片 会走 onshow 方法， 处理一下逻辑就行
      this.setData({
        uploading: false,
      });
    } else {
      if (type !== "add") {
        this.getCiclrDetail();
      } else {
        this.setData({
          loading: false
        });
      }
    }
    // 隐藏返回 home 按钮
    wx.hideHomeButton();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // const type = this.data.type;
    // if (type == "add") {
    //   wx.redirectTo({
    //     url: "/pages/playground/index",
    //   });
    //   return;
    // }
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
  handleAdd() {
    const param = {
      ...this.data.postForm,
      publish_time: moment().format("YYYY-MM-DD"),
    };

    // 直接把 发布时间传过去就行了
    // this.setData({
    //   loading: true
    // })
    circleSave(param)
      .then((res) => {
        wx.showToast({
          title: "创建成功！",
          icon: "success",
          duration: 1500,
          success() {
            wx.navigateBack();
          },
        });
      })
      .finally(() => {
        // this.setData({
        //   loading: false
        // })
      });
  },
  handlePublish() {
    const postForm = this.data.postForm;
    const param = {
      ...postForm,
      status: "published",
    };
    this.setData({
      btnLoading: true,
    });
    circleSave(param)
      .then((res) => {
        wx.showToast({
          title: "发布成功！",
          icon: "success",
          duration: 1500,
          success() {
            wx.navigateBack()
          },
        });
      })
      .finally(() => {
        this.setData({
          btnLoading: false,
        });
      });
  },
  handleEdit() {
    const postForm = this.data.postForm;
    const param = {
      ...postForm,
    };
    this.setData({
      btnLoading: true,
    });
    circleSave(param)
      .then((res) => {
        wx.showToast({
          title: "修改成功！",
          icon: "success",
          duration: 1500,
          success() {
            wx.reLaunch({
              url: "/pages/my-circle/index",
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
  onChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        is_timing_publish: e.detail,
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
  onContentChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        content: e.detail,
      },
    });
  },
  onTargetChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        target: e.detail,
      },
    });
  },
  onNameChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        name: e.detail,
      },
    });
  },
  onNumbercChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        max_number: Number(e.detail) || 0,
      },
    });
  },
  onMasterChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        wx_master: e.detail,
      },
    });
  },
  onMarkChange(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        wx_mark: e.detail,
      },
    });
  },
  onOwnerChange(e) {
    const data = e.detail;
    const postForm = this.data.postForm;
    if (!data) {
      this.setData({
        postForm: {
          ...postForm,
          wx_master: "",
          wx_mark: "",
        },
      });
    }
    this.setData({
      hasOwner: data,
    });
  },
  onGroupChange(e) {
    const data = e.detail;
    const postForm = this.data.postForm;
    if (!data) {
      this.setData({
        hasGroup: data,
        postForm: {
          ...postForm,
          wx_image_url: "",
          wx_image_out: null,
        },
        fileList: [],
      });
      return;
    }
    this.setData({
      hasGroup: data,
      postForm: {
        ...postForm,
        wx_image_out: moment().add(7, "days").format("YYYY-MM-DD HH:mm"),
      },
      uploading: true,
    });
  },
  onTimingChange(e) {
    const data = e.detail;
    const postForm = this.data.postForm;
    this.setData({
      postForm: {
        ...postForm,
        is_timing_publish: data,
        publish_time: data ? postForm.publish_time : 0,
      },
    });
  },
  onPrivateChange(e) {
    const data = e.detail;
    const postForm = this.data.postForm;
    this.setData({
      postForm: {
        ...postForm,
        is_private: data,
      },
    });
  },
  onClickLeft() {
    wx.redirectTo({
      url: "/pages/playground/index",
    });
  },
  beforeRead(event) {
    // 需要在上传前吧 状态设置 true 不然会重新加载界面
    this.setData({
      uploading: true
    });
    const {
      file,
      callback
    } = event.detail;
    callback(true);
  },
  // 上传逻辑接口
  afterRead(event) {
    const {
      file
    } = event.detail;
    var _this = this;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: WE_APP_BASE_API + "/upload",
      filePath: file.url,
      name: "file",
      header: {
        token: getToken(),
      },
      formData: {
        user: "test",
      },
      success(res) {
        // 获取 我的接口 返回的 url 路径
        const data = JSON.parse(res.data);
        const url = WE_APP_BASE_API + data.data.url;
        // 上传完成需要更新 fileList
        const fileList = [{
          ...file,
          url,
          deletable: true,
        }, ];
        const postForm = _this.data.postForm;
        const info =
          _this.data.type === "add" ?
          {
            ...postForm,
            avatar_url: url,
          } :
          {
            ...postForm,
            wx_image_url: url,
          };
        _this.setData({
          fileList,
          postForm: info,
        });
      },
    });
  },
  // 删除上传图片接口
  onDeletePicture() {
    const postForm = this.data.postForm;
    const type = this.data.type;
    if (type === "add") {
      this.setData({
        fileList: [],
        postForm: {
          ...postForm,
          avatar_url: "",
        },
      });
    } else {
      // 这个逻辑有点问题，现在是不允许 修改上传过得头像的
      this.setData({
        fileList: [],
        postForm: {
          ...postForm,
          wx_image_url: "",
        },
      });
    }
  },
  //  获取 id
  getCiclrDetail() {
    this.setData({
      loading: true,
    });
    const id = getLocationParams("id");
    getDetailById({
        id,
      })
      .then((res) => {
        const item = !!res.wx_image_url ?
          [{
            url: res.wx_image_url,
            deletable: true,
          }, ] :
          [];
        this.setData({
          postForm: res,
          hasOwner: !!res.wx_master,
          hasGroup: !!res.wx_image_url,
          fileList: item,
        });
      })
      .finally(() => {
        this.setData({
          loading: false,
        });
      });
  },
  // 隐藏 日历组件显示
  onClose() {
    this.setData({
      show: false,
    });
  },
  onCloseTime() {
    this.setData({
      showTime: false,
    });
  },
  onConfirm(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        wx_image_out: moment(e.detail).format("YYYY-MM-DD"),
      },
      show: false,
    });
  },
  onConfirmTime(e) {
    const data = this.data.postForm;
    this.setData({
      postForm: {
        ...data,
        publish_time: moment(e.detail).format("YYYY-MM-DD"),
      },
      showTime: false,
    });
  },
  showCalender() {
    this.setData({
      show: true,
    });
  },
  showCalenderTime() {
    this.setData({
      showTime: true,
    });
  },
});