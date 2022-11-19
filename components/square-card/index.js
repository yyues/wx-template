Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
    },

    // 数组的索引值
    index: {
      type: Number,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    onStar() {
      this.triggerEvent("star", this.data.data.id);
    },
  },
  lifetimes: {
    ready() {},
  },
});
