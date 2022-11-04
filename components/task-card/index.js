Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否有选择框，默认 false
    hasSelect: {
      type: Boolean,
      value: true,
    },
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
    // 加载动画，用来完成某些请求
    loading: {
      type: Boolean,
      default: false,
    },
    //  渲染列表的 索引值，
    index: {
      type: Number,
      default: 0,
    },
    data: {
      type: Object,
      value: {
        content: "", // 内容
        level: 0, // 优先级
        id: "",
        description: "",
        type: "person",
        is_delay: false,
        delay_time: "2天",
        showActicon: false,
        is_master: true,
        is_cycle_todo: false,
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSelected: false,
    icon_url: "./image/my.png",
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      //  点击对号直接算是完成了， 需要考虑一下动画
      this.setData({
        isSelected: e.detail,
      });
      const id = this.data.data.id;
      const index = this.data.index;
      this.triggerEvent("finish", {id, index});
      //  需要更新状态
    },
    onClick(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent("onClick", id);
    },
    setIcon() {
      // 设置我的图标
      const type = this.data.task_type;
      let url;
      switch (type) {
        case "person":
          url = "./image/my.png";
          break;
        default:
          url = "./image/my.png";
          break;
      }
      this.setData({
        icon_url: url,
      });
    },
  },
  lifetimes: {
    ready() {
      this.setIcon();
    },
  },
});
