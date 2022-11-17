import request from "../request/axios";

// 查询 公开的 圈子信息

export function getPublicCircle(data) {
  return request.axios({
    method: "GET",
    url: "/circle/getList",
    data,
  });
}
// 新增修改圈子
export function circleSave(data) {
  return request.axios({
    method: "POST",
    url: "/circle/save",
    data,
  });
}
// 查询 当前 用户 所有符合 条件的待办
export const getUserAllCircle = (data) => {
  return request.axios({
    method: "GET",
    url: "/circle/get-user-circle",
    data,
  });
};
// 根据 id 查询详情
export const getDetailById = (data) => {
  return request.axios({
    method: "GET",
    url: "/circle/find",
    data,
  });
};
// 接受别人的邀请  不需要同意就能加入了，
export const receiveCircleById = (data) => {
  return request.axios({
    method: "POST",
    url: "/circle/join",
    data: {
      ...data,
      type: "receive",
    },
  });
};
export const JoinCircle = (data) => {
  return request.axios({
    method: "POST",
    url: "/circle/join",
    data,
  });
};
export const agreeJoinCircle = (data) => {
  return request.axios({
    method: "POST",
    url: "/circle/agree",
    data,
  });
};
