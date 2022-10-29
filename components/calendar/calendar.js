// component/calendar/calendar.js
import moment from 'moment'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spotMap: { //标点的日期
      type: Object,
      value: {}
    },
    defaultTime: { //标记的日期，默认为今日 注意：传入格式推荐为'2022/1/2'或'2022/01/02', 其他格式在ios系统上可能出现问题
      type: String,
      value: ''
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectDay: {}, //选中时间
    nowDay: {}, //现在时间
    open: false,
    weekDay: ['日', '一', '二', '三', '四', '五', '六'],
    swiperCurrent: 1, //选中时间
    oldCurrent: 1, //之前选中时间
    swiperDuration: 500,
    swiperHeight: 0,
    scrolling: false,
    swiperData: [],
    currentList: [false, false, false, false, false, false, false,],
    selectTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //  得到当前星期几，按中文 转义
    getWeek(date = new Date()) {
      const res = moment(date).format('d')
      return this.data.weekDay[res]
    },
    // 获取当前周 开始结束时间 
    getCurrentWeekDaydate(date = new Date()) {
      const start = moment(date).weekday(1).format('YYYY-MM-DD') //本周一
      const end = moment(date).weekday(7).format('YYYY-MM-DD') //本周日
      return [start, end]
    },
    // 获取上一个周日，到下一个周六的日期
    getCalendarWeekDay(date = new Date()) {
      const res = moment(date)
      const days = res.days()
      const start = res.subtract(days, 'days').format('YYYY-MM-DD')
      const end = res.weekday(6).format('YYYY-MM-DD')
      return [start, end]
    },
    //  根据时间范围组，获取范围时间段内，每天的月天数
    getCalenDarByArray(arr) {
      const start = arr[0]
      const end = arr[1]
      const total = moment(end).diff(moment(start), 'days') + 1
      const startDate = moment(start)
      let array = []
      for (let index = 0; index < 7; index++) {
        const res = new Date(startDate.add(index, 'days')).getDate()
        array.push(res)
      }
      return array
    },
    //  根据时间范围组，获取范围时间段内，每天的 日期
    getWeekDateByArray(arr) {
      const start = arr[0]
      const end = arr[1]
      const total = moment(end).diff(moment(start), 'days') + 1
      let array = []
      for (let index = 0; index < total; index++) {
        const res = moment(start).add(index, 'days').format('YYYY-MM-DD')
        array.push(res)
      }
      return array
    },
    initCalendar(date = new Date()) {
      // 先要获取到本周的 日期
      // 获得当天所在的 日历周，即周日-周六 日期
      const calendar = this.getCalendarWeekDay(date)
      const LastCancel = [moment(calendar[0]).subtract(7, 'days').format('YYYY-MM-DD'), moment(calendar[1]).subtract(7, 'days').format('YYYY-MM-DD')]
      const nextCalender = [moment(calendar[0]).add(7, 'days').format('YYYY-MM-DD'), moment(calendar[1]).add(7, 'days').format('YYYY-MM-DD')]
      const current = this.filterTree(calendar)
      const last = this.filterTree(LastCancel)
      const next = this.filterTree(nextCalender)
      // 拿到当前日期的days, 更新绑定值
      const day = moment(date).format('d')
      const copyList = this.data.currentList
      copyList[day] = true
      this.setData({
        currentList: copyList,
        selectTime: moment(date).format('YYYY-MM-DD')
      })
      return [last, current, next]
    },
    filterTree(arr) {
      const calList = this.getCalenDarByArray(arr)
      const calDateList = this.getWeekDateByArray(arr)
      let array = []
      for (let index = 0; index < 7; index++) {
        array.push({
          calendarDay: moment(calDateList[index]).date(),
          calendateDay: calDateList[index],
          calList,
          calDateList,
          isCurrentDay: calDateList[index] === moment().format('YYYY-MM-DD'),
          week: this.getWeek(calDateList[index])
        })
      }
      return array
    },
    onChange(e) {
      const oldIndex = this.data.swiperCurrent
      const current = e.detail.current
      const target = this.data.swiperData
      const data = this.data.swiperData[current]
      const arr = [data[0].calendateDay, data[6].calendateDay]

      // if (current < oldIndex) {
      //   const LastCancel = [moment(arr[0]).subtract(7, 'days').format('YYYY-MM-DD'), moment(arr[1]).subtract(7, 'days').format('YYYY-MM-DD')]
      //   const last = this.filterTree(LastCancel)
      //   target.unshift(last)
      //   //  查看以前的日历
      // } else {
      //   // push 一条
      //   const nextCalender = [moment(arr[0]).add(7, 'days').format('YYYY-MM-DD'), moment(arr[1]).add(7, 'days').format('YYYY-MM-DD')]
      //   const next = this.filterTree(nextCalender)
      //   target.push(next)
      // }
      // this.setData({
      //   swiperData: target,
      //   swiperCurrent: current,
      //   oldCurrent: oldIndex
      // })
      console.log(e, '滚动切换');
    },
    selectChange(e) {
      const time = e.currentTarget.dataset.time
      this.setData({
        selectTime: time
      }, () => {
        this.triggerEvent("selectDay", time)
      })
    }
  },
  lifetimes: {
    ready() {
      const arr = this.initCalendar();
      this.setData({
        swiperData: arr
      })
    }
  },
  observers: {

  }
})