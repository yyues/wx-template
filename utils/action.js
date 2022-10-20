// 登录,退出,授权相关方法类
import {
  login,
  userInfo,
  updateUserInfo
} from '../api/login'
import initAxios from '../request/create'

// 微信登录 - 一键式授权登录
export function WxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        wx.getSetting({
          success(data) {
            if (data.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                lang: 'zh_CN',
                success(info) {
                  resolve({
                    ...res,
                    ...info
                  })
                },
                fail(e) {
                  reject({
                    type: 'NO_PERMISSION',
                    message: '没有授权获取用户信息',
                    detail: e
                  })
                }
              })
            } else {
              reject({
                type: 'NO_PERMISSION',
                message: '用户没有授权用户信息',
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


// 获取并设置用户信息
export function setUserInfo() {
  return new Promise((resolve, reject) => {
    const app = getApp() || this || null
    userInfo().then((res) => {
      console.log(res)
      // 存入全局与缓存
      app && (app.globalData.userInfo = res)
      wx.setStorageSync('userInfo', res)
      resolve(res)
    }).catch((err) => {
      console.log(err)
      reject(err)
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