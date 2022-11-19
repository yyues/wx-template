import request from "../request/axios";

// 查询 公开的 圈子信息

export function getPublicSquare(data) {
  return request.axios({
    method: "GET",
    url: "/square/getList",
    data,
  });
}
export function saveSquare(data) {
  return request.axios({
    method: "POST",
    url: "/square/save",
    data,
  });
}

