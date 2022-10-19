import request from '../request/axios'

// 登录
export function login(data) {
  return request.axios({
    method: 'post',
    url: '/wx-login',
    data
  })
}

// 获取用户信息
export function getInfo() {
  return request.axios({
    method: 'post',
    url: '/getUserInfo'
  })
}
// 获取用户信息
export function updateUserInfo() {
  return request.axios({
    method: 'post',
    url: '/updateUserInfo'
  })
}
