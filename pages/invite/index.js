import { getLocationParams } from "../../utils/index";
import { getTodoById, receiveTodoById } from "../../api/todo";
import { getDetailById, receiveCircleById } from "../../api/circle";
import Toast from "@vant/weapp/toast/toast";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    todoInfo: {},
    type: "todo",
    key: "",
    isFull: false, // 待办的人数或者圈子的人数 是不是满了
    btnLoading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //  检查是圈子还是待办
    const key = getLocationParams("key");
    this.setData({ key });
    if (key === "todo") {
      this.GetTodoInfo();
    } else {
      this.GetCircleInfo();
    }
  },

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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
  backHome() {
    wx.switchTab({
      url: "/pages/home/index",
    });
  },
  GetTodoInfo() {
    const id = getLocationParams("id");
    this.setData({ loading: true });
    getTodoById({ id })
      .then((res) => {
        this.setData({
          todoInfo: res,
          isFull: res.team_number === res.max_number,
        });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
  GetCircleInfo() {
    const id = getLocationParams("id");
    this.setData({ loading: true });
    getDetailById({ id })
      .then((res) => {
        this.setData({
          todoInfo: res,
          isFull: res.current_number === res.max_number,
        });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },
  handleJoin() {
    const id = this.data.todoInfo.id;
    const param = { id };
    this.setData({ btnLoading: true });
    const fn =
      this.data.key == "todo"
        ? receiveTodoById(param)
        : receiveCircleById(param);
    fn.then(() => {
      Toast.success("加入成功！快去看看吧");
    }).finally(()=>{
      this.setData({ btnLoading: false });
    });
  },
});
