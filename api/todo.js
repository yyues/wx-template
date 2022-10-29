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
// 根据 id 延迟天数
export const delayCurrentToDo = (data) => {
  return request.axios({
    method: 'POST',
    url: '/todo/delay',
    data
  })
}
// 根据 id 延迟天数
export const deleteTodoById = (data) => {
  return request.axios({
    method: 'POST',
    url: '/todo/delete',
    data
  })
}
export const getTodoByDate = (data) => {
  return request.axios({
    method: 'GET',
    url: '/todo/get-by-date',
    data
  })
}