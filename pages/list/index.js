// pages/list/index.js
import { getLocationParams } from "../../utils/index";
import { findAllTodo, getTodoByDate, getUserAllTodo } from "../../api/todo";
import {
  getPublicCircle,
  agreeJoinCircle,
  getUserAllCircle,
} from "../../api/circle";
import { getPublicSquare } from "../../api/square";
import { getMyMsg } from "../../api/message";
import moment from "moment";
import Toast from "@vant/weapp/toast/toast";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    key: "", // 关键词 todo/ circle / square / search / my-todo / my-circle / my-message / my-square
    from: "", // 来源 只有四个 home / user / circle-detail / todo-detail
    type: "", // 类型 add / edit
    title: "", // 标题
    showAction: false, // 是否展示列表页的操作栏
    showAdd: false, // circle / square 时 是否展示 添加按钮
    loading: false, // 页面加载动画
    hasHeader: false, // 只有 todo、search 才有头部
    list: [], // 绑定的列表数据
    emptyMsg: "", // 不同页面 的 查询 空数据 的文案显示
    emptyUrl: "", // 可配置项 空白页的 显示图片url
    searchValue: "", // 头部搜索框输入值
    selectDate: "", // todo 模式下 头部的选择日期
    searchForm: {
      page: 0,
      limit: 15,
      keyword: "",
    }, // 分页查询条件 用来实现下拉刷新
    refersh: false, // 是否下拉刷新中
    isTask: false, // 是否是 待办卡片
    isCircle: false, // 是否是 圈子卡片
    isMsg: false, // 是否是 消息卡片
    isSquare: false, // 是否是 动态卡片
    show: false, // 底部操作栏的展示开关
    actions: [], // 对应的数组
    description: "", //描述信息，用来替代提示
    total: 0, // 返回的列表数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const { key, from, type } = this.GetRouteParam();
    const master = getLocationParams("master");
    // 这个是 检测自己 的圈子下 的待办页面能够有新增按钮
    const expec = key == "my-todo" && from == "circle-detail" && !!master;
    this.setData({
      key,
      from,
      type,
      loading: true,
      // todo/ circle / square / search / my-todo / my-circle / my-message / my-square
      showAdd: ["circle", "square"].includes(key) || expec,
      hasHeader: ["search", "todo"].includes(key),
      isTask: ["search", "todo", "my-todo"].includes(key), // 是否是 待办卡片
      isCircle: ["circle", "my-circle"].includes(key), // 是否是 圈子卡片
      isSquare: ["square"].includes(key),
      isMsg: ["my-message"].includes(key), // 是否是 消息卡片
    });
    //  设置页面标题
    this.GetTitle();
    // 设置空状态页面
    this.setEmptyMsg();
    if (key == "search") {
      // 搜索啥也不干
      this.setData({
        loading: false,
      });
    } else if (key == "todo") {
      this.getTodayToDo();
    } else {
      this.GetList();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    const key = this.data.key;
    this.setData(
      {
        refersh: true,
      },
      () => {
        if (key == "search") {
          this.GetSearch();
        } else if (key == "todo") {
          this.getTodayToDo();
        } else {
          this.GetList();
        }
      }
    );
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    console.log("top----");
    const key = this.data.key;
    const { total, searchForm } = this.data;
    if (total < searchForm.limit) {
      // return Toast.fail("数据已加载完了！");
      return;
    }
    if (key !== "search" && key !== "todo") {
      searchForm.page++;
      wx.showNavigationBarLoading();
      this.setData({ searchForm }, () => {
        this.GetList();
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  GetAxiosRes(res) {
    //  res 为请求返回的结果数据
    var _this = this;
    console.log("我被调用了 res");
    const hasHeader = this.data.hasHeader;
    const refresh = this.data.refersh;
    const before = this.data.list;
    const key = this.data.key;
    let list;
    if (hasHeader || key === "my-circle") {
      list = res;
    } else {
      list = refresh ? [...res.rows] : [...before, ...res.rows];
    }
    this.setData({
      list,
      loading: false,
      total: res.count ?? 0,
    });
    const status = this.data.refersh;
    if (status) {
      // 页面下拉刷新
      wx.stopPullDownRefresh({
        success() {
          Toast.success("刷新成功");
          _this.setData({
            refersh: false,
          });
        },
      });
    }
  },
  // 获取路由 详情
  GetRouteParam() {
    const type = getLocationParams("type");
    const key = getLocationParams("key");
    const from = getLocationParams("from");
    return {
      type,
      key,
      from,
    };
  },
  GetTitle() {
    const { key, from } = this.GetRouteParam();
    let title;
    switch (key) {
      case "search":
        title = "搜索待办";
        break;
      case "circle":
        title = "圈子";
        break;
      case "square":
        title = "广场";
        break;
      case "my-circle":
        title = "我的圈子";
        break;
      case "my-square":
        title = "我的广场";
        break;
      case "my-message":
        title = "我的消息";
        break;
      case "todo":
        title = this.filterTime();
        break;
      case "my-todo":
        if (from == "circle-detail") {
          title = getLocationParams("name") + "的待办";
        } else {
          title = "我的待办";
        }
        break;
      default:
        title = "页面";
        break;
    }
    this.setData({
      title,
    });
    wx.setNavigationBarTitle({
      title,
    });
  },
  setEmptyMsg() {
    const { key, from } = this.GetRouteParam();
    let title;
    switch (key) {
      case "search":
        title = "没有查找到待办哦！";
        break;
      case "circle":
        title = "还没有圈子，真是奇怪！";
        break;
      case "square":
        title = "没有人发布动态哦！快去发布把 ";
        break;
      case "my-circle":
        title = "还没有创建圈子呢！";
        break;
      case "my-square":
        title = "我的动态空空如也";
        break;
      case "my-message":
        title = "还没有新的消息呢！";
        break;
      case "todo":
        title = "今天没有待办哦";
        break;
      case "my-todo":
        if (from === "circle-detail") {
          // 有的话是查询圈子的待办，没有的话查自己的
          title = "圈子下还没有待办呢！";
        } else {
          title = "还没有自己的待办呢！";
        }

        break;
      default:
        title = "吱吱---，系统错误";
        break;
    }
    this.setData({
      emptyMsg: title,
    });
  },
  // 头部处理逻辑
  onHeaderSelect(e) {
    const day = e.detail;
    this.setData({
      selectDate: day,
    });
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: this.filterTime(day),
    });
    // 选择的时候查询当天数据
    this.getTodayToDo();
  },
  filterTime(time = new Date()) {
    const month = [
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十",
      "十一",
      "十二",
    ];
    const day = [
      "一",
      "二",
      "三",
      "四",
      "五",
      "六",
      "七",
      "八",
      "九",
      "十",
      "十一",
      "十二",
      "十三",
      "十四",
      "十五",
      "十六",
      "十七",
      "十八",
      "十九",
      "二十",
      "二十一",
      "二十二",
      "二十三",
      "二十四",
      "二十五",
      "二十六",
      "二十七",
      "二十八",
      "二十九",
      "三十",
      "三十一",
    ];
    return `${month[moment(time).month()]}月${day[moment(time).date() - 1]}日`;
  },
  // 根据日期获得当日待办
  getTodayToDo() {
    const param = {
      date: this.data.selectDate,
    };
    getTodoByDate(param).then((res) => {
      // 统一调用 一个 处理结果的方法把
      this.GetAxiosRes(res);
    });
  },
  // search 搜索 start
  onHeaderSearch(e) {
    this.setData(
      {
        searchValue: e.detail,
      },
      () => {
        this.GetSearch();
      }
    );
  },
  GetSearch() {
    const param = {
      keyword: this.data.searchValue,
    };
    findAllTodo(param).then((res) => {
      this.GetAxiosRes(res);
    });
  },
  onSearchCancel() {
    this.setData({
      searchValue: "",
    });
  },
  // search 搜索 end
  GetList() {
    const { key, from } = this.GetRouteParam();
    this.setData({
      loading: true,
    });
    const param = {
      ...this.data.searchForm,
    };
    let fn;
    switch (key) {
      case "circle":
        param.status = "published";
        fn = getPublicCircle(param);
        break;
      case "square":
        fn = getPublicSquare(param);
        break;
      case "my-todo":
        if (from === "circle-detail") {
          // 有的话是查询圈子的待办，没有的话查自己的
          param.task_from_id = getLocationParams("id");
        }
        fn = getUserAllTodo(param);
        break;
      case "my-circle":
        fn = getUserAllCircle();
        break;
      case "my-message":
        fn = getMyMsg(param);
        break;
      default:
        return Toast.fail("接口错误！");
    }
    fn.then((res) => {
      this.GetAxiosRes(res);
    }).finally(() => {
      this.setData({
        loading: false,
      });
      wx.hideNavigationBarLoading();
    });
  },
  onDetail(e) {
    const key = this.data.key;
    let url;
    console.log("onDetail", key);
    switch (key) {
      case "search":
        url = "/pages/todo-detail/index?id=" + e.detail;
        break;
      case "todo":
        url = "/pages/todo-detail/index?id=" + e.detail;
        break;
      case "circle":
        url = "/pages/circle-detail/index?type=publish&id=" + e.detail;
        break;
      case "my-todo":
        url = "/pages/todo-detail/index?id=" + e.detail;
        break;
      case "my-circle":
        url = "/pages/circle-detail/index?type=user&id=" + e.detail;
        break;
      default:
        Toast.fail("详情点击错误");
        break;
    }
    if (url) {
      wx.navigateTo({
        url,
      });
    }
  },
  onAction(e) {
    const msgId = e.detail;
    const key = this.data.key;
    if (key !== "my-message") return Toast.fail("不能操作的哦!");
    const actions = [
      {
        name: "同意",
        color: app.globalData.primaryColor,
        loading: false,
        disabled: false,
        msgId,
      },
      {
        name: "拒绝",
        color: "#ef4444",
        loading: false,
        disabled: false,
        msgId,
      },
      {
        name: "忽略",
        loading: false,
        disabled: false,
        msgId,
      },
    ];
    this.setData({
      actions,
      show: true,
    });
  },
  handleAdd() {
    const key = this.data.key;
    const id = getLocationParams("id");
    let url;
    switch (key) {
      case "circle":
        url = "/pages/circle/index?type=add";
        break;
      case "square":
        url = "/pages/square/index?type=add";
        break;
      case "my-todo":
        url = "/pages/add/index?type=add&from=user&id=" + id;
        break;
      default:
        return Toast.fail("新增错误！");
    }
    if (url) {
      wx.navigateTo({
        url,
      });
    }
  },
  onActionClose() {
    this.setData({
      show: false,
      description: "",
    });
  },
  onActionSelect(e) {
    console.log("点击操作栏的事件", e.detail);
    const { msgId, name } = e.detail;
    const data = this.data.list.filter((i) => i.id == msgId)[0];
    if (!data) return Toast.fail("数据错误！");
    if (name == "同意") {
      this.onAgree(data);
    }
  },
  onAgree(data) {
    const { form_type, form_id, create_uid, id } = data;
    let fn;
    if (form_type === "circle-join") {
      const param = {
        id: form_id,
        apply_id: create_uid,
        msgId: id,
      };
      fn = agreeJoinCircle(param);
    }
    const actions = this.data.actions;
    actions[0].loading = true;
    this.setData({
      actions,
    });
    if (!fn) return Toast.fail("系统错误");
    fn.then((res) => {
      this.setData({
        description: "已同意",
      });
    }).finally(() => {
      actions[0].loading = false;
      this.setData({
        actions,
      });
    });
  },
});
