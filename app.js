// 初始化aixos
import {
  getToken
} from './utils/action'
import initAxios from './request/create'
App({
  onLaunch: function() {
    // 初始化axios
    initAxios()
    // 初始化全局分享
    _initShare()
    // 初始化 默认值
    // this.gloabalData.token = getToken()
    this.gloabalData.hasFinishSound = wx.getStorageSync('hasFinishSound') || ''
  },
  globalData: {
    token: getToken(),
    // 主题色
    primaryColor: '#5b67ca',
    // 次主体色。较主题色颜色亮丽一些
    primarySecondColor: '#7174e2',
    // 标题文字的颜色
    textHeaderColor: '#24271e',
    //  次级 文字标题 浅色系
    primarySecondTextColor: '#94a3b8',
    // 背景颜色
    bgColor: '#f2f3f5',
    // 是否有 完成提示音
    hasFinishSound: false

  }
})

// 设置全局默认分享
function _initShare() {
  var PageTmp = Page
  Page = function(pageConfig) {
    pageConfig = Object.assign({
      onShareAppMessage: function() {
        return {
          title: 'weapp-template-默认分享文案',
          path: '/pages/main/index/index',
          imageUrl: 'https://img01.yzcdn.cn/vant/cat.jpeg'
        }
      }
    },
    pageConfig
    )
    PageTmp(pageConfig)
  }
}
