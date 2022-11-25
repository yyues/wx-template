
import { hasLogin } from "../utils/index";
import { getToken } from "../utils/action";
Component({
  data: {
    active: 0,
    list: [
      {
        pagePath: '/pages/main/index',
        iconPath: './image/home.png',
        selectedIconPath: './image/home_active.png',
        text: '首页'
      },
      {
        pagePath: '/pages/add/index',
        iconPath: './image/add.png',
        selectedIconPath: './image/add.png',
        text: '添加',
        type: 'navigateTo',
        hasLogin: true,
      },
      {
        pagePath: '/pages/user/index',
        iconPath: './image/user.png',
        selectedIconPath: './image/user_active.png',
        text: '我的'
      }
    ],
    show: false,
    currentPath: ''
  },
  methods: {
    // 切换底部导航
    switchTab(e) {
      const data = this.data.list[e.detail]
      const url = data.pagePath
      if (data.hasLogin && !getToken()) {
        hasLogin()
        return
      }
      if (data.type === 'navigateTo') {
        wx.navigateTo({
          url
        })
      } else if (data.type === 'redirectTo') {
        wx.redirectTo({
          url
        })
      } else {
        wx.switchTab({
          url
        })
      }
      this.setData({
        active: e.detail
      })
    },
  }
})
