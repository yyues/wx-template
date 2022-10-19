// 登录,退出,授权相关方法类
import {
  login,
  userInfo,
  updateUserInfo
} from '../api/login'
import initAxios from '../request/create'

// 微信登录
export function weLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          login({
            code: res.code
          }).then((info) => {
            //  需要做个单独处理
            switch (info.status) {
              // 登录成功
              case 'LOGIN_SUCCESS':
                wx.setStorageSync('token', info.access_token)
                initAxios()
                resolve(info.data)
                break
                // 没有绑定
              case 'NO_BIND':
                // 注册逻辑，需要绑定用户数据
                reject({
                  ...info,
                  type: 'register'
                })

                break
            }
            resolve(info)
          }).catch((error) => {
            reject(error)
          })
        }
      }
    })
  })
}
export function WxGetUserInfo() {
  return new Promise((resolve, reject) => {
  wx.getSetting({
    success(res){
      if(res.authSetting['scope.userInfo']) {
        //  说明已经授权了
        wx.getUserInfo({
          lang: 'zh_CN',
          withCredentials: true,
          success(res) {
            console.log(res, '用户信息')
            updateUserInfo(res.userInfo).then((info) => {
              wx.setStorageSync('token', info.access_token)
              initAxios()
              resolve(info.data)
            }).catch((e) => {
              reject(e)
            })
          },
          fail(e) {
            reject(e)
          }
        })
      }
    },
    fail() {
      console.log('用户未授权进行登录！')
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