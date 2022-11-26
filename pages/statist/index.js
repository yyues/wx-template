import {
  initTabActive
} from "../../utils/index";

import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    backgroundColor: "#ffffff",
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['20%', '40%'],
      data: [{
        value: 55,
        name: '北京'
      }, {
        value: 20,
        name: '武汉'
      }, {
        value: 10,
        name: '杭州'
      }, {
        value: 20,
        name: '广州'
      }, {
        value: 38,
        name: '上海'
      }]
    }]
  };

  chart.setOption(option);
  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dpr: 0,
    ec: {
      onInit: initChart
    },
    viewList: ['周', '月', '季'],
    currentKey: '周',
    actions: [{
        icon: '../../images/home/all.png',
        content: '所有待办',
        name: 'fade',
        bgColor: '#F2F3F5',
        activeColor: '',
        key: 'all'
      },

      {
        icon: '../../images/home/many.png',
        content: '多人待办',
        name: 'fade',
        bgColor: '#F2F3F5',
        activeColor: '',
        key: 'more'
      },
      {
        icon: '../../images/home/my.png',
        content: '已延期的',
        name: 'fade',
        bgColor: '#F2F3F5',
        activeColor: '',
        key: 'delay'
      },
      {
        icon: '../../images/home/finish.png',
        content: '已完成的',
        name: 'fade',
        bgColor: '#F2F3F5',
        activeColor: '',
        key: 'finish'
      }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.setData({
      dpr: this.getDpr()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    initTabActive.bind(this)(3);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  getDpr() {
    let pixelRatio = 0;
    wx.getSystemInfo({
      success: (result) => {
        pixelRatio = result.pixelRatio
      },
      fail() {
        pixelRatio = 0
      }
    })
    return pixelRatio
  },
  onSelectKey(e) {
    const key = e.currentTarget.dataset.key
    this.setData({
      currentKey: key
    })
  }
})