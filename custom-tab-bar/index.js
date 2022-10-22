Component({
  data: {
    active: 0,
    list: [{
      pagePath: '/pages/home/index',
      iconPath: './image/home.png',
      selectedIconPath: './image/home_active.png',
      text: '首页'
    }, {
      pagePath: '/pages/task/index',
      iconPath: './image/task.png',
      selectedIconPath: './image/task_active.png',
      text: '任务',
      type: 'navigateTo'
    }, {
      pagePath: '/pages/add/index',
      iconPath: './image/add.png',
      selectedIconPath: './image/add.png',
      text: '添加',
      type: 'navigateTo'
    }, {
      pagePath: '/pages/playground/index',
      iconPath: './image/playground.png',
      selectedIconPath: './image/playground_active.png',
      text: '操场',
    }, {
      pagePath: '/pages/user/index',
      iconPath: './image/user.png',
      selectedIconPath: './image/user_active.png',
      text: '我的'
    }
    ]
  },
  methods: {
    // 切换底部导航
    switchTab(e) {
      console.log(e, this.data.list)
      const data = this.data.list[e.detail]
      const url = data.pagePath

      if (data.type === 'navigateTo') {
        wx.navigateTo({ url })
      } else if (data.type === 'redirectTo') {
        wx.redirectTo({ url })
      } else {
        wx.switchTab({ url })
      }

      this.setData({
        active: e.detail
      })
    }
  }
})
