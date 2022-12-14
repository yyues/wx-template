import axios from "./axios";
import { getToken } from "../utils/action";
import { Login } from "../utils/index";
import { WE_APP_LOCAL_BASE_API } from "../env";

function initAxios() {
  const baseUrl = WE_APP_LOCAL_BASE_API;
  const header = {
    "content-type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + getToken(),
    token: getToken(),
  };
  const timeout = 15000;
  // 给APP 全局值 赋值 免得 报错
  // request拦截 请求参数
  // const transformRequest = (data) => {

  //   return {
  //     ...data,
  //   };
  // };

  // respones拦截 可添加一些自定义数据
  // const transformResponse = (res) => ({
  //   ...res,
  // });

  // resolve 拦截, 格式化返回数据
  const resolveWrap = ({ data = {} }) => {
    return data;
  };

  // reject 拦截错误信息
  const rejectWrap = ({ data = {} }) => {
    // 调整逻辑 401 或者 403 需要重新登录
    const { code, message } = data;
    if ([401, 403].includes(code)) {
      // 重新登录的逻辑
      // Login()
      wx.navigateTo({
        url: "/pages/login/index",
      });
      return;
    }
    if (!data.success) {
      wx.showToast({ title: message, duration: 1000, icon: "error" });
    }
    return data;
  };

  // 状态码验证,根据不同的状态码做对于的操作
  const validateStatus = (res) => {
    return /^2/.test(res.statusCode.toString());
  };

  axios.creat({
    baseUrl,
    header,
    timeout,
    validateStatus,
    resolveWrap,
    rejectWrap,
  });
}

export default initAxios;
