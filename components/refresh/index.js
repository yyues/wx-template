// components/refresh/index.js
Component({
    /**
     * 组件的属性列表
     */
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多 slot 支持
    },
    properties: {
        height: String,
        default: '400px'
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
        onPulling(e) {
            console.log('onPulling:', e)
        },

        onRefresh() {
            if (this._freshing) return
            this._freshing = true
            setTimeout(() => {
                this.setData({
                    triggered: false,
                })
                this._freshing = false
            }, 3000)
        },

        onRestore(e) {
            console.log('onRestore:', e)
        },

        onAbort(e) {
            console.log('onAbort', e)
        },
    }
})