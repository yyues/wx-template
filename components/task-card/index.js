// components/task-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否有选择框，默认 false
    hasSelect: {
      type: Boolean,
      value: false
    },
    // 是否有操作栏，默认 false
    hasAction: {
      type: Boolean,
      value: false
    },
    data: {
      type: Object,
      value: {
        content: '', // 内容
        level: 0, // 优先级
        id: '',
        description: '',
        type: 'person',
        is_delay: false,
        delay_time: '2天',
        showActicon: false,
        checked: false,
        is_master: true
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checked: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      this.setData({
        checked: e.detail
      })
    }
  }
})