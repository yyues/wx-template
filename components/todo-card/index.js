// components/todo-card/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: { type: Object, default: {} }, // 传递的主要数据
    loading: { type: Boolean, default: false }, // loading 加载动画， 优先级最高
    hasSelect: { type: Boolean, default: false }, // 是否 有选择框 默认 false
    hasIndex: { type: Boolean, default: true }, // 是否 索引值 默认 false
    hasAction: { type: Boolean, default: false }, // 是否 索引值 默认 false
    index: { type: Number, default: 1 }, // 数组遍历传递的索引值
  },

  /**
   * 组件的初始数据
   */
  data: {
    checked: false,
    id: "", // 传递给 父组件 的 id 值 由 ready 更新
    level: { color: "", content: "" }, // 待办优先级 的处理逻辑
    value: 0, // 多人任务的进度
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(e) {
      this.setData({ checked: e.detail });
      this.triggerEvent("select", this.data.id);
    },
    onDetail() {
      this.triggerEvent("detail", this.data.id);
    },
    onAction() {
      this.triggerEvent("action", this.data.id);
    },
    getLevel() {
      const level = this.data.data.level;
      let obj;
      switch (level) {
        case 0:
          obj = { color: "#7A64C1", content: "低", plain: true };
          break;
        case 1:
          obj = { color: "#0891b2", content: "中", plain: true };
          break;
        case 2:
          obj = { color: "#f87171", content: "高", plain: false };
          break;
        default:
          obj = { color: "#e11d48", content: "紧急", plain: false };
          break;
      }
      this.setData({ level: obj });
    },
    calcValue() {
      const data = this.data.data;
      if (data.is_multiplayer) {
        this.setData({
          value: Number((data.finish_number / data.team_number) * 100).toFixed(
            1
          ),
        });
      }
    },
  },
  lifetimes: {
    ready() {
      // 赋值 id
      this.setData({ id: this.data.data.id });
      //  处理任务优先级
      this.getLevel();
      //  计算 多人 进度
      this.calcValue();
      console.log({ data: this.data });
    },
  },
});
