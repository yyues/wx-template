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
import {
  weLogin,
  WxGetUserInfo
} from '../../../utils/action'
Page({
  data: {
    time: +new Date()
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
  handleLogin() {
    console.log('login')
    weLogin().then(res => {
      // 这儿才是 获取用户信息
      console.log(res, '登录返回的数据')
      WxGetUserInfo().then(data => {
        console.log(data, ';11')
      })
    }).catch(e => {

    })
  }

})