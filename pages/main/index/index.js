// const app = getApp()
import {
  initTabActive
} from '../../../utils/index'
import {
  createStoreBindings
} from 'mobx-miniprogram-bindings'
import {
  store
} from '../../../store/test'
import { WxLogin, } from '../../../utils/action'
import { login, test } from '../../../api/login'
import initAxios from '../../../request/create'
Page({
  data: {
    time: +new Date(),
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {

    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['numA', 'numB', 'sum'],
      actions: ['handleUpdate']
    })
  },
  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },
  onShow: function () {
    initTabActive.bind(this)(0)
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo)
  },
  handleLogin() {
    WxLogin().then(res => {
      console.log(res, '登录相关信息');
      const param = {
        code: res.code,
        userInfo: res.userInfo,
        encryptedData: res.encryptedData,
        iv: res.iv,
        signature: res.signature
      }
      login(param).then(info => {
        // 登录成功后需要做的事情
        console.log('登录成功后需要做的事情', info);
        wx.setStorageSync('token', info.data.access_token)
        initAxios()
      })

    })
  },
  handleTest() {
    const param = {
      page: null,
      limig: null
    }
    test(param).then(res => {
      console.log(res, '测试返回的数据');
    })
  },
  onGetPhoneNumber(e) {
    console.log(e);
  }

})