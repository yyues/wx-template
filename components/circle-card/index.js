Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否有操作栏，默认 false
    hasAction: {
      type: Boolean,
      value: false
    },
    // 类型，是用来判断使用位置的
    type: {
      type: String,
      value: 'home'
    },
    data: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checked: false,
    icon_url: './image/my.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      this.setData({
        checked: e.detail
      })
    },
    onClick(e) {
      const id = e.currentTarget.dataset.id
      this.triggerEvent('onClick', id)
    },
    onPublish() {
      const id = this.data.data.id
      wx.redirectTo({
        url: '/pages/circle/index?type=publish&id=' + id,
      })
    }
  },
  lifetimes: {
    ready() { }
  }
})