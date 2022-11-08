Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否有操作栏，默认 false
    hasAction: {
      type: Boolean,
      value: false,
    },
    // 类型，是用来判断使用位置的
    type: {
      type: String,
      value: "home",
    },
    data: {
      type: Object,
      value: {},
    },
    // 是否 被选中
    checked: {
      type: Boolean,
      default: false,
    },
    // 数组的索引值
    index: {
      type: Number,
      default: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    checked: false,
    icon_url: "./image/my.png",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick() {
      this.triggerEvent("click", this.data.index);
    },
  },
  lifetimes: {
    ready() {},
  },
});
