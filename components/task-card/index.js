import moment from "moment";
import {
  WE_APP_BASE_API
} from "../../env";
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
    today: moment().format("YYYY-MM-DD"),
    bg: WE_APP_BASE_API + "/public/card/card_bg.png",
    show: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
    onClick(e) {
      const id = e.currentTarget.dataset.id;
      this.triggerEvent("onClick", id);
      
    },
    showOperation(e) {
      const data = this.data.show
      this.setData({
        show: !data,
      });
    },
    onClock(e) {
      console.log('1111');
    }
  },
  lifetimes: {
    ready() {},
  },
});