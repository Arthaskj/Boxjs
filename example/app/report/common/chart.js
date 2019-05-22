/* ========================================================================
 * 作者：    牟攀
 * 创建日期：2018.05.28
 * 描述：    报表的图表,这儿统一控制样式  (这个组件改用echart代替)
 * ======================================================================== */
Box.define('Demo.report.common.chart', {
    extend: 'Box.Component',
    templates: {
        main: ['<div class="{class}" style="height:{height};width:{width}; display: inline-block; {style}"></div>']
    },

    width: '100%',//这两个都用字符串,不要用数字
    height: '100%',
    class:'',
    style:'',

    option: {}, //报表的相关配置, 参考echart

    getMainTplData: function () {
        return {
            width: this.width,
            height: this.height,
            class: this.class,
            style: this.style
        }
    },

    setup: function () {
        this.chart = echarts.init(this.el.target[0], 'shine');
        this.chart.setOption(this.option);
    },

    //设置chart属性
    setOption: function (option) {
        this.chart.setOption(option);
    },

    //绑定chart时间
    on: function (event, callBack) {
        this.chart.on(event, callBack);
    },

    dispatchAction: function (opt) {
        //echart原生的方法不支持批量设置选中/取消选中,在这儿自己处理一下pieUnSelect,在传入指定数据的时候,把所有的都取消选中
        if (opt.type == 'pieUnSelect' && !opt.seriesIndex && !opt.seriesName && !opt.dataIndex && !opt.name) {
            var chartOption = this.chart.getOption();
            Box.Array.forEach(chartOption.series, function (series) {
                Box.Array.forEach(series.data, function (data) {
                    opt.seriesName = series.name;
                    opt.name = data.name;
                    this.chart.dispatchAction(opt);
                }, this)
            }, this)
        }
        else {
            this.chart.dispatchAction(opt);
        }


    },

    showLoading: function (type, opts) {
        this.chart.showLoading(type, opts);
    },

    hideLoading: function (type, opts) {
        this.chart.hideLoading(type, opts);
    },

    resize: function () {
        this.chart.resize();
    },

    clear: function () {
        this.chart.clear();
    }

});