import request from '../request/axios'

// 查询 公开的 圈子信息

export function getPublicCircle(data) {
  return request.axios({
    method: 'GET',
    url: '/circle/getList',
    data
  })
}
// 新增修改圈子
export function circleSave(data) {
  return request.axios({
    method: 'POST',
    url: '/circle/save',
    data
  })
}
// 查询 当前 用户 所有符合 条件的待办
export const getUserAllCircle = (data) => {
  return request.axios({
    method: 'GET',
    url: '/circle/get-user-circle',
    data
  })
}
// 根据 id 查询详情
export const getDetailById = (data) => {
  return request.axios({
    method: 'GET',
    url: '/circle/find',
    data
  })
}