// components/today-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 加载动画，用来完成某些请求
    loading: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
    },
    //  渲染列表的 索引值，
    index: {
      type: Number,
      default: 0,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isSelected: false,
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
      this.triggerEvent("finish", {
        id,
        index,
      });
      //  需要更新状态
    },
    onClick() {
      const {
        data: { id, is_current_user },
        index,
      } = this.data;
      if (!is_current_user) return;
      this.triggerEvent("detail", {
        id,
        index,
      });
    },
  },
});
