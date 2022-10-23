import request from '../request/axios'

export function taskSave(data) {
  return request.axios({
    method: 'POST',
    url: '/todo/save',
    data
  })
}