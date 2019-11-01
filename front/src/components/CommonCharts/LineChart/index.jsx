import React, { Component } from 'react';
import ReactEcharts from "echarts-for-react";
import 'echarts/lib/chart/lines';
import { spaceFix } from '../utils'
import _ from 'lodash'
import theme from '../utils/theme'

class LineChart extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    // console.log('ttt')
    const option = this.getOption();
    return (
        <ReactEcharts
        style={{height: '100%', width: '100%'}}
        option={option}
        lazyUpdate={true}
        notMerge={true}
        />
    )
  }
  getOption() {
    const { dataSource, config } = this.props
    let resRender = this.initData(config, dataSource)
    // console.log(resRender)
    const title = {}
    if (config.title) {
      _.extend(title, config.title)
    }

    var yLabelFormat = function(d) { return d }
    var xLabelFormat = function(d) { return d }
    if (config.yAxis && config.yAxis.yLabelFormat) {
      yLabelFormat = config.yAxis.yLabelFormat
    }
    if (config.xAxis && config.xAxis.xLabelFormat) {
      xLabelFormat = config.xAxis.xLabelFormat
    }
    const tooltipW = config.tooltip ? (config.tooltip.width || 200) : 200
    var tooltipValFormat = function(value) {
      return value
    }
    if (config.tooltip && config.tooltip.tooltipValFormat) {
      tooltipValFormat = config.tooltip.tooltipValFormat
    }

    // datazoom
    let datazoom = null
    let startVal = 0
    let endVal = 100
    if (config.itemRange && config.itemRange > 0 && dataSource.length > config.itemRange) {
      if (dataSource.length > 0) {
        var dis = dataSource.length - config.itemRange
        startVal = dis < 0 ? 0 : dis
        endVal = dataSource.length - 1
      }
      datazoom = [{
        show: true,
        height: 12,
        showDataShadow: false,
        labelFormatter: null,
        showDetail: false,
        xAxisIndex: [
          0
        ],
        bottom: config.dataZoomBottom || 0,
        startValue: startVal,
        endValue: endVal,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5'

        },
        textStyle: {
          color: '#fff' },
        borderColor: '#fff'
      }]
    }

    // legend
    let legend = {
      itemWidth: 6,
      itemHeight: 6,
      top: '10%',
      right: '5%',
      data: resRender.legends
    }
    if (config.legend) {
      _.extend(legend, config.legend)
    }

    // grid
    const grid = {
      left: '3%',
      right: '3%',
      bottom: (config.itemRange && config.itemRange > 0 && dataSource.length > config.itemRange) ? '8%' : '5%',
      top: '20%',
      containLabel: true
    }
    if (config.grid) {
      _.extend(grid, config.grid)
    }

    return {
      color: theme.COLOR_PLATE_16,
      title,
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);',
        formatter: function(params) {
          let toolTipDom = `<div class=${theme.TOOLTIP_CONTAINER_CLASS} style="width:${tooltipW}px">
                      <div class=${theme.TOOLTIP_TITLE_CLASS}>
                        <span style="float: left;">${xLabelFormat(params[0].axisValue)}</span>
                      </div>`
          params.forEach((item, index) => {
            toolTipDom += `<div class=${theme.TOOLTIP_LIST_CLASS}>
                        <span style="float: left;">${item.marker}${item.seriesName}: </span>
                        <span style="float: right;font-family: 'PingFang Medium'">${tooltipValFormat(item.value)}</span>
                      </div>`
          })
          toolTipDom += '</div>'
          return toolTipDom
        }
      },
      dataZoom: datazoom,
      legend: legend,
      grid: grid,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: resRender.xAxisNames,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#e4e3e9',
            type: 'solid'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#e4e3e9',
            type: 'solid'
          }
        },
        axisLabel: {
          show: true,
          color: theme.YAXIS_LABEL_COLOR,
          fontFamily: 'PingFang Medium',
          formatter: function(d) {
            return xLabelFormat(d)
          }
        }
      },
      yAxis: {
        type: 'value',
        name: config.yAxis ? (config.yAxis.yName || '') : '',
        nameTextStyle: {
          color: theme.YAXIS_LABEL_COLOR
        },
        nameGap: 10,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#e3e4e9',
            fontFamily: 'PingFang Medium'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e4e3e9',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: theme.YAXIS_LABEL_COLOR,
          fontFamily: 'PingFang Medium',
          formatter: function(d) {
            return yLabelFormat(d)
          }
        }
      },
      axisPointer: {
        lineStyle: {
          color: '#3b95ff'
        }
      },
      series: resRender.seriesData
    }
  }
  initData(currentCfg, currentData) {
    const seriesData = []
    const xAxisNames = []
    const legends = []
    let renderData = JSON.parse(JSON.stringify(currentData))
    // 是否开启数据补全
    if (currentCfg.autoFix && currentCfg.autoFix.fix) {
      renderData = spaceFix(renderData, {
        start: currentCfg.autoFix.beginAndEnd ? currentCfg.autoFix.beginAndEnd.start : undefined,
        end: currentCfg.autoFix.beginAndEnd ? currentCfg.autoFix.beginAndEnd.end : undefined,
        space: currentCfg.autoFix.beginAndEnd ? currentCfg.autoFix.beginAndEnd.space : 300,
        fixVal: currentCfg.autoFix.fixVal,
        key: currentCfg.key,
        zeroFill: currentCfg.value
      })
    }
    // console.log(renderData, 'adfdf')
    var stackFlag = false
    if (currentCfg.stack) {
      stackFlag = 'total'
    }
    var seriesReset = function(d) { return d }
    if (currentCfg.seriesReset) {
      seriesReset = currentCfg.seriesReset
    }
    currentCfg.seriesName.forEach((series, index) => {
      let seriesItem = {
        name: series,
        type: 'line',
        smooth: true,
        stack: stackFlag,
        valueKey: currentCfg.value[index],
        data: []
      }
      if (stackFlag) {
        seriesItem.areaStyle = {}
      }
      seriesItem = seriesReset(seriesItem)
      seriesData.push(seriesItem)
      legends.push({
        name: series,
        icon: 'circle'
      })
    })
    if (currentCfg.key) {
      renderData.forEach(item => {
        xAxisNames.push(item[currentCfg.key])
        seriesData.forEach((sItem, sindex) => {
          const sItemDataItem = {
            name: sItem.name,
            value: item[sItem.valueKey] || 0,
            dataKeyVal: item[currentCfg.key]
          }
          sItem.data.push(sItemDataItem)
        })
      })
    }

    return {
      seriesData,
      xAxisNames,
      legends
    }
  }
}

export default LineChart