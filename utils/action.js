// 登录,退出,授权相关方法类
import initAxios from '../request/create'

/**
 *
 * @param {*} type  授权类型，参考小程序文档的授权类型，默认是用户授权
 * @return {Promise} 返回 Promise 类型
 * @description 微信授权方法 异步类型
 */
export const WxPermission = (type = 'scope.userInfo') => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(data) {
        if (data.authSetting[type]) {
          // 调用获取用户授权信息
          if (type === 'scope.userInfo') {
            wx.getUserInfo({
              lang: 'zh_CN',
              success(info) {
                resolve(info)
              },
              fail(e) {
                reject({
                  type: 'USER_PERMISSION_ERROR',
                  message: '获取用户信息授权错误',
                  detail: e
                })
              }
            })
          } else {
            // 可以 重复利用
            resolve(data)
          }
        } else {
          reject({
            type: 'NO_PERMISSION',
            message: '用户没有授权信息',
            detail: {}
          })
        }
      },
      fail(e) {
        reject({
          type: 'PERMISSION_ERROR',
          message: '用户授权错误',
          detail: e
        })
      }
    })
  })
}

/**
 *
 * @returns {Promise}
 * @description 登录方法，需要重新调用
 */
export function WxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        // 用户登录成功
        resolve(res)
      },
      fail(e) {
        reject({
          type: 'LOGIN_ERROR',
          message: '微信登录出现错误！',
          detail: e
        })
      }
    })
  })
}

// 获取token
export function getToken() {
  try {
    return wx.getStorageSync('token') || ''
  } catch (error) {
    console.log(error)
  }
}

// 删除token
export function removeToken() {
  try {
    wx.removeStorageSync('token')
    // 重新初始化axios
    initAxios()
  } catch (error) {
    console.log(error)
  }
}

// 获取用户信息
export function getUserInfo() {
  try {
    const app = getApp()
    return (app && app.globalData.userInfo) || wx.getStorageSync('userInfo')
  } catch (error) {
    console.log(error)
  }
}

// 清除用户信息
export function removeUserInfo() {
  try {
    const app = getApp()
    app && (app.globalData.userInfo = null)
    wx.removeStorageSync('userInfo')
  } catch (error) {
    console.log(error)
  }
}
