import { WxPermission, WxLogin } from './action'
import initAxios from '../request/create'
import { login } from '../api/login'
/**
 * tabbar 高亮提示
 * @param {string|number} index
 */
export function initTabActive(index) {
  if (typeof this.getTabBar === 'function' && this.getTabBar()) {
    this.getTabBar().setData({
      active: index
    })
  }
}

/**
 * 返回头部导航高度 px
 */
export function getNavbarHeight() {
  const statusBarHeight = wx.getSystemInfoSync().statusBarHeight
  const navHeight = 46 + statusBarHeight
  return navHeight
}

/**
 *
 * @description 重新登录的逻辑
 */
export const Login = (param) => {
  // 先前会有申请用户授权 操作，本函数只负责登录
  return new Promise((resolve, reject) => {
    // loading 开始
    wx.showLoading({ title: '登录中' })
    WxLogin().then(() => {
      // 登录
      login(param)
        .then((res) => {
          // 设置 token
          wx.setStorageSync('username', res.user_name)
          wx.setStorageSync('avatar_url', res.avatar_url)
          wx.setStorageSync('token', res.access_token)
          // 更新 axios请求
          initAxios()
          wx.showToast({
            title: '登录成功！',
            duration: 1500,
            icon: 'success',
            success() {
              resolve()
            }
          })
        })
        .catch((e) => {
          //  错误处理
          reject(e)
        })
        .finally(() => {
          // 不管咋样，取消动画
          wx.hideLoading()
        })
    })
  })
}
