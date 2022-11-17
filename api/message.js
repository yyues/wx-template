import request from "../request/axios";

// 新增 修改 待办
export function getMyMsg(data) {
  return request.axios({
    method: "GET",
    url: "/message/getList",
    data,
  });
}