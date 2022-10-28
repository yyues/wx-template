import request from '../request/axios'

// 新增 修改 待办
export function taskSave(data) {
  return request.axios({
    method: 'POST',
    url: '/todo/save',
    data
  })
}

// 查询 当前 用户 所有符合 条件的待办
export const getUserAllTodo = (data) => {
  return request.axios({
    method: 'GET',
    url: '/todo/getList',
    data
  })
}
// 根据 id 查询 指定待办
export const getTodoById = (data) => {
  return request.axios({
    method: 'GET',
    url: '/todo/find',
    data
  })
}
