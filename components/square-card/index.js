// components/square-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {
        is_master: true,
        is_private: false,
        is_current_user: false
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick() {
      const uid = this.data.data.id
      this.triggerEvent('onClick', uid)
    }
  }
})